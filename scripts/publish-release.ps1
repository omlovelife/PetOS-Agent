# Upload local desktop installers to omlovelife/PetOS-Agent Releases.
# Requires: gh auth login
param(
  [string]$Version = "0.1.0",
  [string]$Installer = "",
  [string]$LatestYml = ""
)

$ErrorActionPreference = "Stop"
$repo = "omlovelife/PetOS-Agent"
$tag = "v$Version"

if (-not $Installer) {
  $Installer = Join-Path $PSScriptRoot "..\..\PetOS\apps\desktop\release\PetOS-Setup-$Version.exe"
  $Installer = [System.IO.Path]::GetFullPath($Installer)
}
if (-not $LatestYml) {
  $LatestYml = Join-Path $PSScriptRoot "..\..\PetOS\apps\desktop\release\latest.yml"
  $LatestYml = [System.IO.Path]::GetFullPath($LatestYml)
}

if (-not (Test-Path $Installer)) { throw "Installer not found: $Installer" }
if (-not (Test-Path $LatestYml)) { throw "latest.yml not found: $LatestYml" }

gh release view $tag --repo $repo 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Release $tag exists — uploading assets..."
  gh release upload $tag $Installer $LatestYml --repo $repo --clobber
} else {
  Write-Host "Creating release $tag..."
  gh release create $tag $Installer $LatestYml `
    --repo $repo `
    --title "PetOS $Version" `
    --notes "PetOS 桌面端 $Version`n`n安装后打开即可使用。需自备 OpenAI 兼容 API。"
}

Write-Host "Done: https://github.com/$repo/releases/tag/$tag"
