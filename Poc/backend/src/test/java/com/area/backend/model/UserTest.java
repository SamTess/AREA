package com.area.backend.model;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    void user_ShouldCreateWithBuilder() {
        // Given
        String username = "testuser";
        String email = "test@example.com";

        // When
        User user = User.builder()
                .username(username)
                .email(email)
                .build();

        // Then
        assertThat(user).isNotNull();
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getEmail()).isEqualTo(email);
    }

    @Test
    void user_ShouldAllowNullEmail() {
        // Given
        String username = "testuser";

        // When
        User user = User.builder()
                .username(username)
                .email(null)
                .build();

        // Then
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getEmail()).isNull();
    }

    @Test
    void user_ShouldSetAndGetFields() {
        // Given
        User user = new User();
        String username = "newuser";
        String email = "new@example.com";

        // When
        user.setUsername(username);
        user.setEmail(email);

        // Then
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getEmail()).isEqualTo(email);
    }

    @Test
    void user_ShouldHandleAllArgsConstructor() {
        // Given
        Long id = 1L;
        String username = "constructoruser";
        String email = "constructor@example.com";

        // When
        User user = new User(id, username, email);

        // Then
        assertThat(user.getId()).isEqualTo(id);
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getEmail()).isEqualTo(email);
    }

    @Test
    void user_ShouldCreateEmptyUser() {
        // When
        User user = new User();

        // Then
        assertThat(user.getId()).isNull();
        assertThat(user.getUsername()).isNull();
        assertThat(user.getEmail()).isNull();
    }
}