import { Octokit } from '@octokit/rest';
import fs from 'fs';
import { execSync as exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const mainBranchName = 'master';
const versionBranchRegex = /^v[\d\.]+$/;

// shim for __dirname in ESM
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

// get the list of branches for goatcorp/Dalamud
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
let { data: branches } = await octokit.repos.listBranches({
  owner: 'goatcorp',
  repo: 'Dalamud',
});

branches = branches.filter(
  (branch) =>
    branch.name === mainBranchName || branch.name.match(versionBranchRegex),
);

// for each branch, read the file at Dalamud/Dalamud.csproj
// and extract the version from the <DalamudVersion> tag
let versions = {};
for (const branch of branches) {
  let { data: file } = await octokit.repos.getContent({
    owner: 'goatcorp',
    repo: 'Dalamud',
    path: 'Dalamud/Dalamud.csproj',
    ref: branch.name,
  });

  if (file.encoding === 'base64') {
    file = Buffer.from(file.content, 'base64').toString();
  } else {
    file = file.content;
  }

  const versionParts = file
    .match(/<DalamudVersion>([\d\.]+)<\/DalamudVersion>/)[1]
    .split('.');
  const majorVersion = parseInt(versionParts[0]);

  versions[branch.name] = majorVersion;
  console.log(`${branch.name}: major version: ${majorVersion}`);
}

// sort the versions from newest to oldest major
const sortedVersions = Object.entries(versions).sort((a, b) => b[1] - a[1]);

// write api_versions.json for Docusaurus, with just the branch names
fs.writeFileSync(
  'api_versions.json',
  JSON.stringify(sortedVersions.map((v) => v[0])),
);

// write dalamud-versions.json for docusaurus.config.js to use
let dalamudVersions = {};
for (const [branch, majorVersion] of sortedVersions) {
  let apiLevel = majorVersion;
  if (branch === mainBranchName) apiLevel = 8; // todo: remove this after v9 release

  let meta = {};

  meta = {
    label: `${majorVersion}.x (API ${apiLevel})`,
  };

  if (majorVersion > versions[mainBranchName]) {
    meta.banner = 'unreleased';
    meta.label = `${meta.label} 🚧`;
  } else if (branch === mainBranchName) {
    meta.label = `${meta.label} [Current]`;
  } else {
    meta.banner = 'unmaintained';
    meta.label = `${meta.label} [Legacy]`;
  }

  dalamudVersions[branch] = meta;
}

fs.writeFileSync('dalamud-versions.json', JSON.stringify(dalamudVersions));
console.log('Successfully updated version metadata files.');

// pull, build, and generate metadata for each version
const tempDir = process.env['RUNNER_TEMP'] || process.env['TEMP'] || '/tmp';
const execOptions = { stdio: 'inherit' };
const isWindows = process.platform === 'win32';

for (const branch of Object.keys(versions)) {
  console.log(`==> Generating API documentation for branch ${branch}...`);

  // TODO: set up actions caching for Dalamud builds
  exec(
    `git clone --recursive --depth 1 --branch ${branch} https://github.com/goatcorp/Dalamud Dalamud-${branch}`,
    { cwd: tempDir, ...execOptions },
  );

  const branchDir = path.join(tempDir, `Dalamud-${branch}`);

  // build Dalamud
  if (isWindows) {
    exec('.\\build.ps1 CompileDalamud -Configuration Release', {
      cwd: branchDir,
      shell: 'pwsh.exe',
      ...execOptions,
    });
  } else {
    exec(
      'bash ./build.sh CompileDalamud -Configuration Release /p:EnableWindowsTargeting=true',
      {
        cwd: branchDir,
        ...execOptions,
      },
    );
  }

  // generate metadata
  exec('docfx metadata', { cwd: branchDir, ...execOptions });

  // execute dfmg
  exec('dfmg', {
    cwd: branchDir,
    env: {
      ...process.env,
      DFMG_CONFIG: path.join(__dirname, 'dfmg-config.yml'),
      DFMG_OUTPUT_PATH: path.join(
        __dirname,
        'api_versioned_docs',
        `version-${branch}`,
      ),
      DFMG_YAML_PATH: path.join(branchDir, 'api'),
    },
    ...execOptions,
  });

  // copy the placeholder sidebar file
  fs.copyFileSync(
    path.join(
      __dirname,
      'api_versioned_sidebars',
      'version-placeholder-sidebars.json',
    ),
    path.join(
      __dirname,
      'api_versioned_sidebars',
      `version-${branch}-sidebars.json`,
    ),
  );

  console.log(`==> Finished generating API documentation for branch ${branch}`);
}

console.log('=> API doc generation complete! 🎉');

// now we can actually build the docs
console.log('=> Running `pnpm run build`...');

exec('pnpm run build', { cwd: __dirname, ...execOptions });

console.log('=> Docs built successfully! 🎉');
process.exit(0); // good ol' escape hatch
