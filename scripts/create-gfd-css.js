import fs from 'node:fs/promises';
import path from 'node:path';

/*
Usage: Extract game/sqpack/ffxiv/000000.win32.index/common/font/gfdata.gfd and
place it next to this script. Then just run the script with node.
*/

const version = '7.2';

const getGfd = async () => {
  const buffer = await fs.readFile(
    path.join(import.meta.dirname, 'gfdata.gfd'),
  );
  const dataView = new DataView(buffer.buffer);
  const count = dataView.getInt32(8, true);
  const entries = new Array(count);
  for (let i = 0; i < count; i++) {
    const offset = 0x10 + i * 0x10;
    entries[i] = {
      id: dataView.getInt16(offset, true),
      left: dataView.getInt16(offset + 2, true),
      top: dataView.getInt16(offset + 4, true),
      width: dataView.getInt16(offset + 6, true),
      height: dataView.getInt16(offset + 8, true),
      unk0A: dataView.getInt16(offset + 10, true),
      redirect: dataView.getInt16(offset + 12, true),
      unk0E: dataView.getInt16(offset + 14, true),
    };
  }
  return entries;
};

const gfd = await getGfd();

let output = `/* This file was generated with scripts/create-gfd-css.js */
.gfd-game-version { display: inline; }
.gfd-game-version::after { content: '${version}'; }
.gfd-icon {
  --w: 20;
  --h: 20;
  --x: 0;
  --y: 0;
  --scale: 2;
  --y-offset: 340;
  display: inline-block;
  aspect-ratio: calc(var(--w) / var(--h));
  width: calc(var(--w) * 1px);
  height: calc(var(--h) * 1px);
  background-image: url('https://v2.xivapi.com/api/asset?path=common/font/fonticon_xinput.tex&format=png&version=${version}');
  background-repeat: no-repeat;
  background-size: calc(512px * (1 / var(--scale))) calc(1024px * (1 / var(--scale)));
  background-position: 
    calc(var(--x) * var(--scale) * -1px * (1 / var(--scale))) 
    calc((var(--y) * var(--scale) * -1px + var(--y-offset) * -1px) * (1 / var(--scale)));
  vertical-align: middle;
}
`;

/*
Responsive version would be:

.gfd-icon {
  --scale: 1;
  --y-offset: 0;
}

@media (min-resolution: 1.5dppx) {
  .gfd-icon {
    --scale: 2;
    --y-offset: 340;
  }
}

but why wouldn't we just default to higher quality icons?
*/

for (let entry of gfd) {
  if (entry.width == 0 || entry.height == 0) continue;

  if (
    entry.left == 0 &&
    entry.top == 0 &&
    entry.width == 20 &&
    entry.height == 20
  )
    continue;

  output += `.gfd-icon-${entry.id} {`;

  if (entry.width != 20) output += ` --w: ${entry.width};`;
  if (entry.height != 20) output += ` --h: ${entry.height};`;
  if (entry.left != 0) output += ` --x: ${entry.left};`;
  if (entry.top != 0) output += ` --y: ${entry.top};`;

  output += ` }\n`;
}

await fs.writeFile(
  path.join(import.meta.dirname, '..', 'src', 'css', 'gfd-icons.css'),
  new TextEncoder().encode(output),
);
