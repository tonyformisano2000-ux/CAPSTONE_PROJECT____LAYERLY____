package CAPSTONE.repositories;

import CAPSTONE.entities.Design;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DesignRepository extends JpaRepository<Design, Long> {
    List<Design> findByDesignerId(Long designerId);
    List<Design> findByTechnology(String technology);
}