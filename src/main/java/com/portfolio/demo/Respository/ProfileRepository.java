package com.portfolio.demo.Respository;

import com.portfolio.demo.Entites.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
    Profile findByfullNameAndId(String fullName, Long id);

    void deleteByFullNameAndId(String fullName, Long id);
}
