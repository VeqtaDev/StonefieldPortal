Param(
  [string]$ImagesFolder = "..\images\clothes",
  [string]$OutFile = "..\images\clothes\manifest.json"
)

$ErrorActionPreference = 'Stop'

if (!(Test-Path $ImagesFolder)) {
  Write-Error "Dossier introuvable: $ImagesFolder"
}

# -Include nécessite un wildcard dans -Path ou -Recurse. On passe en -Recurse
$files = Get-ChildItem -Path $ImagesFolder -File -Recurse | Where-Object { $_.Extension -in '.png','.jpg','.jpeg' } | Sort-Object FullName

$items = @()
foreach ($f in $files) {
  # Exemple de nom: male_11_150.png => sexe composant drawable
  $name = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
  $parts = $name.Split('_')
  $obj = [ordered]@{
    img = $f.Name
  }
  if ($parts.Length -ge 3) {
    $obj.gender = $parts[0]
    $obj.component = $parts[1]
    $obj.drawable = $parts[2]
    $obj.name = "$($parts[0]) c$($parts[1]) #$($parts[2])"
    $obj.code = $name
  } else {
    $obj.name = $name
    $obj.code = $name
  }
  $items += [pscustomobject]$obj
}

$json = $items | ConvertTo-Json -Depth 4
Set-Content -Path $OutFile -Value $json -Encoding UTF8
Write-Host "Manifest ecrit: $OutFile (${($items.Count)} elements)"


