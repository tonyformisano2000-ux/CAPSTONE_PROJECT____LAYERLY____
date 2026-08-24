package CAPSTONE.controllers;

import CAPSTONE.dto.DesignResponseDTO;
import CAPSTONE.services.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}