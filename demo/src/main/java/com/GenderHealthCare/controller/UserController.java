package com.GenderHealthCare.controller;

        import com.GenderHealthCare.model.Root;
        import com.GenderHealthCare.model.User;
        import com.GenderHealthCare.service.CustomOAuth2UserService;
        import lombok.RequiredArgsConstructor;
        import org.springframework.http.HttpStatus;
        import org.springframework.http.ResponseEntity;
        import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
        import org.springframework.web.bind.annotation.GetMapping;
        import org.springframework.web.bind.annotation.RequestMapping;
        import org.springframework.web.bind.annotation.RestController;

        import java.util.Map;
        import java.util.Set;
        import java.util.stream.Collectors;

        @RestController
        @RequestMapping("/gender-health-care")
        @RequiredArgsConstructor
        public class UserController {
            private final CustomOAuth2UserService customOAuth2UserService;

            @GetMapping("/signingoogle")
            public ResponseEntity<?> currentuser(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
                if (oAuth2AuthenticationToken == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
                }
                Root userInfo = toPerson(oAuth2AuthenticationToken.getPrincipal().getAttributes());

                // Save user data to database
                try {
                    User savedUser = customOAuth2UserService.processOAuthPostLogin(
                            userInfo.getEmail(),
                            userInfo.getName(),
                            userInfo.getPicture()
                    );
                    return ResponseEntity.ok(Map.of(
                            "message", "Đăng nhập thành công",
                            "user", savedUser
                    ));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Lỗi khi lưu thông tin người dùng: " + e.getMessage());
                }

                    //return ResponseEntity.ok(oAuth2AuthenticationToken.getPrincipal().getAttributes());
            }

            public Root toPerson(Map<String, Object> map){
                if(map == null || map.isEmpty()) {
                    return null;
                }
                Root root = new Root();
                root.setEmail((String) map.get("email"));
                root.setName((String) map.get("name"));
                root.setPicture((String) map.get("picture"));
                return root;
            }
        }
