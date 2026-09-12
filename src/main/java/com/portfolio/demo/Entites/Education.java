package com.portfolio.demo.Entites;
import jakarta.persistence.*;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "education")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String institutionName;
    private String degree;
    private String fieldOfStudy;
    private String location;

    private LocalDate startDate;
    private LocalDate endDate;

    private String grade;

    @Column(length = 1500)
    private String description;

}
