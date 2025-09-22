package com.area.backend.model;

import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class TodoTest {

    @Test
    void todo_ShouldCreateWithBuilder() {
        // Given
        String title = "Test Todo";
        Boolean completed = false;
        Integer order = 1;
        Long userId = 123L;
        OffsetDateTime now = OffsetDateTime.now();
        String tags = "work,urgent";

        // When
        Todo todo = Todo.builder()
                .title(title)
                .completed(completed)
                .order(order)
                .userId(userId)
                .createdAt(now)
                .tags(tags)
                .build();

        // Then
        assertThat(todo).isNotNull();
        assertThat(todo.getTitle()).isEqualTo(title);
        assertThat(todo.getCompleted()).isEqualTo(completed);
        assertThat(todo.getOrder()).isEqualTo(order);
        assertThat(todo.getUserId()).isEqualTo(userId);
        assertThat(todo.getCreatedAt()).isEqualTo(now);
        assertThat(todo.getTags()).isEqualTo(tags);
    }

    @Test
    void todo_ShouldAllowNullValues() {
        // When
        Todo todo = new Todo();

        // Then
        assertThat(todo.getId()).isNull();
        assertThat(todo.getTitle()).isNull();
        assertThat(todo.getCompleted()).isNull();
        assertThat(todo.getOrder()).isNull();
        assertThat(todo.getUserId()).isNull();
        assertThat(todo.getDueDate()).isNull();
        assertThat(todo.getTags()).isNull();
        assertThat(todo.getCreatedAt()).isNull();
        assertThat(todo.getUpdatedAt()).isNull();
        assertThat(todo.getDeletedAt()).isNull();
    }

    @Test
    void todo_ShouldSetAndGetFields() {
        // Given
        Todo todo = new Todo();
        String title = "Updated Todo";
        Boolean completed = true;
        OffsetDateTime dueDate = OffsetDateTime.now().plusDays(7);

        // When
        todo.setTitle(title);
        todo.setCompleted(completed);
        todo.setDueDate(dueDate);

        // Then
        assertThat(todo.getTitle()).isEqualTo(title);
        assertThat(todo.getCompleted()).isEqualTo(completed);
        assertThat(todo.getDueDate()).isEqualTo(dueDate);
    }

    @Test
    void todo_ShouldHandleAllArgsConstructor() {
        // Given
        Long id = 1L;
        String title = "Constructor Todo";
        Boolean completed = false;
        Integer order = 5;
        Long userId = 456L;
        OffsetDateTime now = OffsetDateTime.now();
        String tags = "personal";

        // When
        Todo todo = new Todo(id, title, completed, order, userId, null, tags, now, null, null);

        // Then
        assertThat(todo.getId()).isEqualTo(id);
        assertThat(todo.getTitle()).isEqualTo(title);
        assertThat(todo.getCompleted()).isEqualTo(completed);
        assertThat(todo.getOrder()).isEqualTo(order);
        assertThat(todo.getUserId()).isEqualTo(userId);
        assertThat(todo.getTags()).isEqualTo(tags);
        assertThat(todo.getCreatedAt()).isEqualTo(now);
    }
}