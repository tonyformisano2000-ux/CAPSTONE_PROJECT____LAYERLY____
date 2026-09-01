package CAPSTONE.config;

import CAPSTONE.entities.Comment;
import CAPSTONE.entities.Design;
import CAPSTONE.entities.User;
import CAPSTONE.enums.DesignerLevel;
import CAPSTONE.enums.UserRole;
import CAPSTONE.repositories.CommentRepository;
import CAPSTONE.repositories.DesignRepository;
import CAPSTONE.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DesignRepository designRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DesignRepository designRepository,
                      CommentRepository commentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.designRepository = designRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        String defaultPassword = passwordEncoder.encode("password123");

        // ---- DESIGNER ----
        User giulia = createDesigner("Giulia", "Romano", "giulia@layerly.com", defaultPassword,
                "Torino, IT", placeholderAvatar("Giulia"), DesignerLevel.PROFESSIONAL);
        User luca = createDesigner("Luca", "Ferri", "luca@layerly.com", defaultPassword,
                "Bologna, IT", placeholderAvatar("Luca"), DesignerLevel.AMATEUR);
        User sara = createDesigner("Sara", "Colombo", "sara@layerly.com", defaultPassword,
                "Firenze, IT", placeholderAvatar("Sara"), DesignerLevel.PROFESSIONAL);
        User davide = createDesigner("Davide", "Greco", "davide@layerly.com", defaultPassword,
                "Napoli, IT", placeholderAvatar("Davide"), DesignerLevel.AMATEUR);
        User elena = createDesigner("Elena", "Marino", "elena@layerly.com", defaultPassword,
                "Padova, IT", placeholderAvatar("Elena"), DesignerLevel.PROFESSIONAL);
        User matteo = createDesigner("Matteo", "Conti", "matteo@layerly.com", defaultPassword,
                "Verona, IT", placeholderAvatar("Matteo"), DesignerLevel.AMATEUR);
        User chiara = createDesigner("Chiara", "Ferrara", "chiara@layerly.com", defaultPassword,
                "Genova, IT", placeholderAvatar("Chiara"), DesignerLevel.PROFESSIONAL);
        User andrea = createDesigner("Andrea", "Ricci", "andrea@layerly.com", defaultPassword,
                "Bari, IT", placeholderAvatar("Andrea"), DesignerLevel.AMATEUR);

        // ---- CUSTOMER ----
        User marco = createCustomer("Marco", "Bianchi", "marco@layerly.com", defaultPassword);
        User francesca = createCustomer("Francesca", "Moretti", "francesca@layerly.com", defaultPassword);

        // ---- DESIGN ----
        Design d1 = createDesign("Vaso geometrico voronoi", "Design parametrico a bassa infill",
                giulia, "FDM", "Vaso decorativo stampabile senza supporti.",
                List.of(placeholderPhoto("vase"), placeholderPhoto("pottery")),
                6.99, List.of("casa", "decorativo"));

        Design d2 = createDesign("Miniatura drago articolato", null,
                giulia, "Resin", "Drago snodabile stampabile in un solo pezzo, articolazioni print-in-place.",
                List.of(placeholderPhoto("dragon"), placeholderPhoto("figurine")),
                12.50, List.of("miniatura", "fantasy"));

        Design d3 = createDesign("Portachiavi logo custom", null,
                luca, "FDM", "Portachiavi personalizzabile con logo a scelta.",
                List.of(placeholderPhoto("keychain")),
                2.50, List.of("gadget", "personalizzabile"));

        Design d4 = createDesign("Supporto cuffie da scrivania", "Design minimale con cable management",
                luca, "FDM", "Supporto stabile con foro passacavi integrato.",
                List.of(placeholderPhoto("headphones"), placeholderPhoto("desk")),
                4.00, List.of("scrivania", "organizzazione"));

        Design d5 = createDesign("Ingranaggio planetario dimostrativo", null,
                sara, "FDM", "Modello didattico di trasmissione planetaria, stampabile assemblato.",
                List.of(placeholderPhoto("gears")),
                9.99, List.of("meccanica", "didattico"));

        Design d6 = createDesign("Organizer da scrivania modulare", null,
                davide, "FDM", "Set di 3 moduli impilabili per penne, cavi e appunti.",
                List.of(placeholderPhoto("organizer")),
                5.50, List.of("scrivania", "modulare"));

        Design d7 = createDesign("Base per piante autoirrigante", "Sistema a stoppino integrato",
                elena, "FDM", "Sottovaso con riserva d'acqua e stoppino in cotone.",
                List.of(placeholderPhoto("plant"), placeholderPhoto("garden")),
                7.99, List.of("giardinaggio", "sostenibile"));

        Design d8 = createDesign("Lampada geometrica a nido d'ape", null,
                matteo, "Resin", "Paralume geometrico con pattern a nido d'ape, effetto luce diffusa.",
                List.of(placeholderPhoto("lamp")),
                15.00, List.of("illuminazione", "design"));

        Design d9 = createDesign("Scacchiera pieghevole magnetica", "Set completo con pezzi",
                chiara, "FDM", "Scacchiera pieghevole con chiusura magnetica, include tutti i pezzi.",
                List.of(placeholderPhoto("chess"), placeholderPhoto("boardgame")),
                18.50, List.of("gioco", "regalo"));

        Design d10 = createDesign("Fioriera a spirale da esterno", null,
                andrea, "FDM", "Fioriera decorativa a spirale, stampabile in un unico pezzo.",
                List.of(placeholderPhoto("flowerpot")),
                11.00, List.of("giardinaggio", "esterno"));

        // ---- COMMENT ----
        createComment(d1, marco, 5, "Stampato senza supporti come promesso, resa estetica ottima.");
        createComment(d1, francesca, 4, "Bel modello, ho dovuto rallentare la stampa per i dettagli fini.");
        createComment(d2, marco, 5, "Le articolazioni si muovono perfettamente appena tolto dal piatto.");
        createComment(d5, francesca, 5, "Perfetto per far vedere ai miei studenti come funziona un planetario.");
        createComment(d7, marco, 4, "Il sistema di irrigazione funziona meglio del previsto.");

        recalculateRating(d1);
        recalculateRating(d2);
        recalculateRating(d5);
        recalculateRating(d7);

        System.out.println(">>> Database seeded: 8 designers, 2 customers, 10 designs, 5 comments <<<");
    }

    private String placeholderAvatar(String name) {
        int seed = Math.abs(name.hashCode() % 70);
        return "https://i.pravatar.cc/150?img=" + seed;
    }

    private String placeholderPhoto(String keyword) {
        return "https://loremflickr.com/600/400/" + keyword;
    }

    private User createDesigner(String firstName, String lastName, String email, String passwordHash,
                                String location, String photoUrl, DesignerLevel level) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setRole(UserRole.DESIGNER);
        user.setLocation(location);
        user.setProfilePhotoUrl(photoUrl);
        user.setDesignerLevel(level);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private User createCustomer(String firstName, String lastName, String email, String passwordHash) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setRole(UserRole.CUSTOMER);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private Design createDesign(String title, String subtitle, User designer, String technology,
                                String description, List<String> photoUrls, double price, List<String> tags) {
        Design design = new Design();
        design.setTitle(title);
        design.setSubtitle(subtitle);
        design.setPublishedAt(LocalDateTime.now());
        design.setDesigner(designer);
        design.setTechnology(technology);
        design.setStlFileUrl("https://example.com/mock-files/" + title.toLowerCase().replace(" ", "-") + ".stl");
        design.setDescription(description);
        design.setPhotoUrls(photoUrls);
        design.setRating(0.0);
        design.setPrice(price);
        design.setTags(tags);
        return designRepository.save(design);
    }

    private void createComment(Design design, User user, int rating, String text) {
        Comment comment = new Comment();
        comment.setDesign(design);
        comment.setUser(user);
        comment.setRating(rating);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private void recalculateRating(Design design) {
        List<Comment> comments = commentRepository.findByDesignId(design.getId());
        double average = comments.stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);
        design.setRating(average);
        designRepository.save(design);
    }
}