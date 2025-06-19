package com.ghsms.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.*;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "GHSMS API", version = "1.0"),
        security = @SecurityRequirement(name = "google-oauth")
)
@SecurityScheme(
        name = "google-oauth",
        type = SecuritySchemeType.OAUTH2,
        flows = @OAuthFlows(
                authorizationCode = @OAuthFlow(
                        authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth",
                        tokenUrl = "https://oauth2.googleapis.com/token",
                        scopes = {
                                @OAuthScope(name = "openid", description = "OpenID"),
                                @OAuthScope(name = "email", description = "Email address"),
                                @OAuthScope(name = "profile", description = "Profile information")
                        }
                )
        )
)
public class SwaggerConfig {}

