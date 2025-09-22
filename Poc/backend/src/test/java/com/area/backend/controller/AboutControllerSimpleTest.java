package com.area.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class AboutControllerSimpleTest {

    @Test
    void about_ShouldReturnResponseEntity() {
        // Given
        AboutController controller = new AboutController();

        // When
        ResponseEntity<Map<String, Object>> response = controller.about();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    void about_ShouldContainExpectedStructure() {
        // Given
        AboutController controller = new AboutController();

        // When
        ResponseEntity<Map<String, Object>> response = controller.about();
        Map<String, Object> body = response.getBody();

        // Then
        assertThat(body).containsKeys("client", "server", "services");
    }

    @Test
    void about_ShouldContainClientInfo() {
        // Given
        AboutController controller = new AboutController();

        // When
        ResponseEntity<Map<String, Object>> response = controller.about();
        Map<String, Object> body = response.getBody();

        // Then
        Map<String, Object> client = (Map<String, Object>) body.get("client");
        assertThat(client).containsEntry("host", "client_web");
    }

    @Test
    void about_ShouldContainServerInfo() {
        // Given
        AboutController controller = new AboutController();

        // When
        ResponseEntity<Map<String, Object>> response = controller.about();
        Map<String, Object> body = response.getBody();

        // Then
        Map<String, Object> server = (Map<String, Object>) body.get("server");
        assertThat(server).containsKey("current_time");
        assertThat(server.get("current_time")).isNotNull();
    }
}