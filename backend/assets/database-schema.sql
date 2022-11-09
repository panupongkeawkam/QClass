DROP SCHEMA IF EXISTS `q-class-mobile-application`;

CREATE SCHEMA `q-class-mobile-application`;

USE `q-class-mobile-application`;

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
    `userId` INT(10) AUTO_INCREMENT,
    `registerDatetime` DATETIME,
    PRIMARY KEY (`userId`)
);

DROP TABLE IF EXISTS `Room`;

CREATE TABLE `Room` (
    `roomId` INT(10) AUTO_INCREMENT,
    `userId` INT(10) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `iconName` VARCHAR(255),
    `inviteCode` VARCHAR(255) UNIQUE NOT NULL,
    `createDatetime` DATETIME,
    `member` INT(10) NOT NULL DEFAULT 0,
    PRIMARY KEY (`roomId`),
    FOREIGN KEY (`userId`)
        REFERENCES `User` (`userId`)
);

DROP TABLE IF EXISTS `Participant`;

CREATE TABLE `Participant` (
    `participantId` INT(10) AUTO_INCREMENT,
    `roomId` INT(10) NOT NULL,
    `userId` INT(10) NOT NULL,
    `joinedDatetime` DATETIME,
    `name` VARCHAR(255) DEFAULT 'Anonymous',
    `state` ENUM('joined', 'left'),
    PRIMARY KEY (`participantId`),
    FOREIGN KEY (`userId`)
        REFERENCES `User` (`userId`),
    FOREIGN KEY (`roomId`)
        REFERENCES `Room` (`roomId`)
);

DROP TABLE IF EXISTS `Announcement`;

CREATE TABLE `Announcement` (
    `announcementId` INT(10) AUTO_INCREMENT,
    `roomId` INT(10) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `createDatetime` DATETIME,
    PRIMARY KEY (`announcementId`),
    FOREIGN KEY (`roomId`)
        REFERENCES `Room` (`roomId`)
);

DROP TABLE IF EXISTS `Quiz`;

CREATE TABLE `Quiz` (
    `quizId` INT(10) AUTO_INCREMENT,
    `roomId` INT(10) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `questionLength` INT(10) NOT NULL,
    `createDatetime` DATETIME,
    `state` ENUM('attempting', 'ended'),
    PRIMARY KEY (`quizId`),
    FOREIGN KEY (`roomId`)
        REFERENCES `Room` (`roomId`)
);

DROP TABLE IF EXISTS `Score`;

CREATE TABLE `Score` (
    `scoreId` INT(10) AUTO_INCREMENT,
    `quizId` INT(10) NOT NULL,
    `participantId` INT(10) NOT NULL,
    `point` INT(10),
    `totalAttempting` INT(10),
    `fullScore` INT(10),
    `createDatetime` DATETIME,
    PRIMARY KEY (`scoreId`),
    FOREIGN KEY (`quizId`)
        REFERENCES `Quiz` (`quizId`),
    FOREIGN KEY (`participantId`)
        REFERENCES `Participant` (`participantId`)
);

DROP TABLE IF EXISTS `Question`;

CREATE TABLE `Question` (
    `questionId` INT(10) AUTO_INCREMENT,
    `quizId` INT(10) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `type` ENUM('choice', 'text'),
    `timer` INT(10),
    `correct` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`questionId`),
    FOREIGN KEY (`quizId`)
        REFERENCES `Quiz` (`quizId`)
);

DROP TABLE IF EXISTS `Survey`;

CREATE TABLE `Survey` (
    `surveyId` INT(10) AUTO_INCREMENT,
    `roomId` INT(10) NOT NULL,
    `participantId` INT(10) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `createDatetime` DATETIME,
    `state` ENUM('attempting', 'ended'),
    PRIMARY KEY (`surveyId`),
    FOREIGN KEY (`participantId`)
        REFERENCES `Participant` (`participantId`),
    FOREIGN KEY (`roomId`)
        REFERENCES `Room` (`roomId`)
);

DROP TABLE IF EXISTS `Choice`;

CREATE TABLE `Choice` (
    `choiceId` INT(10) AUTO_INCREMENT,
    `surveyId` INT(10),
    `questionId` INT(10),
    `title` VARCHAR(255),
    `index` INT(10),
    PRIMARY KEY (`choiceId`),
    FOREIGN KEY (`surveyId`)
        REFERENCES `Survey` (`surveyId`),
    FOREIGN KEY (`questionId`)
        REFERENCES `Question` (`questionId`)
);

DROP TABLE IF EXISTS `Response`;

CREATE TABLE `Response` (
    `responseId` INT(10) AUTO_INCREMENT,
    `surveyId` INT(10),
    `participantId` INT(10) NOT NULL,
    `answered` VARCHAR(255),
    `createDatetime` DATETIME,
    PRIMARY KEY (`responseId`),
    FOREIGN KEY (`participantId`)
        REFERENCES `Participant` (`participantId`),
    FOREIGN KEY (`surveyId`)
        REFERENCES `Survey` (`surveyId`)
);


DROP TABLE IF EXISTS `Result`;

CREATE TABLE `Result` (
    `roomId` INT(10) NOT NULL,
    `resultId` INT(10) AUTO_INCREMENT,
    `jsonData` TEXT,
    `createDatetime` DATETIME,
    PRIMARY KEY (`resultId`),
    FOREIGN KEY (`roomId`)
        REFERENCES `Room` (`roomId`)
);