package com.area.backend.service;

import com.area.backend.dto.UserDto;
import com.area.backend.model.User;
import com.area.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    public List<UserDto> findAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto create(UserDto dto) {
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .build();
        User saved = repository.save(user);
        return toDto(saved);
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
