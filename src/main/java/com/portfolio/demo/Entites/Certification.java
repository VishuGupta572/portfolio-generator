package com.portfolio.demo.Entites;
import jakarta.persistence.*;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String issuingOrganization;
    private String credentialId;
    private String credentialUrl;

    private LocalDate issueDate;
    private LocalDate expirationDate;

    private Boolean doesNotExpire;

    @Column(length = 1000)
    private String description;
}
