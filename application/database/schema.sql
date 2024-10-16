-- file: application/database/schema.sql

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'tutor', 'admin') DEFAULT 'student',
    is_tutor TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL
);

-- Junction Table for Tutors and Subjects
CREATE TABLE tutor_subjects (
    tutor_id INT NOT NULL,
    subject_id INT NOT NULL,
    PRIMARY KEY (tutor_id, subject_id),
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE tutor_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,  -- Each user can have only one tutor post
    description TEXT NOT NULL,
    bio TEXT NOT NULL,  -- Pulled from user's profile
    availability JSON NOT NULL,  -- Weekly availability schedule as JSON
    hourly_rate DECIMAL(10, 2) NOT NULL,
    experience VARCHAR(255) NOT NULL,  -- Years of experience or qualifications
    location ENUM('online', 'in-person', 'both') NOT NULL,
    contact_info VARCHAR(255) NOT NULL,  -- Preferred method of contact
    profile_photo VARCHAR(255) NULL,
    profile_video VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);