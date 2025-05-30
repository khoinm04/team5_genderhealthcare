package com.ghsms.service;

import com.ghsms.model.User;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        String email = oauth2User.getAttribute("email");

        User user = userRepository.findByEmail(email)
            .orElseGet(() -> createNewUser(oauth2User));

        return oauth2User;
    }

    private User createNewUser(OAuth2User oauth2User) {
        User user = new User();
        user.setEmail(oauth2User.getAttribute("email"));
        user.setFullName(oauth2User.getAttribute("name"));
        return userRepository.save(user);
    }
}
