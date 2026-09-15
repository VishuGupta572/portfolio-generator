package com.portfolio.demo.Service;

import com.portfolio.demo.DTO.ProjectRequestDTO;
import com.portfolio.demo.DTO.ProjectResponseDTO;
import com.portfolio.demo.Entites.Project;
import com.portfolio.demo.Respository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    public Project addProjects(ProjectRequestDTO projectRequestDTO) {

        Project project =  new Project();
        project.setDescription(projectRequestDTO.getDescription());
        project.setFeatured(projectRequestDTO.getFeatured());
        project.setLiveUrl(projectRequestDTO.getLiveUrl());
        project.setTitle(projectRequestDTO.getTitle());
        project.setGithubUrl(projectRequestDTO.getGithubUrl());
        project.setTechnologies(projectRequestDTO.getTechnologies());
        project.setShortDescription(projectRequestDTO.getShortDescription());
        project.setThumbnailUrl(projectRequestDTO.getThumbnailUrl());
        project.setStartDate(projectRequestDTO.getStartDate());
        project.setEndDate(projectRequestDTO.getEndDate());

        Project projects =  projectRepository.save(project);

        ProjectResponseDTO responseDTO = new ProjectResponseDTO();
        responseDTO.setDescription(projects.getDescription());
        responseDTO.setFeatured(projects.getFeatured());
        responseDTO.setTechnologies(projects.getTechnologies());
        responseDTO.setTitle(projects.getTitle());
        responseDTO.setLiveUrl(projects.getLiveUrl());
        responseDTO.setGithubUrl(projects.getGithubUrl());
        responseDTO.setThumbnailUrl(projects.getThumbnailUrl());
        responseDTO.setShortDescription(projects.getShortDescription());
        return  projects;



    }


    public List<Project> getallprojects(ProjectRequestDTO projectRequestDTO) {
        return projectRepository.findAll();
    }

    public ResponseEntity<String> DeleteById( Long id) {
        projectRepository.deleteById(id);

        return ResponseEntity.ok("Project deleted successfully with ID: " + id);
    }

    public ProjectResponseDTO UpadateProjects(String title, ProjectRequestDTO dto) {
        Project project = projectRepository.findByTitle(title);
        if (project == null) {
            return null;
        }
        project.setDescription(dto.getDescription());
        project.setFeatured(dto.getFeatured());
        project.setGithubUrl(dto.getGithubUrl());
        project.setLiveUrl(dto.getLiveUrl());
        project.setShortDescription(dto.getShortDescription());
        project.setEndDate(dto.getEndDate());
        project.setTitle(dto.getTitle());
        project.setThumbnailUrl(dto.getThumbnailUrl());
        project.setTechnologies(dto.getTechnologies());
        project.setStartDate(dto.getStartDate());
        Project saveprojects = projectRepository.save(project);
        ProjectResponseDTO projectResponseDTO = new ProjectResponseDTO();
        projectResponseDTO.setDescription(saveprojects.getDescription());
        projectResponseDTO.setTechnologies(saveprojects.getTechnologies());
        projectResponseDTO.setTitle(saveprojects.getTitle());
        projectResponseDTO.setFeatured(saveprojects.getFeatured());
        projectResponseDTO.setStartDate(saveprojects.getStartDate());
        projectResponseDTO.setThumbnailUrl(saveprojects.getThumbnailUrl());
        projectResponseDTO.setShortDescription(saveprojects.getShortDescription());
        projectResponseDTO.setLiveUrl(saveprojects.getLiveUrl());
        return projectResponseDTO;
    }


    public Project getprojectBytitle(String title) {
        return projectRepository.findByTitle(title);
    }
}
