-- CreateTable
CREATE TABLE `members` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` TEXT NULL,
    `email` TEXT NULL,
    `year` INTEGER NULL,
    `course` VARCHAR(100) NULL,
    `regular` BOOLEAN NULL,
    `organization` VARCHAR(100) NULL,
    `position` VARCHAR(255) NULL,
    `timeIn` VARCHAR(50) NULL,
    `timeOut` VARCHAR(50) NULL,
    `remarks` TEXT NULL,
    `signature` TEXT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `isEventCommittee` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
