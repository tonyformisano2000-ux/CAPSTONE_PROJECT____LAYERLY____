package CAPSTONE.repositories;

import CAPSTONE.entities.User;
import CAPSTONE.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRoleOrderByCreatedAtDesc(UserRole role);

    Optional<User> findByIdAndRole(Long id, UserRole role);
}