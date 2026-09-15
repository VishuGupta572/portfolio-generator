# 💼 Full-Stack Developer Portfolio & CMS Platform

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate_6.5-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Tomcat](https://img.shields.io/badge/Apache_Tomcat_10-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

> **Developer Portfolio & CMS Platform** is an enterprise-grade full-stack web application designed to manage developer profiles, showcase technical projects, and catalog skills dynamically. Engineered with a **Spring Boot 3 RESTful backend**, **Spring Data JPA** with MySQL persistence, strict **DTO architectural patterns**, and an obsidian dark theme responsive frontend.

---

## 📑 Table of Contents
- [Architecture & Design Principles](#-architecture--design-principles)
- [Key Features](#-key-features)
- [Tech Stack](#-technology-stack)
- [REST API Endpoints](#-api-endpoints-reference)
- [Database Schema](#-database-schema)
- [Getting Started & Installation](#-getting-started--installation)
- [Resume-Ready Bullet Points](#-resume-ready-bullet-points)

---

## 🏛️ Architecture & Design Principles

The application adheres to clean enterprise architectural patterns:

```
[ Client Browser / UI ]
        │
        ▼ (HTTP REST Requests / JSON)
[ Controller Layer ]      <─── Maps endpoints, validates inputs, unmarshals JSON
        │
        ▼ (DTOs: ProfilerRequestDTO, ProjectRequestDTO)
[ Service Layer ]         <─── Business logic, entity-to-DTO mappings, @Transactional boundary
        │
        ▼ (Entities: Profile, Project, Skill)
[ Repository Layer ]      <─── Spring Data JPA, Hibernate ORM, Custom Query Derivation
        │
        ▼ (HikariCP Connection Pool)
[ MySQL Database ]        <─── Persistent relational storage
```

### Core Software Engineering Standards
- **DTO Pattern**: Separation between Database Entities and Data Transfer Objects (`ProfilerRequestDTO`, `ProfilerResponseDTO`, `ProjectRequestDTO`, `ProjectResponseDTO`, `SkillRequestDTO`) to prevent data leakage and decouple presentation from database schema.
- **Transactional Integrity**: Critical database mutations are wrapped with Spring's `@Transactional` to guarantee ACID properties and prevent dirty reads/writes.
- **RESTful Principles**: Uses standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) with structured status codes and JSON payloads.
- **Decoupled Client**: Pure asynchronous Vanilla JavaScript (`Fetch API`) consuming backend endpoints without server-side templating lock-in.

---

## ✨ Key Features

### 1. 👤 Profile Management & Dynamic Hero
- **Create Profile (`POST /addProfile`)**: Register complete profile information (Name, Headline, Bio, Email, Phone, Location, Resume Link, GitHub, LinkedIn).
- **Update Profile (`PUT /upadateprofile/{id}`)**: Modify any existing developer profile in real-time with automated form pre-fill and live UI re-rendering.
- **Directory Feed (`GET /getallprofiles`)**: Fetches all registered developers in responsive glassmorphic cards.
- **Exact Query Lookup (`GET /findByfullNameAndId`)**: Precise entity retrieval using custom multi-field repository queries.
- **Spotlight Selector**: "Display as Hero" action dynamically mounts any profile to the main landing hero section.
- **Atomic Deletion (`DELETE /DeleteByfullNameAndId/{fullName}/{id}`)**: Safe record cleanup by composite name + ID identifier.

### 2. 🚀 Project Showcase & Technical Highlights
- **Project Registration (`POST /addProjects`)**: Add projects with titles, summaries, architectural highlights, tech tags, live URLs, repository links, dates, and featured flags.
- **Live Project Grid (`GET /getallprojects`)**: Instant data-driven rendering of project cards.
- **Featured Badging**: Automatic glowing badges for spotlighted projects.
- **Project Deletion (`DELETE /DeleteById/{id}`)**: Clean removal via primary key.

### 3. ⚡ Skills Arsenal
- **Skill Registration (`POST /addSkills`)**: Add technical proficiencies with category tagging, display order, and proficiency levels.
- **Categorized Arsenal Grid**: Dynamically distributes skills into Languages, Backend Systems, Relational Databases, Developer Tools, and Core CS.

### 4. 🎨 Modern Obsidian Dark Theme UI
- Glassmorphic card styling with ambient radial gradients and subtle borders.
- Interactive code terminal showing live JSON payload specifications.
- Non-blocking toast notifications for CRUD feedback (Create, Update, Delete).
- Responsive mobile drawer menu and keyboard shortcuts (`Escape` to dismiss modals).

---

## 🛠️ Technology Stack

| Component | Technology | Version / Notes |
| :--- | :--- | :--- |
| **Backend Framework** | Spring Boot | 3.3.5 |
| **Language & SDK** | Java (OpenJDK) | 21 / 23 |
| **Persistence / ORM** | Spring Data JPA, Hibernate | 6.5.3 |
| **Connection Pooling** | HikariCP | Built-in high-performance pool |
| **Database** | MySQL | 8.x |
| **Embedded Server** | Apache Tomcat | 10.1 (Configured on Port `8056`) |
| **Frontend** | HTML5, CSS3, ES6+ JavaScript | Modern CSS Grid, Glassmorphism, Fetch API |
| **Icons & Fonts** | Font Awesome 6.5, JetBrains Mono, Inter | CDN-loaded |
| **Build & Dependency Tool** | Apache Maven | 3.9+ |

---

## 🔌 API Endpoints Reference

### Profile Controller
| Method | Endpoint | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/getallprofiles` | Retrieve all registered profiles | None | `List<Profile>` |
| `POST` | `/addProfile` | Register a new profile | `ProfilerRequestDTO` (JSON) | `Profile` |
| `PUT` | `/upadateprofile/{id}` | Update existing profile by ID | Path `{id}`, `ProfilerRequestDTO` | `ProfilerResponseDTO` |
| `GET` | `/findByfullNameAndId` | Search by Name & ID | Query: `fullName`, `id` | `Profile` |
| `DELETE` | `/DeleteByfullNameAndId/{fullName}/{id}` | Remove profile | Path: `{fullName}`, `{id}` | `String` status |

### Project Controller
| Method | Endpoint | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/getallprojects` | Retrieve all projects | None | `List<Projects>` |
| `POST` | `/addProjects` | Add technical project | `ProjectRequestDTO` (JSON) | `Projects` |
| `DELETE` | `/DeleteById/{id}` | Delete project by ID | Path: `{id}` | `String` status |

### Skill Controller
| Method | Endpoint | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/addSkills` | Register technical skill | `SkillRequestDTO` (JSON) | `Skill` |
| `GET` | `/GetSkills` | Retrieve skills list | None | `List<Skill>` |

---

## 🗄️ Database Schema

### `profiles` Table
- `id` (BIGINT, Primary Key, Auto Increment)
- `full_name` (VARCHAR)
- `headline` (VARCHAR)
- `bio` (VARCHAR(1000))
- `email`, `phone_number`, `location` (VARCHAR)
- `resume_url`, `github_url`, `linkedin_url` (VARCHAR)

### `projects` Table
- `id` (BIGINT, Primary Key, Auto Increment)
- `title`, `short_description` (VARCHAR)
- `full_description` (VARCHAR(2000))
- `technologies` (VARCHAR)
- `live_url`, `github_url`, `thumbnail_url` (VARCHAR)
- `start_date`, `end_date` (DATE)
- `featured` (BOOLEAN)

### `Skill` Table
- `id` (BIGINT, Primary Key, Auto Increment)
- `name`, `category`, `proficiency`, `icon_url` (VARCHAR)
- `display_order` (INT)

---

## 🚀 Getting Started & Installation

### Prerequisites
1. **JDK 21+** installed (`java -version`)
2. **Maven 3.8+** installed (`mvn -version`)
3. **MySQL Server 8.x** running locally on port `3306`

### 1. Database Configuration
Create the database in MySQL:
```sql
CREATE DATABASE profiles;
```

Verify your credentials in `src/main/resources/application.properties`:
```properties
server.port=8056
spring.datasource.url=jdbc:mysql://localhost:3306/profiles
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 2. Build and Run
```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-springboot.git
cd portfolio-springboot

# Compile and package
mvn clean package -DskipTests

# Run the application
java -jar target/demo-0.0.1-SNAPSHOT.jar
```
Or directly with Maven:
```bash
mvn spring-boot:run
```

### 3. Access the Application
Open your web browser and navigate to:
```
http://localhost:8056/
```

---

## 📄 Resume-Ready Bullet Points

When describing this project on your resume, use high-impact software engineering terminology:

> **Full-Stack Developer Portfolio CMS Platform | Java, Spring Boot, MySQL, REST APIs**
> - Architected a multi-tier enterprise web application using **Spring Boot 3**, **Spring Data JPA**, and **MySQL**, adhering to strict **DTO patterns** and **Separation of Concerns**.
> - Engineered full CRUD RESTful endpoints supporting transactional updates (`@Transactional`), complex JPA queries (`findByFullNameAndId`), and atomic cascade deletions.
> - Built an interactive, high-performance responsive client interface using **Vanilla ES6+ JavaScript** consuming backend REST endpoints via the Fetch API with real-time UI state synchronization.
> - Implemented connection pooling with **HikariCP** and Hibernate ORM for efficient SQL schema management and sub-millisecond query execution.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
