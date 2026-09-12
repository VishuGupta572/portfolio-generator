package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.ProfilerRequestDTO;
import com.portfolio.demo.DTO.ProfilerResponseDTO;
import com.portfolio.demo.Entites.Profile;
import com.portfolio.demo.Service.ProfileService;
import com.portfolio.demo.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class ProjectController {
    @Autowired
   private ProjectService projectService;
    @PostMapping("/addProjects")
    public ResponseEntity<String> addProject(@RequestBody ProfilerRequestDTO profilerRequestDTO){
       return  projectService.addProjects(profilerRequestDTO);
    }
    @GetMapping("/getallprojects")
    public List<Profile> getallprofiles(@RequestParam(required = false) ProfilerResponseDTO profilerResponseDTO){
        return projectService.getallprojects(profilerResponseDTO);
    }

    @DeleteMapping("/DeleteById/{id}")
    public ResponseEntity<String> DeleteById( @PathVariable Long id){
        return projectService.DeleteById(id);
    }
}
