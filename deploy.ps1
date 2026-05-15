$ErrorActionPreference = "Stop"

$SERVER   = "zn-server"
$REMOTE   = "/root/Nginx"
$NGINX    = "/usr/share/nginx/dist"
$TAR      = "dist.tar.gz"
$SSH_OPTS = "-o StrictHostKeyChecking=accept-new"

function Exec {
    param([string]$Command)
    Write-Host "> $Command" -ForegroundColor DarkGray
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Command failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Write-Host "=== [1/6] Building ===" -ForegroundColor Cyan
Exec "npm run build"

Write-Host "=== [2/6] Packing dist.tar.gz ===" -ForegroundColor Cyan
Exec "tar -czvf $TAR dist"

Write-Host "=== [3/6] Uploading to $SERVER`:$REMOTE ===" -ForegroundColor Cyan
Exec "scp $SSH_OPTS $TAR `"$SERVER`:$REMOTE`""

Write-Host "=== [4/6] Removing old dist on server ===" -ForegroundColor Cyan
Exec "ssh $SSH_OPTS $SERVER `"rm -rf $NGINX`""

Write-Host "=== [5/6] Extracting on server ===" -ForegroundColor Cyan
Exec "ssh $SSH_OPTS $SERVER `"sudo tar -xzvf $REMOTE/$TAR -C /usr/share/nginx`""

Write-Host "=== [6/6] Reloading nginx ===" -ForegroundColor Cyan
Exec "ssh $SSH_OPTS $SERVER `"sudo nginx -s reload`""

Write-Host "=== Done ===" -ForegroundColor Green
