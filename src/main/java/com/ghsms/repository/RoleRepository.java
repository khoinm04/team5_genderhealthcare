package com.ghsms.repository;

import com.ghsms.model.Role;
import com.ghsms.model.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(RoleType name);
}
