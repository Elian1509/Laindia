package com.beelzebud.invSales_System.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.beelzebud.invSales_System.dto.request.UserRequestDTO;
import com.beelzebud.invSales_System.dto.response.UserResponseDTO;
import com.beelzebud.invSales_System.exception.ResourceNotFoundException;
import com.beelzebud.invSales_System.model.Role;
import com.beelzebud.invSales_System.model.User;
import com.beelzebud.invSales_System.repository.RoleRepository;
import com.beelzebud.invSales_System.repository.UserRepository;
import com.beelzebud.invSales_System.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        return UserResponseDTO.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .role(saved.getRole().getName())
                .build();
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

        // actualizar datos
        user.setUsername(request.getUsername());
        user.setRole(role);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(updated.getId())
                .username(updated.getUsername())
                .role(updated.getRole().getName())
                .build();
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        userRepository.delete(user);
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().getName())
                .build();
    }

    @Override
    public List<UserResponseDTO> getAllUser(String param) {
        List<User> users;
        if (param == null || param.isBlank()) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findAllByUsernameContainingIgnoreCase(param);
        }

        return users.stream()
                .map(user -> UserResponseDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole().getName())
                        .build())
                .toList();
    }

}
