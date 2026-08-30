package CAPSTONE.services;

import CAPSTONE.entities.Comment;
import CAPSTONE.entities.Design;
import CAPSTONE.repositories.CommentRepository;
import CAPSTONE.repositories.DesignRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private DesignRepository designRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void recalculateDesignRating_shouldComputeCorrectAverage() {
        Design design = new Design();
        design.setId(1L);

        Comment c1 = new Comment();
        c1.setRating(4);
        Comment c2 = new Comment();
        c2.setRating(2);

        when(commentRepository.findByDesignId(1L)).thenReturn(List.of(c1, c2));

        commentService.recalculateDesignRating(design);

        ArgumentCaptor<Design> captor = ArgumentCaptor.forClass(Design.class);
        verify(designRepository).save(captor.capture());

        assertEquals(3.0, captor.getValue().getRating());
    }
}