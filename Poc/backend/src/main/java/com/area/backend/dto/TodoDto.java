package com.area.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoDto {
    private Long id;
    private String title;
    private Boolean completed;
    private Long userId;
    private String dueDate;
    private String tags;
    private String createdAt;
    private String updatedAt;
}
