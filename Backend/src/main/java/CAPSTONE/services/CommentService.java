package CAPSTONE.services;

import CAPSTONE.dto.CommentResponseDTO;
import CAPSTONE.entities.Comment;
import CAPSTONE.entities.Design;
import CAPSTONE.entities.User;
import CAPSTONE.repositories.CommentRepository;
import CAPSTONE.repositories.DesignRepository;
import CAPSTONE.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private DesignRepository designRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommentResponseDTO> getCommentsByDesignId(Long designId) {
        return commentRepository.findByDesignId(designId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CommentResponseDTO createComment(Long designId, Long userId, Integer rating, String text) {
        Design design = designRepository.findById(designId)
                .orElseThrow(() -> new RuntimeException("Design not found with id: " + designId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Comment comment = new Comment();
        comment.setDesign(design);
        comment.setUser(user);
        comment.setRating(rating);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);
        recalculateDesignRating(design);

        return toResponse(saved);
    }

    private void recalculateDesignRating(Design design) {
        List<Comment> comments = commentRepository.findByDesignId(design.getId());
        double average = comments.stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);
        design.setRating(average);
        designRepository.save(design);
    }

    private CommentResponseDTO toResponse(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setDesignId(comment.getDesign().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserFullName(comment.getUser().getFirstName() + " " + comment.getUser().getLastName());
        dto.setRating(comment.getRating());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}