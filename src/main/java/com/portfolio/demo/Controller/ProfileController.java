package com.portfolio.demo.Controller;

import com.portfolio.demo.DTO.ProfilerRequestDTO;
import com.portfolio.demo.DTO.ProfilerResponseDTO;
import com.portfolio.demo.Entites.Profile;
import com.portfolio.demo.Service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class ProfileController {
    @Autowired
    private ProfileService profileService;
    @PostMapping("/addProfile")
    public ResponseEntity<String> addProfile(@RequestBody ProfilerRequestDTO profilerRequestDTO){
        return  profileService.addProfile(profilerRequestDTO);
    }
    @GetMapping ("/getallprofiles")
    public List<Profile> getallprofiles(@RequestParam(required = false) ProfilerResponseDTO profilerResponseDTO){
        return profileService.getallprofiles(profilerResponseDTO);
    }
    @GetMapping("/findByfullNameAndId")
    public Profile findByfullNameAndId(@RequestParam String fullName , Long id){
        return profileService.findByfullNameAndId(fullName,id);
    }
    @DeleteMapping("/DeleteByfullNameAndId/{fullName}/{id}")
    public ResponseEntity<String> DeleteByfullNameAndId( @PathVariable Long id,@PathVariable String fullName){
        return profileService.DeleteByfullNameAndId(fullName,id);
    }


}

