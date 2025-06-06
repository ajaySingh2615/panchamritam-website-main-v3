-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: panchamritam
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `address_line` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address_type` enum('Home','Office','Other') DEFAULT 'Home',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `idx_user_addresses` (`user_id`,`is_default`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (2,3,'123 Main Street','New York','NY','10001','USA','123-456-7890',NULL,'Home',0,'2025-04-30 07:25:00'),(3,3,'123 Main Street','Jhansi','NY','122101','India','8808319836',NULL,'Home',0,'2025-04-30 07:25:00'),(4,13,'324, zen den pg, 3rd block, gurgram, GURUGRAM','GURUGRAM','HARYANA','122101','India','08808319836','Ajay Singh','Home',1,'2025-04-30 07:38:55'),(5,13,'114, zen den pg, 5th block, noida, alpha-2','GURUGRAM','Uttar Pradesh','122101','India','8808319836','Ajay Singh','Office',0,'2025-04-30 07:40:02'),(6,12,'32A, noida, greater noida, noida','Gurgaon, India','uttar pradesh','284001','India','8808319836','Lalit Kumar','Home',1,'2025-05-07 11:51:38'),(7,11,'3, Greater Noida Knowledge Park, noida, Greater Noida','Greater Noida','Uttar Pradesh','201310','India','8808319836','Ajay Singh','Home',1,'2025-05-08 10:17:08'),(8,12,'552A, London, Greater Noida, Noida','Jhansi, India','Uttar Pradesh','284006','India','9155772615','Abhey Kumar','Office',0,'2025-05-12 10:56:20'),(9,12,'500A, 5th, badalpur, sector-20','Greater Noida, India','Harayana','284010','India','9155771526','Aadil Kumar','Other',0,'2025-05-12 11:35:35');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 16:24:10
