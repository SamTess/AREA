package com.area.backend.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class TodoEventListener {
    private static final Logger log = LoggerFactory.getLogger(TodoEventListener.class);

    @EventListener
    public void onTodoCompleted(TodoCompletedEvent event) {
        // Simulate sending email - log only to avoid needing mail config
        log.info("[Hook:onTodoCompleted] Todo completed: id={} title={} - simulating sendEmail",
                event.getTodo().getId(), event.getTodo().getTitle());
    }
}
