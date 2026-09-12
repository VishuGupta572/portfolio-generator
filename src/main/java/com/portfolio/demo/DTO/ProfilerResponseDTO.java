package com.portfolio.demo.DTO;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfilerResponseDTO {


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

}
