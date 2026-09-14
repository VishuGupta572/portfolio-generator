package com.portfolio.demo.Respository;

import com.portfolio.demo.Entites.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRespository extends JpaRepository<Skill,Long> {
}
