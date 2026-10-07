package CAPSTONE.services;

import CAPSTONE.dto.UserResponseDTO;
import CAPSTONE.entities.User;
import CAPSTONE.exceptions.ResourceNotFoundException;
import CAPSTONE.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // ordinati dal piu' recente, come i design: la homepage mostra i primi risultati
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    // La foto si aggiorna sempre sull'utente autenticato: nessun id dal client,
    // cosi' non e' possibile cambiare l'immagine di un altro account.
    public UserResponseDTO updateProfilePhoto(MultipartFile photo) {
        User user = getCurrentAuthenticatedUser();
        user.setProfilePhotoUrl(cloudinaryService.uploadImage(photo));
        return toResponse(userRepository.save(user));
    }

    private User getCurrentAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
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