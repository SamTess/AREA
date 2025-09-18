<#
.SYNOPSIS
  Load a dotenv file into the current PowerShell session.

.DESCRIPTION
  Dot-source this script to import variables from a .env file into the current session's environment.

.USAGE
  . .\load-env.ps1 -Path .env

  Important: The leading dot and space are required to run in the current session.
#>

param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$Path
)

if (-not (Test-Path -Path $Path -PathType Leaf)) {
  Write-Error "Env file not found: $Path"
  return
}

Get-Content -Raw -Path $Path -ErrorAction Stop | # ensure entire content read (keeps CRLF handling)
  ForEach-Object { $_ -split "\r?\n" } | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    if ($line -match '^\s*export\s+') { $line = $line -replace '^\s*export\s+','' }

    $m = [regex]::Match($line, '^\s*([^=]+)=(.*)$')
    if (-not $m.Success) { return }
    $key = $m.Groups[1].Value.Trim()
    $value = $m.Groups[2].Value.Trim()

    if ($value.StartsWith('"') -and $value.EndsWith('"')) {
      $value = $value.Trim('"')
    } elseif ($value.StartsWith("'") -and $value.EndsWith("'")) {
      $value = $value.Trim("'")
    } else {
      # remove inline comment after # for unquoted values
      $value = $value -replace '\s*#.*$',''
    }

    # Remove trailing CR if present
    $value = $value -replace '\r$',''

    if ($key -eq '') { return }

    # Set as environment variable for the current process and session
    Set-Item -Path "env:$key" -Value $value
  }

Write-Verbose "Loaded environment variables from $Path"
