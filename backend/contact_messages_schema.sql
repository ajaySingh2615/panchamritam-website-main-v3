-- Contact Messages Table Schema
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `message_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255),
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'in_progress', 'replied', 'archived') NOT NULL DEFAULT 'unread',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `thread_id` VARCHAR(50) NULL,
  `is_reply` BOOLEAN DEFAULT FALSE,
  `parent_message_id` INT NULL,
  `message_reference` VARCHAR(100) NULL,
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_status` (`status`),
  INDEX `idx_thread_id` (`thread_id`),
  INDEX `idx_submitted_at` (`submitted_at`),
  INDEX `idx_parent_message_id` (`parent_message_id`),
  FOREIGN KEY (`parent_message_id`) REFERENCES `contact_messages` (`message_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Replies Table Schema (related table)
CREATE TABLE IF NOT EXISTS `email_replies` (
  `reply_id` INT AUTO_INCREMENT PRIMARY KEY,
  `original_message_id` INT,
  `reply_content` TEXT,
  `received_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reply_email` VARCHAR(100),
  `status` ENUM('new', 'processed', 'ignored') DEFAULT 'new',
  
  INDEX `idx_original_message` (`original_message_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`original_message_id`) REFERENCES `contact_messages` (`message_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data (optional - for testing)
INSERT INTO `contact_messages` (`name`, `email`, `subject`, `message`) VALUES
('John Doe', 'john@example.com', 'Product Inquiry', 'I would like to learn more about your products.'),
('Jane Smith', 'jane@example.com', 'Order Status', 'Can you please provide an update on my recent order?');

-- Update Statements for Existing Installations
-- In case you need to modify an existing table:

-- 1. Add thread_id column if missing
ALTER TABLE `contact_messages` 
ADD COLUMN `thread_id` VARCHAR(50) NULL,
ADD INDEX `idx_thread_id` (`thread_id`);

-- 2. Add is_reply column if missing
ALTER TABLE `contact_messages` 
ADD COLUMN `is_reply` BOOLEAN DEFAULT FALSE;

-- 3. Add parent_message_id column if missing
ALTER TABLE `contact_messages` 
ADD COLUMN `parent_message_id` INT NULL,
ADD INDEX `idx_parent_message_id` (`parent_message_id`),
ADD FOREIGN KEY (`parent_message_id`) REFERENCES `contact_messages` (`message_id`) ON DELETE SET NULL;

-- 4. Add message_reference column if missing
ALTER TABLE `contact_messages` 
ADD COLUMN `message_reference` VARCHAR(100) NULL;

-- 5. Ensure status is properly defined as ENUM
ALTER TABLE `contact_messages` 
MODIFY COLUMN `status` ENUM('unread', 'read', 'in_progress', 'replied', 'archived') NOT NULL DEFAULT 'unread'; 