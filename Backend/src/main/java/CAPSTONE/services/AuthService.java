package CAPSTONE.services;

import CAPSTONE.dto.AuthResponse;
import CAPSTONE.dto.LoginRequest;
import CAPSTONE.dto.RegisterRequest;
import CAPSTONE.dto.UserResponseDTO;
import CAPSTONE.entities.User;
import CAPSTONE.enums.UserRole;
import CAPSTONE.exceptions.InvalidRoleException;
import CAPSTONE.exceptions.DuplicateEmailException;
import CAPSTONE.exceptions.InvalidCredentialsException;
import CAPSTONE.repositories.UserRepository;
import CAPSTONE.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(resolveSelfAssignableRole(request.getRole()));
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getEmail());

        return new AuthResponse(token, toResponse(saved));
    }

    // In registrazione ci si puo' assegnare solo CUSTOMER o DESIGNER:
    // ADMIN (o un valore non valido) non deve essere ottenibile dal client.
    private UserRole resolveSelfAssignableRole(String requestedRole) {
        if (requestedRole == null) {
            return UserRole.CUSTOMER;
        }
        UserRole role;
        try {
            role = UserRole.valueOf(requestedRole.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidRoleException("Invalid role: " + requestedRole);
        }
        if (role != UserRole.CUSTOMER && role != UserRole.DESIGNER) {
            throw new InvalidRoleException("You cannot sign up with the role " + role);
        }
        return role;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, toResponse(user));
    }

    private UserResponseDTO toResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        // serve al frontend per mostrare subito l'avatar dopo login/registrazione
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        return dto;
    }
}