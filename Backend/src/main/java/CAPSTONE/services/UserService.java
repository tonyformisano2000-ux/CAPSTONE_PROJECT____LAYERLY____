package CAPSTONE.services;

import CAPSTONE.dto.UserResponseDTO;
import CAPSTONE.entities.User;
import CAPSTONE.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return toResponse(user);
    }

    private UserResponseDTO toResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setBackgroundPhotoUrl(user.getBackgroundPhotoUrl());
        dto.setLocation(user.getLocation());
        dto.setDesignerLevel(user.getDesignerLevel() != null ? user.getDesignerLevel().name() : null);
        return dto;
    }
}