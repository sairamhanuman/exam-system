-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: exam_system
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `batch_master`
--

DROP TABLE IF EXISTS `batch_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `batch_name` varchar(20) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `batch_name` (`batch_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_master`
--

LOCK TABLES `batch_master` WRITE;
/*!40000 ALTER TABLE `batch_master` DISABLE KEYS */;
INSERT INTO `batch_master` VALUES (1,'2021',1,'2026-01-26 14:27:53'),(2,'2022',1,'2026-01-26 14:28:19'),(3,'2023',1,'2026-01-26 14:28:24'),(4,'2024',1,'2026-01-26 14:28:28'),(6,'2025',1,'2026-01-26 14:28:45'),(7,'2026',1,'2026-01-26 14:28:53');
/*!40000 ALTER TABLE `batch_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_master`
--

DROP TABLE IF EXISTS `branch_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programme_id` int NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_branch` (`programme_id`,`branch_name`),
  CONSTRAINT `branch_master_ibfk_1` FOREIGN KEY (`programme_id`) REFERENCES `programme_master` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_master`
--

LOCK TABLES `branch_master` WRITE;
/*!40000 ALTER TABLE `branch_master` DISABLE KEYS */;
INSERT INTO `branch_master` VALUES (1,1,'AIML','2026-01-26 09:33:11',1),(2,1,'ME','2026-01-26 09:33:17',1),(3,1,'CSE','2026-01-26 09:33:19',1),(4,1,'CSD','2026-01-26 09:33:23',1),(6,2,'CESP','2026-01-26 09:33:36',1),(7,2,'DE','2026-01-26 09:33:38',1),(9,3,'MBA','2026-01-26 09:36:13',1),(10,1,'CSN','2026-01-26 11:51:28',1),(11,1,'ECE','2026-01-26 11:51:37',1),(12,1,'ECI','2026-01-26 11:51:53',1);
/*!40000 ALTER TABLE `branch_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programme_master`
--

DROP TABLE IF EXISTS `programme_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programme_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programme_name` varchar(100) NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programme_name` (`programme_name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programme_master`
--

LOCK TABLES `programme_master` WRITE;
/*!40000 ALTER TABLE `programme_master` DISABLE KEYS */;
INSERT INTO `programme_master` VALUES (1,'B.Tech',1,'2026-01-26 08:26:55'),(2,'M.Tech',1,'2026-01-26 08:27:03'),(3,'MBA',1,'2026-01-26 08:27:06'),(11,'M.Com',1,'2026-01-26 09:28:10');
/*!40000 ALTER TABLE `programme_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regulation_master`
--

DROP TABLE IF EXISTS `regulation_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regulation_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `regulation_name` varchar(20) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `regulation_name` (`regulation_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regulation_master`
--

LOCK TABLES `regulation_master` WRITE;
/*!40000 ALTER TABLE `regulation_master` DISABLE KEYS */;
INSERT INTO `regulation_master` VALUES (1,'URR-18',1,'2026-01-26 12:05:19'),(4,'URR-24',1,'2026-01-26 14:21:16');
/*!40000 ALTER TABLE `regulation_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_master`
--

DROP TABLE IF EXISTS `section_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_name` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_name` (`section_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_master`
--

LOCK TABLES `section_master` WRITE;
/*!40000 ALTER TABLE `section_master` DISABLE KEYS */;
INSERT INTO `section_master` VALUES (1,'Sec-I','2026-01-26 14:35:10'),(2,'Sec-II','2026-01-26 14:35:17'),(4,'Sec-III','2026-01-26 14:35:49'),(6,'Sec-IV','2026-01-26 14:36:17');
/*!40000 ALTER TABLE `section_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semester_master`
--

DROP TABLE IF EXISTS `semester_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `semester_name` varchar(20) NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `semester_name` (`semester_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semester_master`
--

LOCK TABLES `semester_master` WRITE;
/*!40000 ALTER TABLE `semester_master` DISABLE KEYS */;
INSERT INTO `semester_master` VALUES (1,'I',1,'2026-01-26 11:57:16'),(2,'II',1,'2026-01-26 11:57:25'),(3,'III',1,'2026-01-26 11:58:01'),(4,'IV',1,'2026-01-26 11:58:03'),(5,'V',1,'2026-01-26 11:58:05'),(6,'VI',1,'2026-01-26 11:58:09'),(7,'VII',1,'2026-01-26 11:58:12'),(8,'VIII',1,'2026-01-26 11:58:15'),(9,'IX',0,'2026-01-26 11:58:58'),(12,'x',0,'2026-01-26 12:13:04'),(13,'xii',0,'2026-01-26 12:13:37');
/*!40000 ALTER TABLE `semester_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `batch` varchar(20) DEFAULT NULL,
  `programme` varchar(50) DEFAULT NULL,
  `branch` varchar(50) DEFAULT NULL,
  `semester` varchar(10) DEFAULT NULL,
  `regulation` varchar(20) DEFAULT NULL,
  `htno` varchar(20) DEFAULT NULL,
  `admno` varchar(30) DEFAULT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `sex` tinyint DEFAULT NULL COMMENT 'M=0, F=1',
  `dob` date DEFAULT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `student_mobile` varchar(15) DEFAULT NULL,
  `parent_mobile` varchar(15) DEFAULT NULL,
  `doj` date DEFAULT NULL,
  `section` varchar(10) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'On Roll',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `htno` (`htno`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (4,'2021','B.Tech','AIML','I','URR-18','12222','','KAVALLURI RAMU sathy sairam','NAGENDER RAO','VIJJAYA',22,0,'2002-01-20','787879998','8798009090','12321321321','2002-01-20','','On Roll','2026-01-27 02:41:45',NULL),(5,'2021','B.Tech','AIML','I','URR-18','14444','','SAIRAM HANUMAN SAIRAM','HANUMAN','SATHYA SAI',19,0,'2001-12-30','1235678','900000000','900000000','2001-12-30','','Left Out','2026-01-27 12:59:44',NULL),(6,'2021','B.Tech','AIML','I','URR-18','14445','','SAIRAM','HANUMAN','SATHYA SAI',19,0,'2001-12-31','1235678','900000000','900000000','2001-12-31','','On Roll','2026-01-27 13:51:45','uploads/students/14445.jpg'),(7,'2021','B.Tech','AIML','I','URR-18','14446','','SAIRAM','HANUMAN','SATHYA SAI',19,0,'2001-12-31','1235678','900000000','900000000','2001-12-31','','Detained','2026-01-27 13:51:45',NULL),(8,'2021','B.Tech','AIML','I','URR-18','14447','14447','SAIRAM sathya sai baba','HANUMAN','SATHYA SAI',19,0,'2001-12-31','1235678','900000000','900000000','2001-12-31','','On Roll','2026-01-27 13:51:45',NULL),(9,'2021','B.Tech','AIML','I','URR-18','14448',NULL,'SAIRAM','HANUMAN','SATHYA SAI',19,0,'2002-01-01','1235678','900000000','900000000','2002-01-01',NULL,'On Roll','2026-01-27 13:51:45',NULL),(10,'2021','B.Tech','AIML','I','URR-18','14449',NULL,'SAIRAM JAI SAIRAM','HANUMAN','SATHYA SAI',19,0,'2002-01-01','1235678','900000000','900000000','2002-01-01','','On Roll','2026-01-27 13:51:45',NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-29 16:01:35
