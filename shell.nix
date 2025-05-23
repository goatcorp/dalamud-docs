# Note that you will need to use NIXPKGS_ALLOW_INSECURE as .NET 6 is EOL.
# Unfortunately, we use .NET 6 for DocFxMarkdownGen.
{ pkgs ? import <nixpkgs> {} }:

let
  # Create a unified .NET environment by combining all SDK versions
  unifiedDotnet = pkgs.runCommand "dotnet-unified" {
    buildInputs = [ pkgs.rsync ];
  } ''
    mkdir -p $out/share/dotnet

    # Use rsync to properly merge directories without conflicts
    ${pkgs.lib.concatMapStringsSep "\n" (sdk: ''
      if [ -d "${sdk}/share/dotnet" ]; then
        ${pkgs.rsync}/bin/rsync -a "${sdk}"/share/dotnet/ $out/share/dotnet/
      fi
    '') [pkgs.dotnet-sdk_6 pkgs.dotnet-sdk_8 pkgs.dotnet-sdk_9]}

    # Ensure the main dotnet executable is executable
    chmod +x $out/share/dotnet/dotnet
  '';
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    # Node.js and pnpm
    nodejs_20
    pnpm

    # .NET SDK with multiple versions
    unifiedDotnet

    # Git (for checkout operations)
    git

    # Additional tools that might be useful
    curl
    wget
  ];

  # Environment variables matching the GitHub Actions workflow
  shellHook = ''
    export NODE_OPTIONS="--max-old-space-size=16384"
    export DOCUSAURUS_SSR_CONCURRENCY="10"

    # Set up .NET tools path
    export DOTNET_ROOT="${unifiedDotnet}/share/dotnet"
    export PATH="$HOME/.dotnet/tools:$DOTNET_ROOT:$PATH"

    # Install .NET global tools if they don't exist
    if ! command -v docfx &> /dev/null; then
      echo "Installing docfx..."
      dotnet tool install -g docfx
    fi

    if ! command -v DocFxMarkdownGen &> /dev/null; then
      echo "Installing DocFxMarkdownGen..."
      dotnet tool install -g DocFxMarkdownGen
    fi
  '';
}
