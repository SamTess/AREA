package com.area.backend.controller;

import com.area.backend.dto.UserDto;
import com.area.backend.model.User;
import com.area.backend.repository.UserRepository;
import com.area.backend.service.OAuthAccountService;
import com.area.backend.service.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final OAuthAccountService oauthAccountService;
    private final JwtService jwtService;

    @PostMapping("/{provider}/exchange")
    public ResponseEntity<String> exchangeToken(@PathVariable("provider") String provider,
                                                @RequestBody Map<String, String> body,
                                                HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        String code = body != null ? body.get("code") : null;
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing 'code' in request body");
        }

        if ("github".equalsIgnoreCase(provider)) {
            String clientId = "Ov23liCJZiEo1fBCXY0G"; // TODO : .env
            String clientSecret = "9f05a130186a0feb4b2a597b01feca4d93b51150"; // TODO : .env

            System.out.println("Client ID: " + clientId);
            if (clientId == null || clientSecret == null) {
                return ResponseEntity.status(500).body("GitHub client credentials not configured");
            }

        ObjectMapper mapper = new ObjectMapper();
        RestTemplate rest = new RestTemplate();

        // Exchange code for access token
        JsonNode tokenReq = mapper.createObjectNode()
            .put("client_id", clientId)
            .put("client_secret", clientSecret)
            .put("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> tokenEntity = new HttpEntity<>(mapper.writeValueAsString(tokenReq), headers);
        String tokenRespBody;
        try {
            tokenRespBody = rest.postForObject("https://github.com/login/oauth/access_token", tokenEntity, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(502).body("Failed to exchange code with provider");
        }

        JsonNode tokenJson = mapper.readTree(tokenRespBody);
            String accessToken = tokenJson.has("access_token") ? tokenJson.get("access_token").asText(null) : null;
            if (accessToken == null) {
                return ResponseEntity.status(502).body("No access token returned by provider");
            }

            // Fetch GitHub user info
            HttpHeaders uh = new HttpHeaders();
            uh.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));
            uh.setBearerAuth(accessToken);
            HttpEntity<Void> userEntity = new HttpEntity<>(uh);
            ResponseEntity<String> userResp;
            try {
                userResp = rest.exchange("https://api.github.com/user", HttpMethod.GET, userEntity, String.class);
            } catch (Exception e) {
                return ResponseEntity.status(502).body("Failed to fetch user info from provider");
            }

            JsonNode userJson = mapper.readTree(userResp.getBody());
            String providerUserId = userJson.has("id") ? userJson.get("id").asText() : null;
            String login = userJson.has("login") ? userJson.get("login").asText(null) : null;
            String email = userJson.has("email") && !userJson.get("email").isNull() ? userJson.get("email").asText(null) : null;

            if (email == null || email.isEmpty()) {
                try {
                    ResponseEntity<String> emailsResp = rest.exchange("https://api.github.com/user/emails", HttpMethod.GET, userEntity, String.class);
                    JsonNode emailsJson = mapper.readTree(emailsResp.getBody());
                    String candidate = null;
                    String verifiedCandidate = null;
                    if (emailsJson.isArray()) {
                        for (JsonNode e : emailsJson) {
                            String eEmail = e.has("email") && !e.get("email").isNull() ? e.get("email").asText(null) : null;
                            boolean primary = e.has("primary") && e.get("primary").asBoolean(false);
                            boolean verified = e.has("verified") && e.get("verified").asBoolean(false);
                            if (eEmail == null) continue;
                            if (primary && verified) {
                                candidate = eEmail;
                                break;
                            }
                            if (verified && verifiedCandidate == null) {
                                verifiedCandidate = eEmail;
                            }
                            if (candidate == null) candidate = eEmail;
                        }
                    }
                    if (candidate == null && verifiedCandidate != null) candidate = verifiedCandidate;
                    if (candidate != null) email = candidate;
                } catch (Exception ex) {
                }
            }

            if (providerUserId == null) {
                return ResponseEntity.status(502).body("Provider did not return user id");
            }

            // Find existing oauth account
            java.util.Optional<com.area.backend.dto.OAuthAccountDto> existing = oauthAccountService.findByProviderAndProviderUserId("github", providerUserId);
            Long userId;
            if (existing.isPresent()) {
                userId = existing.get().getUserId();
            } else {
                // Create new user
                String baseUsername = login != null ? login : ("github_" + providerUserId);
                String username = baseUsername;
                int attempt = 0;
                while (userRepository.findByUsername(username).isPresent()) {
                    attempt++;
                    username = baseUsername + "_" + attempt;
                }

                User newUser = User.builder()
                        .username(username)
                        .email(email)
                        .build();
                User saved = userRepository.save(newUser);
                userId = saved.getId();

                // Create oauth account entry
                oauthAccountService.createForUser(userId, "github", providerUserId, accessToken, null, null, null);
            }

            // Create signed JWT using JwtService
            long ttl = 7L * 24 * 3600 * 1000; // 7 days in ms
            String username = userRepository.findById(userId).map(u -> u.getUsername()).orElse("");
            String jwt = jwtService.createToken(userId, username, ttl);

            int maxAge = 7 * 24 * 3600;
            String cookie = "area_auth=" + jwt + "; HttpOnly; Path=/; Max-Age=" + maxAge + "; SameSite=Lax";
            response.addHeader("Set-Cookie", cookie);

            return ResponseEntity.ok("ok");
        } else {
            return ResponseEntity.badRequest().body("Unsupported provider: " + provider);
        }
    }

    @GetMapping("/me") // TODO: replace with real session getter
    public ResponseEntity<UserDto> me(HttpServletRequest request) {
        final String ANSI_BLUE = "\u001B[34m";
        final String ANSI_GREEN = "\u001B[32m";
        final String ANSI_RESET = "\u001B[0m";

        System.out.println(ANSI_BLUE + "Provided cookies (Cookie header): " + ANSI_GREEN + request.getHeader("Cookie") + ANSI_RESET);

        jakarta.servlet.http.Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            System.out.println(ANSI_BLUE + "Provided cookies (parsed):" + ANSI_RESET);
            for (jakarta.servlet.http.Cookie c : cookies) {
                System.out.println(ANSI_GREEN + " - " + c.getName() + "=" + c.getValue() + ANSI_RESET);
            }
        } else {
            System.out.println(ANSI_GREEN + "No cookies sent with request." + ANSI_RESET);
        }

        // Read `area_auth` cookie and validate JWT via JwtService
        jakarta.servlet.http.Cookie[] cookiesList = request.getCookies();
        if (cookiesList != null) {
            for (jakarta.servlet.http.Cookie c : cookiesList) {
                if ("area_auth".equals(c.getName())) {
                    String token = c.getValue();
                    try {
                        io.jsonwebtoken.Jws<io.jsonwebtoken.Claims> parsed = jwtService.parseToken(token);
                        String sub = parsed.getBody().getSubject();
                        Long userId = Long.parseLong(sub);
                        return userRepository.findById(userId)
                                .map(u -> UserDto.builder().id(u.getId()).username(u.getUsername()).email(u.getEmail()).build())
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.status(404).build());
                    } catch (Exception e) {
                        return ResponseEntity.status(401).build();
                    }
                }
            }
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear cookie
        String cookie = "area_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax";
        response.addHeader("Set-Cookie", cookie);
        return ResponseEntity.ok().build();
    }
}
