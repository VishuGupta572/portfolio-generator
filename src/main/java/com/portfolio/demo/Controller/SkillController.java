package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.SkillRequestDTO;
import com.portfolio.demo.DTO.SkillResponseDTO;
import com.portfolio.demo.Entites.Skill;
import com.portfolio.demo.Service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SkillController {
    @Autowired
    private SkillService skillService;
    @PostMapping("addSkills")
    public Skill   addSkills(@RequestBody  SkillRequestDTO skillRequestDTO){
        return  skillService.addSkills(skillRequestDTO);
    }
    @GetMapping({"GetSkills", "getallskills"})
    public List<Skill> GetSkills(){
        return skillService.GetSkills();
    }

    @DeleteMapping("DeleteSkill/{id}")
    public void deleteSkill(@PathVariable Long id){
        skillService.deleteSkillById(id);
    }
}
