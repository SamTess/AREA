package com.area.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.ArrayList;

@RestController
public class AboutController {

    @GetMapping(value = "/about.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> about() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

    Map<String, Object> todoService = new HashMap<>();
    todoService.put("name", "todos");
    todoService.put("actions", Arrays.asList("create", "update", "delete", "reorder", "clear-completed"));
    todoService.put("reactions", Arrays.asList("sendEmail"));

    Map<String, Object> client = new HashMap<>();
    client.put("host", "client_web");

    Map<String, Object> server = new HashMap<>();
    server.put("current_time", now.toString());

    List<Map<String, Object>> services = new ArrayList<>();
    services.add(todoService);

    Map<String, Object> body = new HashMap<>();
    body.put("client", client);
    body.put("server", server);
    body.put("services", services);

        return ResponseEntity.ok(body);
    }
}
