package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.ProfilerRequestDTO;
import com.portfolio.demo.DTO.ProfilerResponseDTO;
import com.portfolio.demo.DTO.ProjectRequestDTO;
import com.portfolio.demo.Entites.Profile;
import com.portfolio.demo.Entites.Project;
import com.portfolio.demo.Service.ProfileService;
import com.portfolio.demo.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
public class ProjectController {
    @Autowired
   private ProjectService projectService;
    @PostMapping("/addProjects")
    public Project addProject(@RequestBody ProjectRequestDTO projectRequestDTO){
       return  projectService.addProjects(projectRequestDTO);
    }
    @GetMapping("/getallprojects")
    public List<Project> getallprofiles(@RequestParam(required = false) ProjectRequestDTO projectRequestDTO){
        return projectService.getallprojects(projectRequestDTO);
    }

    @DeleteMapping("/DeleteById/{id}")
    public ResponseEntity<String> DeleteById(@PathVariable Long id){
        return projectService.DeleteById(id);
    }
}
