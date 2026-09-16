package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.CertificateRequestDTO;
import com.portfolio.demo.Entites.Certification;
import com.portfolio.demo.Service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.cert.Certificate;

@RestController
public class CertificateController {
    @Autowired
    private CertificateService service;
    @PostMapping("/addCertificate")
    public Certification addCertificate(@RequestBody CertificateRequestDTO requestDTO){
        return service.addCertificate(requestDTO);
        
    }
}
