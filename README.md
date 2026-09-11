# LivingLink - Microservices Backend

LivingLink is a comprehensive, production-ready Roommate and Accommodation Matching platform. It empowers users to find compatible roommates, list accommodations, schedule physical visits, and leave verified reviews. 

The backend is built with a highly scalable **Microservices Architecture** leveraging **Spring Boot 4.1.0**, **Spring Cloud**, and **Docker**.

## 🏗️ Architecture
The system is divided into 10 independent microservices communicating securely via a centralized API Gateway and Eureka Service Registry.

### Core Architecture Components
- **API Gateway (Port 8080):** The single entry point for the frontend application. It routes traffic to the appropriate microservices using Eureka service discovery.
- **Service Registry (Port 8761):** Netflix Eureka instance that allows all internal microservices to discover each other dynamically.
- **PostgreSQL Database:** A centralized Postgres container hosting 7 strictly separated logical databases, ensuring true microservice data isolation.

### The Microservices
| Microservice | Port | Description |
|---|---|---|
| **Auth Service** | 8081 | Handles user registration, login, and generates JWT tokens. |
| **Profile Service** | 8082 | Manages user profiles (name, age, bio, lifestyle habits). |
| **Listing Service** | 8083 | Manages accommodation listings (rent, deposit, amenities). |
| **Preference Service** | 8084 | Stores user preferences for their ideal roommate/accommodation. |
| **Matching Service** | 8090 | Calculates compatibility scores dynamically based on Profiles and Preferences. |
| **Visit Service** | 8085 | Handles physical visit scheduling (Pending, Accepted, Rejected). |
| **Notification Service** | 8086 | Dispatches alerts across the system for various events. |
| **Review Service** | 8087 | Allows verified users to leave reviews for listings and roommates. |

## 🛠️ Technologies Used
- **Language:** Java 21
- **Framework:** Spring Boot 4.1.0
- **Service Discovery & Routing:** Spring Cloud Netflix Eureka, Spring Cloud Gateway
- **Inter-Service Communication:** OpenFeign
- **Database:** PostgreSQL & Spring Data JPA
- **Security:** Spring Security & JSON Web Tokens (JJWT 0.12.6)
- **Containerization:** Docker & Docker Compose

## 🔐 Authentication & Security
The platform uses **Stateless JWT Authentication**. 
1. The user logs in via the Auth Service and receives a JWT.
2. The user passes the JWT as a `Bearer` token in the `Authorization` header to the API Gateway.
3. The API Gateway routes the request to the target microservice.
4. The target microservice uses a globally shared `JwtAuthenticationFilter` to validate the token and extract the `userId`.
5. For inter-service communication (e.g., Visit Service calling Notification Service), a custom `FeignClientInterceptor` automatically propagates the JWT downstream.

## 🗄️ Database Architecture
True to microservice patterns, each service controls its own schema. A single PostgreSQL container initializes the following 7 databases on startup:
1. `livinglink_auth_db`
2. `livinglink_profile_db`
3. `livinglink_listing_db`
4. `livinglink_preference_db`
5. `livinglink_visit_db`
6. `livinglink_notification_db`
7. `livinglink_review_db`

## 🚀 Key API Endpoints
All external requests must be directed to the API Gateway at `http://localhost:8080`.

**Authentication (`/api/auth/**`)**
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and receive a JWT

**Profiles & Preferences**
- `GET /api/profiles/me` - Get current user profile
- `POST /api/preferences` - Set roommate/housing preferences

**Accommodations & Matching**
- `GET /api/listings` - View available accommodations
- `GET /api/matches/calculate` - Dynamically score and rank compatible roommates

**Visits & Reviews**
- `POST /api/visits` - Request to visit a listing
- `PUT /api/visits/{id}/accept` - Accept a visit request (Triggers a Notification)
- `POST /api/reviews` - Leave an accommodation or roommate review (Requires an ACCEPTED visit relationship)

## 🐳 How to Run via Docker (Recommended)
You can launch the entire ecosystem using Docker Compose.

**1. Build the Microservices**
Compile the `.jar` files for all services using the provided PowerShell script:
```powershell
cd backend
.\build-all.ps1
```

**2. Start Docker Compose**
Launch the database, registry, gateway, and all 8 business services:
```powershell
docker-compose up --build
```
*Note: Wait approximately 30-60 seconds for Eureka to fully boot and register all services. Once the logs show services registering with Eureka, the API is ready!*

## 💻 How to Run Locally (Without Docker)
If you prefer to run services manually for debugging:
1. Install PostgreSQL and create the databases listed in the architecture section manually.
2. Ensure you have Java 21 installed.
3. Start the **Service Registry** first:
   ```bash
   cd backend/service-registry
   .\mvnw.cmd spring-boot:run
   ```
4. Start the **API Gateway**:
   ```bash
   cd backend/api-gateway
   .\mvnw.cmd spring-boot:run
   ```
5. Start the individual business microservices in the same way. 

## 🧪 Testing Instructions
1. Import the APIs into Postman.
2. Direct all calls to `localhost:8080` (The Gateway).
3. First, call `POST /api/auth/register` to create two users.
4. Call `POST /api/auth/login` to obtain a JWT for your first user.
5. In Postman, go to the **Authorization** tab, select **Bearer Token**, and paste your JWT.
6. You can now access protected endpoints like `POST /api/profiles` or `POST /api/listings` securely!