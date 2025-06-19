package com.ghsms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class Root {
    @JsonProperty("at_hash")
    private String atHash;
    private Long userID;
    private String sub;

    @JsonProperty("email_verified")
    private Boolean emailVerified;

    private String iss;

    @JsonProperty("given_name")
    private String givenName;

    private String nonce;

    private String picture;

    private List<String> aud;

    private String azp;

    private String name;

    private Date exp;

    private Date iat;

    private String email;

}