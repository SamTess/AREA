Backend Spring Boot project (AREA) - skeleton

Includes:
- Java 21
- Spring Boot (web, security, data-jpa, redis, actuator, validation)
- PostgreSQL + Flyway
- Dockerfile and docker-compose.yml

Run locally with Docker:

```
# Build jar
mvn -f backend/pom.xml -DskipTests package

# Run compose
cd backend; docker compose up --build
```
