Backend Spring Boot Application
===============================

Includes:
- Java 21
- Spring Boot (web, security, data-jpa, redis, actuator, validation)
- PostgreSQL + Flyway
- Dockerfile and docker-compose.yml


### Run the project

**Since java does not support env files directly, you will first need to run the load-env script of your OS (in ./scripts) if you want to run it manuallly.**
``` bash
# Windows (PowerShell)
./scripts/load-env.ps1 backend/.env
# Linux / MacOS
source ./scripts/load-env.sh backend/.env
```

**Then you can choose one of the following commands to run the backend.**
**Make sure you have a PostgreSQL and Redis instance running on the right port (see docker-compose.yml for easy setup).**

``` bash
# Run development server
mvn -f backend/pom.xml -DskipTests spring-boot:run

# Build jar and run it
mvn -f backend/pom.xml -DskipTests package
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar

# Run with docker
cd backend
docker compose up --build
```
