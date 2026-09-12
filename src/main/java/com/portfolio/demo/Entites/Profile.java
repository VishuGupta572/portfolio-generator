package com.portfolio.demo.Entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity(name = "profile")
    @Table(name = "profiles")
    @Getter
    @Setter
@AllArgsConstructor
@NoArgsConstructor
    public class Profile {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String fullName;
        private String headline;

        @Column(length = 1000)
        private String bio;


        private String email;
        private String phoneNumber;
        private String location;
        private String resumeUrl;
        private String githubUrl;
        private String linkedinUrl;

        // Getters and Setters
    }
