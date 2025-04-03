# LAMP Stack Contact Manager  

## Overview  
The **LAMP Stack Contact Manager** is a multi-user web application designed to manage contacts with role-based access control. Built using the **LAMP stack** (Linux, Apache, MySQL, PHP), this project follows industry standards for security, scalability, and maintainability.  

## Features  
- **Role-Based Access Control (RBAC):** Secure user management with different permission levels.  
- **User Authentication:** Login/logout functionality with encrypted passwords.  
- **Contact Management:** Add, edit, delete, and search contacts efficiently.  
- **Responsive UI:** Built with HTML, CSS, and JavaScript for a seamless user experience.  
- **Database-Driven:** MySQL backend for structured data storage.  
- **Scalable Deployment:** Hosted on **DigitalOcean**, ensuring performance and uptime.  

## Technologies Used  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** PHP  
- **Database:** MySQL  
- **Server:** Apache (on Linux)  
- **Deployment:** DigitalOcean  

## Database Schema  
This project uses a **MySQL** database with structured tables to manage users, universities, events, and role-based permissions. Below is the schema to set up the necessary tables.  

### **Database Setup**  

```sql
CREATE DATABASE DB01;
```

```sql
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Login VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('Student', 'Admin', 'SuperAdmin') NOT NULL
);
```

```sql
CREATE TABLE University (
    UniversityID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);
```

```sql
CREATE TABLE SuperAdmin (
    SuperAdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    UniversityID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    UniversityID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE Student (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    UniversityID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE RSOs (
    RSOID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) UNIQUE NOT NULL,
    AdminID INT NOT NULL,
    UniversityID INT NOT NULL,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE Events (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Description TEXT,
    Time TIME NOT NULL,
    Date DATE NOT NULL,
    Location VARCHAR(255) NOT NULL,
    ContactPhone VARCHAR(20),
    EventType ENUM('Public', 'Private', 'RSO') NOT NULL,
    OrganizerID INT NOT NULL,
    Request BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (OrganizerID) REFERENCES User(UserID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE Public_Events (
    EventID INT PRIMARY KEY,
    SuperAdminID INT NOT NULL,
    UniversityID INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
    FOREIGN KEY (SuperAdminID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE Private_Events (
    EventID INT PRIMARY KEY,
    AdminID INT NOT NULL,
    UniversityID INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

```sql
CREATE TABLE RSO_Events (
    EventID INT PRIMARY KEY,
    AdminID INT NOT NULL,
    UniversityID INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UniversityID) REFERENCES University(UniversityID) ON DELETE CASCADE
);
```

### **Database User Configuration**  
Before running the application, ensure that you create a MySQL user with appropriate privileges:  

```sql
CREATE USER 'your_php_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON DB01.* TO 'your_php_user'@'localhost';
FLUSH PRIVILEGES;
```  

📌 *For security reasons, replace `'your_php_user'` and `'your_secure_password'` with your own credentials. Consider using environment variables instead of hardcoding them in your code.*  

## Installation  
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/ValexEvans/html.git
   cd html
   ```  
2. **Set up the database:**  
   - Open MySQL and create the database using:  
     ```sql
     CREATE DATABASE DB01;
     ```  
   - Import the SQL schema using MySQL CLI or phpMyAdmin.  
     ```bash
     mysql -u your_php_user -p DB01 < database_schema.sql
     ```  
3. **Configure Apache and PHP:**  
   - Ensure that **Apache**, **PHP**, and **MySQL** are installed and running.  
   - Update `php.ini` settings if necessary (e.g., enable `mysqli`).  
4. **Deploy on a LAMP server:**  
   - Upload files to the server directory (e.g., `/var/www/html/`).  
   - Configure Apache virtual host settings.  
   - Restart Apache:  
     ```bash
     sudo systemctl restart apache2
     ```  

## Demo  
Provide a link to a live demo or screenshots if available.  
