package com.area.backend.controller;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.area.backend.dto.UserDto;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @PostMapping("/{provider}/exchange") // TODO: replace with real exchange
    public ResponseEntity<String> exchangeToken(@PathVariable("provider") String provider) {
        String dummyToken = "dummy-token-for-provider-" + provider;
        System.out.println("Exchanged code for provider: " + provider + ", returning token: " + dummyToken);
        return ResponseEntity.ok(dummyToken);
    }

    @GetMapping("/me") // TODO: replace with real session getter
    public ResponseEntity<UserDto> me(HttpServletRequest request) {
        final String ANSI_BLUE = "\u001B[34m";
        final String ANSI_GREEN = "\u001B[32m";
        final String ANSI_RESET = "\u001B[0m";

        System.out.println(ANSI_BLUE + "Provided cookies (Cookie header): " + ANSI_GREEN + request.getHeader("Cookie") + ANSI_RESET);

        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            System.out.println(ANSI_BLUE + "Provided cookies (parsed):" + ANSI_RESET);
            for (Cookie c : cookies) {
                System.out.println(ANSI_GREEN + " - " + c.getName() + "=" + c.getValue() + ANSI_RESET);
            }
        } else {
            System.out.println(ANSI_GREEN + "No cookies sent with request." + ANSI_RESET);
        }

        UserDto dummyUser = UserDto.builder()
                .id(1L)
                .username("dummyuser")
                .email("test@test.com")
                .build();
        return ResponseEntity.ok(dummyUser);
    }
}
