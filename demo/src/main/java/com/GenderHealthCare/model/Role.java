package com.GenderHealthCare.model;

import com.GenderHealthCare.enums.RoleName;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Roles")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoleID")
    private Long roleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;

    @Column(name = "display_name")
    private String displayName;

    public Role(RoleName name, String displayName) {
        this.name = name;
        this.displayName = displayName;
    }
}