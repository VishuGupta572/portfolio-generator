package com.portfolio.demo.Service;

import com.portfolio.demo.DTO.SkillRequestDTO;
import com.portfolio.demo.DTO.SkillResponseDTO;
import com.portfolio.demo.Entites.Skill;
import com.portfolio.demo.Respository.SkillRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {
    @Autowired
    private SkillRespository skillRespository;


    public Skill addSkills(SkillRequestDTO skillRequestDTO) {
        Skill skill = new Skill();
        skill.setCategory(skillRequestDTO.getCategory());
        skill.setName(skillRequestDTO.getName());
        skill.setProficiency(skillRequestDTO.getProficiency());
        skill.setIconUrl(skillRequestDTO.getIconUrl());
        skill.setDisplayOrder(skillRequestDTO.getDisplayOrder());

        Skill Allskill = skillRespository.save(skill);
        SkillRequestDTO responseDTO = new SkillRequestDTO();
        responseDTO.setName(Allskill.getName());
        responseDTO.setProficiency(Allskill.getProficiency());
        responseDTO.setDisplayOrder(Allskill.getDisplayOrder());
        responseDTO.setIconUrl(Allskill.getIconUrl());
        responseDTO.setCategory(Allskill.getCategory());

        return Allskill;



    }

    public List<Skill> GetSkills() {
        return skillRespository.findAll();
    }

    @Transactional
    public void deleteSkillById(Long id) {
        skillRespository.deleteById(id);
    }
}
