package com.ghsms.repository;

import com.ghsms.model.User;
import java.util.Optional;

public interface UserRepositoryCustom {
    Optional<User> findByEmail(String email);
}
