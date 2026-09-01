package CAPSTONE.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "designs")
public class Design {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(nullable = false)
    private LocalDateTime publishedAt;

    @ManyToOne
    @JoinColumn(name = "designer_id", nullable = false)
    private User designer;

    @Column(nullable = false)
    private String technology;

    @Column(nullable = false)
    private String stlFileUrl;

    @Column(columnDefinition = "TEXT")
    private String description;


    // crea una lista di elementi per farne una tabella nuova, con design_ID e url. NON HA ID PROPRIO
    @ElementCollection
    @CollectionTable(name = "design_photos", joinColumns = @JoinColumn(name = "design_id"))
    @Column(name = "photo_url")
    private List<String> photoUrls;

    @ElementCollection
    @CollectionTable(name = "design_videos", joinColumns = @JoinColumn(name = "design_id"))
    @Column(name = "video_url")
    private List<String> videoUrls;

    @ElementCollection
    @CollectionTable(name = "design_tags", joinColumns = @JoinColumn(name = "design_id"))
    @Column(name = "tag")
    private List<String> tags;

    // collection table crea una tavola NON ENTITY, joinColumn crea un rapporto OneToMany per collegare più URLs
    // ad un singolo design e l'annotazione Column indica che ogni elemento della list (finché diversi tra loro) sarà
    // disposto su una riga nuova della table.
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    @Column(nullable = false)
    private Double rating = 0.0; // calcolato dalla media dei Comment, mai settato a mano

    @Column(nullable = false)
    private Double price;

    public Design() {
    }

    // GETTERS & SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public User getDesigner() {
        return designer;
    }

    public void setDesigner(User designer) {
        this.designer = designer;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getStlFileUrl() {
        return stlFileUrl;
    }

    public void setStlFileUrl(String stlFileUrl) {
        this.stlFileUrl = stlFileUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getPhotoUrls() {
        return photoUrls;
    }

    public void setPhotoUrls(List<String> photoUrls) {
        this.photoUrls = photoUrls;
    }

    public List<String> getVideoUrls() {
        return videoUrls;
    }

    public void setVideoUrls(List<String> videoUrls) {
        this.videoUrls = videoUrls;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}