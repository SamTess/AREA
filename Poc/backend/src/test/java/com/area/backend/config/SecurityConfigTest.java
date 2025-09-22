package com.area.backend.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityConfigTest {

    @Test
    void securityConfig_ShouldExist() {
        // Given & When
        Class<?> configClass = com.area.backend.config.SecurityConfig.class;

        // Then
        assertThat(configClass).isNotNull();
        assertThat(configClass.getName()).isEqualTo("com.area.backend.config.SecurityConfig");
    }

    @Test
    void securityConfig_ShouldBeAnnotatedAsConfiguration() {
        // Given
        Class<?> configClass = com.area.backend.config.SecurityConfig.class;

        // Then
        assertThat(configClass.isAnnotationPresent(org.springframework.context.annotation.Configuration.class)).isTrue();
    }
}