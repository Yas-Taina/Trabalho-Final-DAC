FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
CMD ["java", "-jar", "target/conta.jar"]