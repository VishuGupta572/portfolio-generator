package com.portfolio.demo.Respository;

import com.portfolio.demo.Entites.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certification,Long> {
}
