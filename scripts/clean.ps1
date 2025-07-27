# Script de limpieza de caché para Windows PowerShell
Write-Host "🧹 Limpiando caché de Vite y dependencias..." -ForegroundColor Yellow

# Limpiar caché de Vite
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    Write-Host "✅ Caché de Vite eliminado" -ForegroundColor Green
}

# Limpiar dist
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Directorio dist eliminado" -ForegroundColor Green
}

# Limpiar caché de npm (opcional)
Write-Host "🔄 Limpiando caché de npm..." -ForegroundColor Blue
npm cache clean --force

Write-Host "✨ Limpieza completada!" -ForegroundColor Green
Write-Host "Ejecuta 'npm run dev' o 'npm run build' para continuar" -ForegroundColor Cyan
