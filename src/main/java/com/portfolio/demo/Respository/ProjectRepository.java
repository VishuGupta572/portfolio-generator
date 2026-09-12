package com.portfolio.demo.Respository;


import com.portfolio.demo.Entites.Profile;
import com.portfolio.demo.Entites.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
}
