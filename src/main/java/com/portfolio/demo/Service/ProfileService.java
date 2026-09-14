
package com.portfolio.demo.Service;

import com.portfolio.demo.DTO.ProfilerRequestDTO;
import com.portfolio.demo.DTO.ProfilerResponseDTO;
import com.portfolio.demo.Entites.Profile;
import com.portfolio.demo.Respository.ProfileRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    public ResponseEntity<String> addProfile(ProfilerRequestDTO profilerRequestDTO) {
        if (profilerRequestDTO.getId() != null) {
            Optional<Profile> profiles = profileRepository.findById(profilerRequestDTO.getId());
            if (profiles.isPresent()) {
                return ResponseEntity.badRequest().body("Profile already exists");
            }
        }

        Profile profile = new Profile();
        if (profilerRequestDTO.getId() != null) {
            profile.setId(profilerRequestDTO.getId());
        }
        profile.setFullName(profilerRequestDTO.getFullName());
        profile.setHeadline(profilerRequestDTO.getHeadline());
        profile.setBio(profilerRequestDTO.getBio());
        profile.setEmail(profilerRequestDTO.getEmail());
        profile.setPhoneNumber(profilerRequestDTO.getPhoneNumber());
        profile.setLocation(profilerRequestDTO.getLocation());
        profile.setResumeUrl(profilerRequestDTO.getResumeUrl());
        profile.setGithubUrl(profilerRequestDTO.getGithubUrl());
        profile.setLinkedinUrl(profilerRequestDTO.getLinkedinUrl());

        profileRepository.save(profile);
        return ResponseEntity.ok("Profile added successfully");
    }

    public List<Profile> getallprofiles(ProfilerResponseDTO profilerResponseDTO) {
        return  profileRepository.findAll();
    }

    public Profile findByfullNameAndId(String fullName, Long id) {
        return profileRepository.findByfullNameAndId(fullName,id);
    }
    @Transactional
    public ResponseEntity<String> DeleteByfullNameAndId(String fullName, Long id) {
        if(profileRepository.existsByfullNameAndId(fullName,id)){
            profileRepository.deleteByFullNameAndId(fullName,id);
            return ResponseEntity.ok().body("Profile Deleted successfully");
        }
        return ResponseEntity.badRequest().body("Profile not found with id: " + id);
    }


    public ProfilerResponseDTO upadateprofile(Long id, ProfilerRequestDTO profilerRequestDTO) {
        Profile profile = profileRepository.findById(id).get();
        profile.setFullName(profilerRequestDTO.getFullName());
        profile.setHeadline(profilerRequestDTO.getHeadline());
        profile.setBio(profilerRequestDTO.getBio());
        profile.setEmail(profilerRequestDTO.getEmail());
        profile.setPhoneNumber(profilerRequestDTO.getPhoneNumber());
        profile.setLocation(profilerRequestDTO.getLocation());
        profile.setResumeUrl(profilerRequestDTO.getResumeUrl());
        profile.setGithubUrl(profilerRequestDTO.getGithubUrl());
        profile.setLinkedinUrl(profilerRequestDTO.getLinkedinUrl());
        Profile profiletoset = profileRepository.save(profile);
        ProfilerResponseDTO responseDTO = new ProfilerResponseDTO();
        responseDTO.setHeadline(profiletoset.getHeadline());
        responseDTO.setBio(profiletoset.getBio());
        responseDTO.setEmail(profiletoset.getEmail());
        responseDTO.setLocation(profiletoset.getLocation());
        responseDTO.setGithubUrl(profiletoset.getGithubUrl());
        responseDTO.setFullName(profiletoset.getFullName());
        responseDTO.setLinkedinUrl(profiletoset.getLinkedinUrl());
        responseDTO.setPhoneNumber(profiletoset.getPhoneNumber());
        responseDTO.setResumeUrl(profiletoset.getResumeUrl());
        return responseDTO;


    }
}
