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
public class CertificateResponseDTO {
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
