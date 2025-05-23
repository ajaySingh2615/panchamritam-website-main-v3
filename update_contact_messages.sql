-- Run this SQL query in your MySQL database to add the status column to contact_messages table\n\n-- First check if the column exists\nSET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_messages' AND COLUMN_NAME = 'status');\n\n-- Add the column if it doesn't exist\nSET @query = IF(@exists = 0, 'ALTER TABLE contact_messages ADD COLUMN status ENUM(\
unread\, \read\, \in_progress\, \replied\, \archived\) DEFAULT \unread\', 'SELECT \Status
column
already
exists\');\n\nPREPARE stmt FROM @query;\nEXECUTE stmt;\nDEALLOCATE PREPARE stmt;
