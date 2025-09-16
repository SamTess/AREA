package com.area.backend.service;

import com.area.backend.dto.TodoDto;
import com.area.backend.model.Todo;
import com.area.backend.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import com.area.backend.event.TodoCompletedEvent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository repository;
    private final ApplicationEventPublisher publisher;

    public List<TodoDto> findAll() {
    return repository.findAllByOrderByOrderAsc().stream()
        .filter(t -> t.getDeletedAt() == null)
        .map(this::toDto)
        .collect(Collectors.toList());
    }

    public TodoDto create(TodoDto dto) {
    Todo todo = Todo.builder()
        .title(dto.getTitle())
        .completed(Boolean.TRUE.equals(dto.getCompleted()))
        .userId(dto.getUserId())
                .tags(dto.getTags())
                .dueDate(dto.getDueDate() == null ? null : OffsetDateTime.parse(dto.getDueDate()))
                .createdAt(OffsetDateTime.now())
                .build();
        Todo saved = repository.save(todo);
        return toDto(saved);
    }

    public TodoDto get(Long id) {
        Todo todo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        return toDto(todo);
    }

    public TodoDto patch(Long id, TodoDto dto) {
        Todo todo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        Boolean beforeCompleted = todo.getCompleted();
        if (dto.getTitle() != null) {
            todo.setTitle(dto.getTitle());
        }
        if (dto.getCompleted() != null) {
            todo.setCompleted(dto.getCompleted());
            if (Boolean.FALSE.equals(beforeCompleted) && Boolean.TRUE.equals(dto.getCompleted())) {
                publisher.publishEvent(new TodoCompletedEvent(this, todo));
            }
        }
        if (dto.getUserId() != null) {
            todo.setUserId(dto.getUserId());
        }
        if (dto.getTags() != null) {
            todo.setTags(dto.getTags());
        }
        if (dto.getDueDate() != null) {
            todo.setDueDate(OffsetDateTime.parse(dto.getDueDate()));
        }
        Todo updated = repository.save(todo);
        return toDto(updated);
    }

    public void delete(Long id) {
        Todo todo = repository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setDeletedAt(OffsetDateTime.now());
        repository.save(todo);
    }


    public void reorder(List<Long> ids) {
            List<Todo> todos = repository.findAllById(ids);
            for (int i = 0; i < ids.size(); i++) {
                Long id = ids.get(i);
                for (Todo todo : todos) {
                    if (todo.getId().equals(id)) {
                        todo.setOrder(i);
                    }
                }
            }
            repository.saveAll(todos);
    }

    public void clearCompleted() {
            List<Todo> completed = repository.findAll().stream()
                .filter(t -> Boolean.TRUE.equals(t.getCompleted()) && t.getDeletedAt() == null)
                .collect(Collectors.toList());
            for (Todo t : completed) {
                t.setDeletedAt(OffsetDateTime.now());
            }
            repository.saveAll(completed);
    }

    private TodoDto toDto(Todo todo) {
    DateTimeFormatter f = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    return TodoDto.builder()
        .id(todo.getId())
        .title(todo.getTitle())
        .completed(todo.getCompleted())
        .userId(todo.getUserId())
        .dueDate(todo.getDueDate() == null ? null : todo.getDueDate().format(f))
        .tags(todo.getTags())
        .createdAt(todo.getCreatedAt() == null ? null : todo.getCreatedAt().format(f))
        .updatedAt(todo.getUpdatedAt() == null ? null : todo.getUpdatedAt().format(f))
        .build();
    }
}
