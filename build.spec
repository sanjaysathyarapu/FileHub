version: 0.2

phases:
  install:
    runtime-versions:
      java: corretto17
    commands:
      - echo Checking Java and Gradle versions
      - java -version
      - chmod +x ./gradlew
      - ./gradlew -v
  build:
    commands:
      - ./gradlew build
  post_build:
    commands:
      - echo Build completed
artifacts:
  files:
    - target/*.jar
  discard-paths: yes