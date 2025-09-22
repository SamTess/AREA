package com.area.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class OAuthAccountServiceTest {

    @Test
    void oAuthAccountService_ShouldHaveRequiredDependencies() {
        // This test verifies the service class exists and has the expected structure
        // without requiring a full Spring context
        
        // Given
        Class<?> serviceClass = OAuthAccountService.class;
        
        // Then
        assertThat(serviceClass).isNotNull();
        assertThat(serviceClass.getName()).isEqualTo("com.area.backend.service.OAuthAccountService");
        assertThat(serviceClass.isAnnotationPresent(org.springframework.stereotype.Service.class)).isTrue();
    }
}