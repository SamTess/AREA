package com.area.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = true)
    private Boolean completed;

    @Column(name = "todo_order")
    private Integer order;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "due_date")
    private OffsetDateTime dueDate;

    @Column(name = "tags")
    private String tags; // comma-separated tags for simplicity

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}
