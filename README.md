# 💼 Full-Stack Developer Portfolio Platform

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Tomcat](https://img.shields.io/badge/Apache_Tomcat_10-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

> **Developer Portfolio Platform** is a full-stack web application designed for software engineers to manage their developer profiles, showcase featured technical projects, and demonstrate system capabilities. Powered by a Spring Boot 3 RESTful backend, Spring Data JPA with MySQL persistence, and a modern dark obsidian responsive frontend.

---

## ✨ Key Features & Functionalities

### 1. 👤 Profile Directory & Identity Management
- **Profile Registration (`POST /addProfile`)**: Create and update developer profiles with full names, professional headlines, technical bios, contact emails, phone numbers, locations, resumes, GitHub, and LinkedIn links.
- **Directory Feed (`GET /getallprofiles`)**: Fetches and renders all registered developer profiles across responsive cards.
- **Exact Search (`GET /findByfullNameAndId`)**: Look up any profile by combining exact full name and unique record ID.
- **Display as Hero**: Switch the hero banner on the fly to spotlight any selected profile.
- **Atomic Profile Deletion (`DELETE /DeleteByfullNameAndId/{fullName}/{id}`)**: Remove profile records safely under active transaction control.

### 2. 🚀 Project Portfolio Showcase
- **Project Publishing (`POST /addProjects`)**: Register technical projects with titles, summaries, architectural highlights, tech stack tags, live demo links, repository URLs, start/end dates, and featured flags.
- **Live Dynamic Grid (`GET /getallprojects`)**: Populates project showcase cards directly from the database without page reloads.
- **Featured Badging**: High-priority projects display a glowing star badge for recruiter focus.
- **Direct Removal (`DELETE /DeleteById/{id}`)**: Instantly delete deprecated project records via their unique identifier.

### 3. 🏛️ Layered REST Architecture & DTO Pattern
- **Decoupled Architecture**: Strict separation of concerns across Controllers, Service layers, Repositories, Entities, and DTOs.
- **Data Transfer Objects**: Uses `ProfilerRequestDTO`, `ProfilerResponseDTO`, `ProjectRequestDTO`, and `ProjectResponseDTO` to enforce payload safety and avoid leaking database entities.
- **Exception & Transaction Management**: Backed by Spring's `@Transactional` to guarantee atomic database operations and rollback on failures.

### 4. 🎨 Modern Dark Obsidian UI/UX
- **High-End Developer Aesthetic**: Custom dark glassmorphism theme, obsidian cards, ambient glow gradients, and subtle border highlights.
- **Interactive Code Terminal**: Embedded JSON specification widget visualizing developer attributes, stack items, and active port state.
- **Categorized Technical Arsenal**: Showcases skills across Languages, Backend Frameworks, Relational Databases, Developer Tools, and Core Competencies.
- **Responsive Layout**: Designed for seamless viewing across 4K displays, laptops, tablets, and mobile devices.
- **Non-Blocking Toasts**: Real-time toast notifications for all asynchronous create, read, and delete actions.

### 5. 📬 Direct Communication Dispatch
- **Verified Channels**: Direct links for email, phone, location, LinkedIn, and GitHub.
- **Quick Email Dispatcher**: Client-side message composer that pre-fills your default email client with structured subjects and bodies, paired with a one-click copy-to-clipboard button.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | Spring Boot 3.3.5, Spring MVC, Spring Data JPA |
| **Language & Runtime** | Java 21 / 23 (OpenJDK) |
| **Database & ORM** | MySQL 8.x, Hibernate ORM 6.5, HikariCP Connection Pool |
| **Transaction Management** | Spring Declarative Transactions (`@Transactional`) |
| **Server & Container** | Embedded Apache Tomcat 10.1 (Running on Port 8056) |
| **Frontend** | HTML5, Modern CSS3 (Variables, Flexbox, CSS Grid), Vanilla ES6+ JavaScript |
| **Typography & Icons** | Inter, JetBrains Mono, Font Awesome 6.5 |
| **Build Tool** | Apache Maven 3.x |

---

## 🔌 API Endpoints Reference

### Profiles Controller
- `GET /getallprofiles` — Fetch all profiles from the database.
- `POST /addProfile` — Create or update a profile record.
- `GET /findByfullNameAndId?fullName={name}&id={id}` — Find specific profile by name and ID.
- `DELETE /DeleteByfullNameAndId/{fullName}/{id}` — Remove profile by name and ID.

### Projects Controller
- `GET /getallprojects` — Fetch all projects.
- `POST /addProjects` — Add a new project with technologies, dates, and links.
- `DELETE /DeleteById/{id}` — Delete project by unique ID.

---

## 🚀 Setup & Execution

### Prerequisites
- Java Development Kit (JDK 21 or higher)
- Maven 3.8+
- MySQL Server (running with database `profiles`)

### Step-by-Step Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-springboot.git
   cd portfolio-springboot
