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

        // Handle different types of authentication
        if (principal instanceof UserDetails userDetails) {
            // Form-based authentication with UserDetails
            username = userDetails.getUsername();
        } else if (principal instanceof OAuth2User oauth2User) {
            // OAuth2 authentication
            // Extract username based on your OAuth2 provider's attribute mapping
            // This might need adjustment based on your OAuth configuration
            username = oauth2User.getAttribute("email");  // or "name", "login", etc.

            // If email is not available, try other common attributes
            if (username == null) {
                username = oauth2User.getAttribute("name");
            }
            if (username == null) {
                username = oauth2User.getName(); // Fallback to the name method
            }
        }

        // Update the last login time if we found a username
        if (username != null) {
            Optional<User> userOpt = userService.findByName(username);
            userOpt.ifPresent(user -> {
                user.setLastLogin(LocalDateTime.now());
                userService.saveUser(user);
            });
        }
    }
}