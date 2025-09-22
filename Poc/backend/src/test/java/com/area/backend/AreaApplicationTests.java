package com.area.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false",
    "JWT_SECRET=test-secret-key-that-is-long-enough-for-testing-purposes-only"
})
class AreaApplicationTests {

    @Test
    void contextLoads() {
        // This test will pass if the application context loads successfully
        // The @TestPropertySource annotation provides minimal configuration needed
    }

    @Test
    void applicationStarts() {
        // Additional test to verify the application can start
        // This ensures all beans are properly configured
    }
}
