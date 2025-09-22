package com.area.backend.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TodoDtoTest {

    @Test
    void todoDto_ShouldCreateWithBuilder() {
        // Given
        Long id = 1L;
        String title = "Test Todo";
        Boolean completed = false;
        Long userId = 123L;
        String tags = "work,urgent";

        // When
        TodoDto dto = TodoDto.builder()
                .id(id)
                .title(title)
                .completed(completed)
                .userId(userId)
                .tags(tags)
                .build();

        // Then
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(id);
        assertThat(dto.getTitle()).isEqualTo(title);
        assertThat(dto.getCompleted()).isEqualTo(completed);
        assertThat(dto.getUserId()).isEqualTo(userId);
        assertThat(dto.getTags()).isEqualTo(tags);
    }

    @Test
    void todoDto_ShouldSetAndGetFields() {
        // Given
        TodoDto dto = new TodoDto();
        String title = "Updated Todo";
        Boolean completed = true;

        // When
        dto.setTitle(title);
        dto.setCompleted(completed);

        // Then
        assertThat(dto.getTitle()).isEqualTo(title);
        assertThat(dto.getCompleted()).isEqualTo(completed);
    }

    @Test
    void todoDto_ShouldHandleNullValues() {
        // When
        TodoDto dto = new TodoDto();

        // Then
        assertThat(dto.getId()).isNull();
        assertThat(dto.getTitle()).isNull();
        assertThat(dto.getCompleted()).isNull();
        assertThat(dto.getUserId()).isNull();
        assertThat(dto.getDueDate()).isNull();
        assertThat(dto.getTags()).isNull();
        assertThat(dto.getCreatedAt()).isNull();
        assertThat(dto.getUpdatedAt()).isNull();
    }
}