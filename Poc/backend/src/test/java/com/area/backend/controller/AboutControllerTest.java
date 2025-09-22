package com.area.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AboutController.class)
class AboutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void about_ShouldReturnValidJson() throws Exception {
        mockMvc.perform(get("/about.json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.client").exists())
                .andExpect(jsonPath("$.server").exists())
                .andExpect(jsonPath("$.services").exists())
                .andExpect(jsonPath("$.client.host").value("client_web"))
                .andExpect(jsonPath("$.server.current_time").exists())
                .andExpect(jsonPath("$.services[0].name").value("todos"))
                .andExpect(jsonPath("$.services[0].actions").isArray())
                .andExpect(jsonPath("$.services[0].reactions").isArray());
    }

    @Test
    void about_ShouldContainExpectedActions() throws Exception {
        mockMvc.perform(get("/about.json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.services[0].actions[0]").value("create"))
                .andExpect(jsonPath("$.services[0].actions[1]").value("update"))
                .andExpect(jsonPath("$.services[0].actions[2]").value("delete"))
                .andExpect(jsonPath("$.services[0].actions[3]").value("reorder"))
                .andExpect(jsonPath("$.services[0].actions[4]").value("clear-completed"));
    }

    @Test
    void about_ShouldContainExpectedReactions() throws Exception {
        mockMvc.perform(get("/about.json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.services[0].reactions[0]").value("sendEmail"));
    }
}