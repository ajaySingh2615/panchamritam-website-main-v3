-- Check if status column is an ENUM
DELIMITER //

-- Check if the status column is already correctly defined
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'contact_messages' 
AND COLUMN_NAME = 'status';

-- Add status column if it doesn't exist (safe operation even if exists)
ALTER TABLE contact_messages 
MODIFY COLUMN status ENUM('unread', 'read', 'in_progress', 'replied', 'archived') NOT NULL DEFAULT 'unread';

-- Change any invalid status values to 'unread'
UPDATE contact_messages 
SET status = 'unread' 
WHERE status NOT IN ('unread', 'read', 'in_progress', 'replied', 'archived');

-- Add missing index for status column
ALTER TABLE contact_messages 
ADD INDEX idx_status (status);

//
DELIMITER ; 