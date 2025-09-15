package com.area.backend.controller;

import com.area.backend.dto.TodoDto;
import com.area.backend.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoDto>> list() {
        return ResponseEntity.ok(todoService.findAll());
    }

    @PostMapping
    public ResponseEntity<TodoDto> create(@Validated @RequestBody TodoDto dto) {
        TodoDto created = todoService.create(dto);
        return ResponseEntity.created(URI.create("/api/todos/" + created.getId())).body(created);
    }

    // PATCH /api/todos/order
    @PatchMapping("/order")
    public ResponseEntity<Void> reorder(@RequestBody List<Long> ids) {
        todoService.reorder(ids);
        return ResponseEntity.ok().build();
    }

    // POST /api/todos/clear-completed
    @PostMapping("/clear-completed")
    public ResponseEntity<Void> clearCompleted() {
        todoService.clearCompleted();
        return ResponseEntity.noContent().build();
    }
}

@RestController
@RequestMapping("/api/todos/{id}")
@RequiredArgsConstructor
class TodoItemController {
    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<TodoDto> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(todoService.get(id));
    }

    @PatchMapping
    public ResponseEntity<TodoDto> patch(@PathVariable("id") Long id, @Validated @RequestBody TodoDto dto) {
        TodoDto patched = todoService.patch(id, dto);
        return ResponseEntity.ok(patched);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
