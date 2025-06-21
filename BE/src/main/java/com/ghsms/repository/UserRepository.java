package com.ghsms.repository;

import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByIsActiveTrue();
    List<User> findByRole_Name(RoleName roleName);
    long countByRole_Name(RoleName role); // 👈 dùng enum, không dùng String

}