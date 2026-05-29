-- ============================================================
-- Smart Bus Ticketing and Transport Management System (SBTMS)
-- MySQL schema + sample data
-- ============================================================
DROP DATABASE IF EXISTS sbtms;
CREATE DATABASE sbtms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sbtms;

-- ---------- USERS (passengers) ----------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- ADMINS ----------
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- DRIVERS ----------
CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  license_no VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(20),
  experience_years INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- BUSES ----------
CREATE TABLE buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_number VARCHAR(50) NOT NULL UNIQUE,
  bus_name VARCHAR(100) NOT NULL,
  bus_type ENUM('AC','Non-AC','Sleeper','Seater') DEFAULT 'Seater',
  total_seats INT NOT NULL DEFAULT 40,
  driver_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- ROUTES ----------
CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  distance_km DECIMAL(8,2) DEFAULT 0,
  duration_hours DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- SCHEDULES ----------
CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_id INT NOT NULL,
  route_id INT NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NOT NULL,
  fare DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- BOOKINGS ----------
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  schedule_id INT NOT NULL,
  seat_number INT NOT NULL,
  status ENUM('booked','cancelled') DEFAULT 'booked',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_seat (schedule_id, seat_number, status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- PAYMENTS ----------
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('card','upi','cash','wallet') DEFAULT 'card',
  status ENUM('pending','paid','failed') DEFAULT 'paid',
  transaction_ref VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- TICKETS ----------
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE,
  ticket_code VARCHAR(50) NOT NULL UNIQUE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- SAMPLE DATA
-- bcrypt hash below corresponds to the plain password 'admin123' / 'password123'
-- admin123  -> $2b$10$5Q9Yk2YwGz3a8mJzQ8d8R.bN0J2k3sVtJ0pYn9k8wLqXKJ9oA4S2W (regenerated at first run if needed)
-- The seed uses a known hash for 'admin123' and 'password123'
-- ============================================================
INSERT INTO admins (name,email,password) VALUES
('Super Admin','admin@sbtms.com','$2b$10$wH8QweH8a4F2k5oXq8u3Yu0m8m6Yv5oRl7m9bN1k0aGqXq1L2P9oS');
-- NOTE: server auto-reseeds admin password if hash invalid (see backend/utils/seedAdmin.js)

INSERT INTO users (name,email,password,phone,address) VALUES
('John Doe','john@example.com','$2b$10$wH8QweH8a4F2k5oXq8u3Yu0m8m6Yv5oRl7m9bN1k0aGqXq1L2P9oS','9000000001','12 Main St'),
('Jane Smith','jane@example.com','$2b$10$wH8QweH8a4F2k5oXq8u3Yu0m8m6Yv5oRl7m9bN1k0aGqXq1L2P9oS','9000000002','45 Park Ave');

INSERT INTO drivers (name,license_no,phone,experience_years) VALUES
('Ramesh Kumar','DL-0420221234',  '9111111111', 8),
('Suresh Patel','DL-0420225678',  '9222222222', 12),
('Anil Verma',  'DL-0420229999',  '9333333333', 5);

INSERT INTO buses (bus_number,bus_name,bus_type,total_seats,driver_id) VALUES
('RAD-001A','Volcano Express','AC',40,1),
('RAE-202B','Ritco City','Non-AC',45,2),
('RAF-303C','Horizon Coach','Sleeper',30,3);

-- Rwanda routes (fares in RWF)
INSERT INTO routes (origin,destination,distance_km,duration_hours) VALUES
('Nyabugogo','Remera',8,0.5),
('Nyabugogo','Kimironko',10,0.6),
('Nyabugogo','Kacyiru',6,0.4),
('Nyabugogo','Kicukiro',9,0.5),
('Nyabugogo','Nyamirambo',5,0.3),
('Nyabugogo','Kanombe',12,0.7),
('Kigali','Musanze',106,2.0),
('Kigali','Rubavu',157,3.0),
('Kigali','Huye',135,2.5),
('Kigali','Rusizi',377,6.0),
('Kigali','Nyagatare',155,3.0),
('Kigali','Rwamagana',55,1.0),
('Kigali','Kayonza',75,1.5),
('Kigali','Muhanga',49,1.0),
('Kigali','Karongi',137,2.8);

INSERT INTO schedules (bus_id,route_id,departure_time,arrival_time,fare) VALUES
(2,1,'2026-06-01 07:00:00','2026-06-01 07:30:00',500.00),
(2,2,'2026-06-01 08:00:00','2026-06-01 08:40:00',500.00),
(2,5,'2026-06-01 09:00:00','2026-06-01 09:20:00',500.00),
(1,7,'2026-06-01 06:30:00','2026-06-01 08:30:00',3500.00),
(1,8,'2026-06-01 07:00:00','2026-06-01 10:00:00',5000.00),
(1,9,'2026-06-01 08:00:00','2026-06-01 10:30:00',3500.00),
(3,10,'2026-06-01 22:00:00','2026-06-02 04:00:00',8000.00),
(1,11,'2026-06-02 07:00:00','2026-06-02 10:00:00',5000.00);

INSERT INTO bookings (user_id,schedule_id,seat_number,status,total_amount) VALUES
(1,4,5,'booked',3500.00),
(2,5,12,'booked',5000.00);

INSERT INTO payments (booking_id,amount,method,status,transaction_ref) VALUES
(1,3500.00,'card','paid','TXN10001'),
(2,5000.00,'wallet','paid','TXN10002');

INSERT INTO tickets (booking_id,ticket_code) VALUES
(1,'TKT-0000001'),
(2,'TKT-0000002');
