Write-Host "Starting LivingLink Services Locally..." -ForegroundColor Cyan

# Start PostgreSQL if not already running (this assumes it's installed as a local service, 
# otherwise you might need to start it manually)
Write-Host "Note: Please ensure your local PostgreSQL is running on port 5432 and the databases are created!" -ForegroundColor Yellow

$services = @(
    "service-registry", 
    "api-gateway", 
    "auth-service", 
    "profile-service", 
    "listing-service", 
    "preference-service", 
    "matching-service", 
    "visit-service", 
    "notification-service", 
    "review-service"
)

foreach ($svc in $services) {
    Write-Host "Starting $svc..." -ForegroundColor Green
    $jarPath = "d:\LivingLink\backend\$svc\target\$svc-0.0.1-SNAPSHOT.jar"
    
    if (Test-Path $jarPath) {
        # Start each service in its own minimized PowerShell window
        Start-Process -FilePath "java" -ArgumentList "-jar", $jarPath -WindowStyle Minimized
        Start-Sleep -Seconds 5 # Give it a few seconds to start before moving to the next
    } else {
        Write-Host "Could not find $jarPath. Please ensure the project is built." -ForegroundColor Red
    }
}

Write-Host "All services have been launched in separate windows!" -ForegroundColor Cyan
Write-Host "The API Gateway should be accessible at http://localhost:8080 once they are fully booted." -ForegroundColor Cyan
