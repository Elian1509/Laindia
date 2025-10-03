package com.beelzebud.invSales_System.service;

import java.util.List;

import com.beelzebud.invSales_System.dto.request.UserRequestDTO;
import com.beelzebud.invSales_System.dto.response.UserResponseDTO;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO request);

    List<UserResponseDTO> getAllUser(String param);

    UserResponseDTO getUserById(Long id);

    UserResponseDTO updateUser(Long id, UserRequestDTO request);

    void deleteUser(Long id);
}
