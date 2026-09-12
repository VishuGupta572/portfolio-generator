package com.portfolio.demo.Entites;
import jakarta.persistence.*;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "projects")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String shortDescription;

    @Column(length = 2000)
    private String description;

    private String thumbnailUrl;
    private String githubUrl;
    private String liveUrl;
    private String technologies;
    private Boolean featured;

    private LocalDate startDate;
    private LocalDate endDate;

}
