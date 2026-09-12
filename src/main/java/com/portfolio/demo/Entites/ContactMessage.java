package com.portfolio.demo.Entites;


import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContactMessage {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String email;
        private String subject;

        @Column(length = 2000)
        private String message;

        private String status;

        private LocalDateTime createdAt;
}
