# Stage 1: Build the application
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# Fix for windows line endings and permissions
RUN sed -i 's/\r$//' mvnw
RUN chmod +x mvnw
# improved dependency caching - verify often works better than go-offline for plugins
# Simpler approach: Copy source and build directly to avoid 'no source' errors during verify
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-Dspring.main.lazy-initialization=true", "-jar", "app.jar"]
