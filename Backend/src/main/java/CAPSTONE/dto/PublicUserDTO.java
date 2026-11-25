package CAPSTONE.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// dati visibili a chiunque, anche senza login: niente email ne' ruolo
@ToString
@NoArgsConstructor
@Getter
@Setter
public class PublicUserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String profilePhotoUrl;
    private String backgroundPhotoUrl;
    private String location;
    private String designerLevel;
}
