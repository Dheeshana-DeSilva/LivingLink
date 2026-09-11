# Build all microservices
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
    Write-Host "Building $svc..." -ForegroundColor Cyan
    Push-Location "d:\LivingLink\backend\$svc"
    
    # We use mvn.cmd or mvnw.cmd depending on what's available
    if (Test-Path ".\mvnw.cmd") {
        .\mvnw.cmd clean package -DskipTests
    } else {
        mvn clean package -DskipTests
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build $svc!" -ForegroundColor Red
        Pop-Location
        exit $LASTEXITCODE
    }
    Pop-Location
}

Write-Host "All services built successfully!" -ForegroundColor Green
