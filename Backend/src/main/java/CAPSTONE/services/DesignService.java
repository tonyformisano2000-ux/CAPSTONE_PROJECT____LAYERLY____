package CAPSTONE.services;

import CAPSTONE.dto.DesignResponseDTO;
import CAPSTONE.entities.Design;
import CAPSTONE.entities.User;
import CAPSTONE.exceptions.ConflictException;
import CAPSTONE.exceptions.ForbiddenOperationException;
import CAPSTONE.exceptions.ResourceNotFoundException;
import CAPSTONE.repositories.DesignRepository;
import CAPSTONE.repositories.OrderItemRepository;
import CAPSTONE.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DesignService {

    @Autowired
    private DesignRepository designRepository;

    public List<DesignResponseDTO> getAllDesigns() {
        return designRepository.findAllByOrderByPublishedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DesignResponseDTO getDesignById(Long id) {
        Design design = designRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found with id: " + id));
        return toResponse(design);
    }

    // Esempio del .filter().map() esplicito per la checklist curriculum
    public List<DesignResponseDTO> getDesignsByTechnology(String technology) {
        return designRepository.findAllByOrderByPublishedAtDesc()
                .stream()
                .filter(design -> design.getTechnology().equalsIgnoreCase(technology))
                .map(this::toResponse)
                .toList();
    }

    private DesignResponseDTO toResponse(Design design) {
        DesignResponseDTO dto = new DesignResponseDTO();
        dto.setId(design.getId());
        dto.setTitle(design.getTitle());
        dto.setSubtitle(design.getSubtitle());
        dto.setPublishedAt(design.getPublishedAt());
        dto.setDesignerId(design.getDesigner().getId());
        dto.setDesignerName(design.getDesigner().getFirstName() + " " + design.getDesigner().getLastName());
        dto.setTechnology(design.getTechnology());
        dto.setStlFileUrl(design.getStlFileUrl());
        dto.setDescription(design.getDescription());
        dto.setPhotoUrls(design.getPhotoUrls());
        dto.setVideoUrls(design.getVideoUrls());
        dto.setRating(design.getRating());
        dto.setPrice(design.getPrice());
        dto.setTags(design.getTags());
        return dto;
    }

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public DesignResponseDTO createDesign(String title, String subtitle, String technology,
                                          String description, Double price, List<MultipartFile> photos) {
        User currentUser = getCurrentAuthenticatedUser();

        List<String> uploadedUrls = photos.stream()
                .map(cloudinaryService::uploadImage)
                .toList();

        Design design = new Design();
        design.setTitle(title);
        design.setSubtitle(subtitle);
        design.setTechnology(technology);
        design.setDescription(description);
        design.setPrice(price);
        design.setPhotoUrls(uploadedUrls);
        design.setRating(0.0);
        design.setDesigner(currentUser);
        design.setPublishedAt(LocalDateTime.now());
        design.setStlFileUrl(""); // TODO: gestione upload STL separata se necessario

        Design saved = designRepository.save(design);
        return toResponse(saved);
    }

    public void deleteDesign(Long id) {
        Design design = designRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Design not found with id: " + id));

        User currentUser = getCurrentAuthenticatedUser();
        if (!design.getDesigner().getId().equals(currentUser.getId())) {
            throw new ForbiddenOperationException("You can only delete designs you published yourself");
        }

        // order_items non ha ON DELETE CASCADE: senza questo controllo la cancellazione
        // di un design gia' acquistato fallirebbe con una violazione di chiave esterna
        if (orderItemRepository.existsByDesignId(id)) {
            throw new ConflictException(
                    "This design cannot be deleted because it is part of orders already placed");
        }

        designRepository.delete(design);
    }

    private User getCurrentAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}