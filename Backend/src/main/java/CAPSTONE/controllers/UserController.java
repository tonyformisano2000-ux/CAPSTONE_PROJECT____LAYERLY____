package CAPSTONE.controllers;

import CAPSTONE.dto.PublicUserDTO;
import CAPSTONE.dto.UserResponseDTO;
import CAPSTONE.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<PublicUserDTO> getAllDesigners() {
        return userService.getAllDesigners();
    }

    @GetMapping("/{id}")
    public PublicUserDTO getDesignerById(@PathVariable Long id) {
        return userService.getDesignerById(id);
    }

    @PostMapping(value = "/me/photo", consumes = "multipart/form-data")
    public UserResponseDTO updateProfilePhoto(@RequestParam("photo") MultipartFile photo) {
        return userService.updateProfilePhoto(photo);
    }
}