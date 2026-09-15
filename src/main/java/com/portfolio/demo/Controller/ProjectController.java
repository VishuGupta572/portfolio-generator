package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.ProfilerRequestDTO;
import com.portfolio.demo.DTO.ProfilerResponseDTO;
import com.portfolio.demo.DTO.ProjectRequestDTO;
import com.portfolio.demo.DTO.ProjectResponseDTO;
import com.portfolio.demo.Entites.Profile;
import com.portfolio.demo.Entites.Project;
import com.portfolio.demo.Respository.ProjectRepository;
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
    @GetMapping("/getprojectBytitle")
    public Project getprojectBytitle(@RequestParam(name = "title") String title){
        return projectService.getprojectBytitle(title);
    }

    @DeleteMapping("/DeleteById/{id}")
    public ResponseEntity<String> DeleteById(@PathVariable Long id){
        return projectService.DeleteById(id);
    }
    @PutMapping("/UpadateProjects/{title}")
public ProjectResponseDTO  UpadateProjects(@PathVariable String title, @RequestBody ProjectRequestDTO dto ){
        return projectService.UpadateProjects(title,dto);
    }
}
