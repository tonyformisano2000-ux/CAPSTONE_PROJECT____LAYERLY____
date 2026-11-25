package CAPSTONE.services;

import CAPSTONE.dto.PublicUserDTO;
import CAPSTONE.dto.UserResponseDTO;
import CAPSTONE.entities.User;
import CAPSTONE.enums.UserRole;
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

    // ordinati dal piu' recente, come i design: la homepage mostra i primi risultati.
    // Endpoint pubblico: solo designer (i clienti non hanno una pagina) e senza email
    public List<PublicUserDTO> getAllDesigners() {
        return userRepository.findAllByRoleOrderByCreatedAtDesc(UserRole.DESIGNER)
                .stream()
                .map(this::toPublicResponse)
                .toList();
    }

    // l'id di un cliente risponde 404 come un id inesistente
    public PublicUserDTO getDesignerById(Long id) {
        User user = userRepository.findByIdAndRole(id, UserRole.DESIGNER)
                .orElseThrow(() -> new ResourceNotFoundException("Designer not found with id: " + id));
        return toPublicResponse(user);
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

    private PublicUserDTO toPublicResponse(User user) {
        PublicUserDTO dto = new PublicUserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setBackgroundPhotoUrl(user.getBackgroundPhotoUrl());
        dto.setLocation(user.getLocation());
        dto.setDesignerLevel(user.getDesignerLevel() != null ? user.getDesignerLevel().name() : null);
        return dto;
    }
}