package CAPSTONE.services;

import CAPSTONE.dto.DesignResponseDTO;
import CAPSTONE.entities.Design;
import CAPSTONE.repositories.DesignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DesignService {

    @Autowired
    private DesignRepository designRepository;

    public List<DesignResponseDTO> getAllDesigns() {
        return designRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DesignResponseDTO getDesignById(Long id) {
        Design design = designRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found with id: " + id));
        return toResponse(design);
    }

    // Esempio del .filter().map() esplicito per la checklist curriculum
    public List<DesignResponseDTO> getDesignsByTechnology(String technology) {
        return designRepository.findAll()
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
}