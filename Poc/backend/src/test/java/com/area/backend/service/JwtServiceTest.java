package com.area.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private static final String TEST_SECRET = "test-secret-key-that-is-long-enough-for-testing-purposes-only";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(TEST_SECRET);
    }

    @Test
    void createToken_ShouldGenerateValidToken() {
        // Given
        Long userId = 123L;
        String username = "testuser";
        long ttlMillis = 3600000; // 1 hour

        // When
        String token = jwtService.createToken(userId, username, ttlMillis);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts separated by dots
    }

    @Test
    void parseToken_ShouldParseValidToken() {
        // Given
        Long userId = 456L;
        String username = "testuser2";
        long ttlMillis = 3600000;
        String token = jwtService.createToken(userId, username, ttlMillis);

        // When
        Jws<Claims> parsedToken = jwtService.parseToken(token);

        // Then
        assertThat(parsedToken).isNotNull();
        Claims claims = parsedToken.getBody();
        assertThat(claims.getSubject()).isEqualTo(String.valueOf(userId));
        assertThat(claims.get("username", String.class)).isEqualTo(username);
        assertThat(claims.getIssuedAt()).isNotNull();
        assertThat(claims.getExpiration()).isNotNull();
    }

    @Test
    void createAndParseToken_ShouldMaintainDataIntegrity() {
        // Given
        Long userId = 789L;
        String username = "integrationuser";
        long ttlMillis = 7200000; // 2 hours

        // When
        String token = jwtService.createToken(userId, username, ttlMillis);
        Jws<Claims> parsedToken = jwtService.parseToken(token);

        // Then
        Claims claims = parsedToken.getBody();
        assertThat(claims.getSubject()).isEqualTo(String.valueOf(userId));
        assertThat(claims.get("username", String.class)).isEqualTo(username);

        // Check that expiration is approximately correct (within 1 second tolerance)
        long expectedExpiration = System.currentTimeMillis() + ttlMillis;
        long actualExpiration = claims.getExpiration().getTime();
        assertThat(Math.abs(actualExpiration - expectedExpiration)).isLessThan(1000);
    }

    @Test
    void parseToken_ShouldThrowExceptionForInvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";

        // When & Then
        assertThrows(Exception.class, () -> jwtService.parseToken(invalidToken));
    }

    @Test
    void createToken_ShouldHandleDifferentUserIds() {
        // Given
        String username = "testuser";
        long ttlMillis = 3600000;

        // When
        String token1 = jwtService.createToken(1L, username, ttlMillis);
        String token2 = jwtService.createToken(999999L, username, ttlMillis);

        // Then
        assertThat(token1).isNotEqualTo(token2);

        Jws<Claims> claims1 = jwtService.parseToken(token1);
        Jws<Claims> claims2 = jwtService.parseToken(token2);

        assertThat(claims1.getBody().getSubject()).isEqualTo("1");
        assertThat(claims2.getBody().getSubject()).isEqualTo("999999");
    }
}