FROM openjdk:17
CMD ["./gradlew", "clean", "build"]
ARG JAR_FILE=build/libs/homeggu-pay-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]