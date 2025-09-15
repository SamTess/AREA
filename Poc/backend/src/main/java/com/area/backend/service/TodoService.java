package com.area.backend.service;

import com.area.backend.dto.TodoDto;
import com.area.backend.model.Todo;
import com.area.backend.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository repository;

    public List<TodoDto> findAll() {
        return repository.findAllByOrderByOrderAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TodoDto create(TodoDto dto) {
        Todo todo = Todo.builder()
                .title(dto.getTitle())
                .completed(false)
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
        if (dto.getTitle() != null) {
            todo.setTitle(dto.getTitle());
        }
        if (dto.getCompleted() != null) {
            todo.setCompleted(dto.getCompleted());
        }
        Todo updated = repository.save(todo);
        return toDto(updated);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Todo not found");
        }
        repository.deleteById(id);
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
                .filter(t -> Boolean.TRUE.equals(t.getCompleted()))
                .collect(Collectors.toList());
            repository.deleteAll(completed);
    }

    private TodoDto toDto(Todo todo) {
        return TodoDto.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .completed(todo.getCompleted())
                .build();
    }
}
