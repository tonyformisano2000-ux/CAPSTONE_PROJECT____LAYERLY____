package CAPSTONE.controllers;

import CAPSTONE.dto.DesignResponseDTO;
import CAPSTONE.services.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/designs")
public class DesignController {

    @Autowired
    private DesignService designService;

    @GetMapping
    public List<DesignResponseDTO> getAllDesigns(@RequestParam(required = false) String technology) {
        if (technology != null) {
            return designService.getDesignsByTechnology(technology);
        }
        return designService.getAllDesigns();
    }

    @GetMapping("/{id}")
    public DesignResponseDTO getDesignById(@PathVariable Long id) {
        return designService.getDesignById(id);
    }
    @PostMapping(consumes = "multipart/form-data")
    public DesignResponseDTO createDesign(
            @RequestParam String title,
            @RequestParam(required = false) String subtitle,
            @RequestParam String technology,
            @RequestParam(required = false) String description,
            @RequestParam Double price,
            @RequestParam("photos") List<MultipartFile> photos
    ) {
        return designService.createDesign(title, subtitle, technology, description, price, photos);
    }
}