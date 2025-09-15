package com.area.backend.repository;

import com.area.backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Optional<Todo> findByTitle(String title);

    List<Todo> findAllByOrderByOrderAsc();
}
