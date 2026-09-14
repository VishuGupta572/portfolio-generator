package com.portfolio.demo.Entites;



import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Skill")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Skill {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String category;
        private String proficiency;
        private String iconUrl;
        private Integer displayOrder;

        // Getters and Setters
    }
