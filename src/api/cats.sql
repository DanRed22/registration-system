
CREATE TABLE `members` (
  `id` bigint(20) NOT NULL,
  `name` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `year` int(1) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `regular` tinyint(1) DEFAULT NULL,
  `organization` varchar(100) DEFAULT NULL,
  `timeIn` varchar(50) DEFAULT NULL,
  `timeOut` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `signature` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `members`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;