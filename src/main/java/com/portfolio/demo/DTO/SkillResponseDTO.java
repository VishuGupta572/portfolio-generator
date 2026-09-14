package com.portfolio.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class SkillResponseDTO{
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class SkillRequestDTO {
        private String name;
        private String category;
        private String proficiency;
        private String iconUrl;
        private Integer displayOrder;
    }

}
