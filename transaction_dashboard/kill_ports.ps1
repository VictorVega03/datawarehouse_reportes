# kill_ports.ps1
# Mata procesos que usan los puertos 3000 y 3001

$ports = @(3000, 3001)
foreach ($port in $ports) {
    $pids = Get-NetTCPConnection -LocalPort $port -State Listen | Select-Object -ExpandProperty OwningProcess
    foreach ($pid in $pids) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Proceso $pid en puerto $port detenido."
        } catch {
            Write-Host "No se pudo detener el proceso $pid en puerto $port."
        }
    }
}