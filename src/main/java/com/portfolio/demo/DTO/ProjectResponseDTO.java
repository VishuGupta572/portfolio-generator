package com.portfolio.demo.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponseDTO {
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


}
