package com.area.backend;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AreaApplicationMinimalTest {

    @Test
    void applicationMainClass_ShouldExist() {
        // Given & When
        Class<?> mainClass = AreaApplication.class;

        // Then
        assertThat(mainClass).isNotNull();
        assertThat(mainClass.getName()).isEqualTo("com.area.backend.AreaApplication");
    }

    @Test
    void applicationMainClass_ShouldHaveMainMethod() throws NoSuchMethodException {
        // Given
        Class<?> mainClass = AreaApplication.class;

        // When & Then
        assertThat(mainClass.getMethod("main", String[].class)).isNotNull();
    }
}