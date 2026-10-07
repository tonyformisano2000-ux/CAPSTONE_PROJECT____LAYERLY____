package CAPSTONE.services;

import CAPSTONE.exceptions.ImageUploadException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return result.get("secure_url").toString();
        } catch (IOException | RuntimeException e) {
            // il messaggio di Cloudinary (es. "Invalid cloud_name") va propagato,
            // altrimenti il frontend riceve solo un generico 500
            throw new ImageUploadException("Image upload to Cloudinary failed: " + e.getMessage());
        }
    }
}
