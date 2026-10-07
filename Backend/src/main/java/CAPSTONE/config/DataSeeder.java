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
                List.of(COMMONS + "/thumb/f/f6/3D_PRINTED_VASE.jpg/960px-3D_PRINTED_VASE.jpg",
                        COMMONS + "/thumb/0/04/3D_Printed_Vase.jpg/960px-3D_Printed_Vase.jpg",
                        "https://katrinamonarco1983.wordpress.com/wp-content/uploads/2014/12/3d-printed-pot.jpg"),
                6.99, List.of("casa", "decorativo"));

        Design d2 = createDesign("Miniatura drago articolato", null,
                giulia, "Resin", "Drago snodabile stampabile in un solo pezzo, articolazioni print-in-place.",
                List.of(COMMONS + "/thumb/d/d0/Technology_3D_print_dragon.jpg/960px-Technology_3D_print_dragon.jpg",
                        COMMONS + "/thumb/8/80/CSIRO_ScienceImage_1861_3D_Printed_Toothless_Dragon.jpg"
                                + "/960px-CSIRO_ScienceImage_1861_3D_Printed_Toothless_Dragon.jpg",
                        "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:191,cw:1145,ch:859,q:80,w:1145"
                                + "/6tAViADEWqP9m3nkqsjKgF.jpg"),
                12.50, List.of("miniatura", "fantasy"));

        Design d3 = createDesign("Portachiavi logo custom", null,
                luca, "FDM", "Portachiavi personalizzabile con logo a scelta.",
                List.of(COMMONS + "/4/45/Marvin_Keychain.jpeg"),
                2.50, List.of("gadget", "personalizzabile"));

        Design d4 = createDesign("Supporto cuffie a testa geometrica", "Reticolo triangolare stampato in un pezzo",
                luca, "FDM", "Supporto per cuffie a forma di testa, struttura a reticolo leggera e stabile.",
                List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTATBWNNOkjkJjgpjzTGi-B"
                        + "-gQvsnWfRmiB53p10lVAXuNPBNtJp_pNhu4&s=10"),
                4.00, List.of("scrivania", "organizzazione"));

        Design d5 = createDesign("Ingranaggio planetario dimostrativo", null,
                sara, "FDM", "Modello didattico di trasmissione planetaria, stampabile assemblato.",
                List.of(COMMONS + "/thumb/d/d0/Triple_Gear.jpg/960px-Triple_Gear.jpg"),
                9.99, List.of("meccanica", "didattico"));

        Design d6 = createDesign("Organizer da scrivania modulare", null,
                davide, "FDM", "Set di 3 moduli impilabili per penne, cavi e appunti.",
                List.of(COMMONS + "/thumb/c/c6/Hyperboloid_Pen_Holder_%285874134092%29.jpg"
                        + "/960px-Hyperboloid_Pen_Holder_%285874134092%29.jpg"),
                5.50, List.of("scrivania", "modulare"));

        Design d7 = createDesign("Base per piante autoirrigante", "Sistema a stoppino integrato",
                elena, "FDM", "Sottovaso con riserva d'acqua e stoppino in cotone.",
                List.of(COMMONS + "/thumb/4/49/3D_printed_flower_pots.jpg/960px-3D_printed_flower_pots.jpg",
                        COMMONS + "/thumb/2/2c/Orange_3D-printed_vase_with_wilted_flower.jpg"
                                + "/960px-Orange_3D-printed_vase_with_wilted_flower.jpg"),
                7.99, List.of("giardinaggio", "sostenibile"));

        Design d8 = createDesign("Lampada geometrica a nido d'ape", null,
                matteo, "Resin", "Paralume dodecaedrico con pattern a nido d'ape, effetto luce diffusa.",
                List.of("https://images.techadvisor.com/cmsdata/features/3433170/3D-print-by-Makerbot-1_thumb.jpg"),
                15.00, List.of("illuminazione", "design"));

        Design d9 = createDesign("Cover smartphone con impronta", "Pattern personalizzabile con il tuo nome",
                chiara, "FDM", "Cover rigida traforata con pattern a impronta digitale, nome inciso a richiesta.",
                List.of("https://sc04.alicdn.com/kf/Hcaddff5fdc534feab623434778be2596V.jpg"),
                18.50, List.of("gadget", "personalizzabile"));

        Design d10 = createDesign("Fioriera a spirale da esterno", null,
                andrea, "FDM", "Fioriera decorativa a spirale, stampabile in un unico pezzo.",
                List.of(COMMONS + "/thumb/1/17/Screwable_Box_%285887976037%29.jpg"
                        + "/960px-Screwable_Box_%285887976037%29.jpg"),
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

    // Panorami (Wikimedia Commons, licenze libere) usati come copertina del profilo designer.
    // Assegnati a rotazione nell'ordine di creazione, cosi' ogni designer ne ha uno diverso.
    private static final List<String> PANORAMAS = List.of(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/1_pano_cuiping_yangshuo_2016.jpg"
                    + "/1920px-1_pano_cuiping_yangshuo_2016.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2013_Rainbow_over_Washfold.jpg"
                    + "/1920px-2013_Rainbow_over_Washfold.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06"
                    + "/2014_Yorkshire_Dales_country_road_Swaledale_Askrigg.jpg"
                    + "/1920px-2014_Yorkshire_Dales_country_road_Swaledale_Askrigg.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/2013_Cogden_Bridge.jpg"
                    + "/1920px-2013_Cogden_Bridge.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/2015_Swaledale_from_Kisdon_Hill.jpg"
                    + "/1920px-2015_Swaledale_from_Kisdon_Hill.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/2015_Ribblehead_Viaduct_1.jpg"
                    + "/1920px-2015_Ribblehead_Viaduct_1.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/2018_-_Ch%C3%A2teau_fort_de_Lourdes.jpg"
                    + "/1920px-2018_-_Ch%C3%A2teau_fort_de_Lourdes.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/2014_Track_on_Fremington_Edge.jpg"
                    + "/1920px-2014_Track_on_Fremington_Edge.jpg");

    private int panoramaCounter = 0;

    private String nextPanorama() {
        return PANORAMAS.get(panoramaCounter++ % PANORAMAS.size());
    }

    // Foto reali di oggetti stampati in 3D da Wikimedia Commons (licenze libere).
    // loremflickr restituiva immagini casuali e spesso scorrelate al design.
    private static final String COMMONS = "https://upload.wikimedia.org/wikipedia/commons";

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
        user.setBackgroundPhotoUrl(nextPanorama());
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