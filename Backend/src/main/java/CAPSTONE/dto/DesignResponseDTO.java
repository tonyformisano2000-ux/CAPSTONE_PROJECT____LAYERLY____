package CAPSTONE.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Setter
@Getter
@NoArgsConstructor
public class DesignResponseDTO {
    private Long id;
    private String title;
    private String subtitle;
    private LocalDateTime publishedAt;
    private Long designerId;
    private String designerName; // comodo per il frontend, evita un secondo fetch
    private String technology;
    private String stlFileUrl;
    private String description;
    private List<String> photoUrls;
    private List<String> videoUrls;
    private Double rating;
    private Double price;
    private List<String> tags;

    }