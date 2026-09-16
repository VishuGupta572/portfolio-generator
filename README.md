# 💼 Full-Stack Developer Portfolio & CMS Platform

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate_6.5-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Tomcat](https://img.shields.io/badge/Apache_Tomcat_10-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

> **Developer Portfolio & CMS Platform** is a full-stack web application for managing developer profiles, technical projects, and skills through a Spring Boot REST API and a responsive frontend.

---

## 📑 Table of Contents

- [Architecture & Design Principles](#-architecture--design-principles)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Database Schema](#-database-schema)
- [Getting Started & Installation](#-getting-started--installation)
- [Resume-Ready Bullet Points](#-resume-ready-bullet-points)

---

## 🏛️ Architecture & Design Principles

The application follows a layered architecture:

```text
[ Client Browser / UI ]
        │
        ▼
[ REST API / HTTP Requests ]
        │
        ▼
[ Controller Layer ]
        │
        ▼
[ DTO Layer ]
        │
        ▼
[ Service Layer ]
        │
        ▼
[ Repository Layer ]
        │
        ▼
[ MySQL Database ]