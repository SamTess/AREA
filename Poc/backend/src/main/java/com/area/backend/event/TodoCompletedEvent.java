package com.area.backend.event;

import com.area.backend.model.Todo;
import org.springframework.context.ApplicationEvent;

public class TodoCompletedEvent extends ApplicationEvent {
    private final Todo todo;

    public TodoCompletedEvent(Object source, Todo todo) {
        super(source);
        this.todo = todo;
    }

    public Todo getTodo() {
        return todo;
    }
}
