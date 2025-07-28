package com.ghsms.listener;

import com.ghsms.model.User;
import com.ghsms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class LoginSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {

    @Autowired
    private UserService userService;

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        Authentication authentication = event.getAuthentication();
        Object principal = authentication.getPrincipal();

        String username = null;

        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else if (principal instanceof OAuth2User oauth2User) {

            username = oauth2User.getAttribute("email");

            if (username == null) {
                username = oauth2User.getAttribute("name");
            }
            if (username == null) {
                username = oauth2User.getName();
            }
        }
        if (username != null) {
            Optional<User> userOpt = userService.findByName(username);
            userOpt.ifPresent(user -> {
                user.setLastLogin(LocalDateTime.now());
                userService.saveUser(user);
            });
        }
    }
}