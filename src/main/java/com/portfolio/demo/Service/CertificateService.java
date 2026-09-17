package com.portfolio.demo.Service;

import com.portfolio.demo.DTO.CertificateRequestDTO;
import com.portfolio.demo.DTO.CertificateResponseDTO;
import com.portfolio.demo.Entites.Certification;
import com.portfolio.demo.Respository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.cert.Certificate;
import java.util.List;

@Service
public class CertificateService {
    @Autowired
    private CertificateRepository repository;
    public Certification addCertificate(CertificateRequestDTO requestDTO) {
        Certification certificate = new Certification();
        certificate.setName(requestDTO.getName());
        certificate.setDescription(requestDTO.getDescription());
        certificate.setCredentialId(requestDTO.getCredentialId());
        certificate.setCredentialUrl(requestDTO.getCredentialUrl());
        certificate.setIssueDate(requestDTO.getIssueDate());
        certificate.setDoesNotExpire(requestDTO.getDoesNotExpire());
        certificate.setExpirationDate(requestDTO.getExpirationDate());
        certificate.setDoesNotExpire(requestDTO.getDoesNotExpire());
        certificate.setIssuingOrganization(requestDTO.getIssuingOrganization());
        return   repository.save(certificate);



    }

    public List<Certification> getallcertificate() {
        return repository.findAll();
    }
}
