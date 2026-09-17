package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.CertificateRequestDTO;
import com.portfolio.demo.DTO.CertificateResponseDTO;
import com.portfolio.demo.Entites.Certification;
import com.portfolio.demo.Service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.cert.Certificate;
import java.util.List;

@RestController
public class CertificateController {
    @Autowired
    private CertificateService service;
    @PostMapping("/addCertificate")
    public Certification addCertificate(@RequestBody CertificateRequestDTO requestDTO){
        return service.addCertificate(requestDTO);
        
    }
    @GetMapping("/getallcertificate")
    public List<Certification> getallcertificate(){
        return service.getallcertificate();
    }
}
