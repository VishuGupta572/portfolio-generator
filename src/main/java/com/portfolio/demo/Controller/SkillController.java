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
    @GetMapping("GetSkills")
    public List<Skill>  GetSkills(@RequestParam SkillResponseDTO responseDTO){
        return skillService.GetSkills(responseDTO);
    }
    @DeleteMapping("DeleteSkill")
    public Skill  DeleteSkill(@RequestParam SkillRequestDTO skillRequestDTO){
        return skillService.DeleteSkill(skillRequestDTO);
    }
}
