ALTER TABLE contact_messages ADD COLUMN status ENUM('unread', 'read', 'in_progress', 'replied', 'archived') DEFAULT 'unread';
