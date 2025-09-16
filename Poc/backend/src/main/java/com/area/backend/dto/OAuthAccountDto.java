package com.area.backend.dto;

import com.area.backend.model.OAuthAccount;
import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthAccountDto {
    private Long id;
    private Long userId;
    private String provider;
    private String providerUserId;
    private OffsetDateTime tokenExpiresAt;
    private String scope;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public static OAuthAccountDto fromEntity(OAuthAccount e) {
        if (e == null) return null;
        return OAuthAccountDto.builder()
            .id(e.getId())
            .userId(e.getUserId())
            .provider(e.getProvider())
            .providerUserId(e.getProviderUserId())
            .tokenExpiresAt(e.getTokenExpiresAt())
            .scope(e.getScope())
            .createdAt(e.getCreatedAt())
            .updatedAt(e.getUpdatedAt())
            .build();
    }

    public OAuthAccount toEntity() {
        return OAuthAccount.builder()
            .id(this.id)
            .userId(this.userId)
            .provider(this.provider)
            .providerUserId(this.providerUserId)
            .tokenExpiresAt(this.tokenExpiresAt)
            .scope(this.scope)
            .createdAt(this.createdAt)
            .updatedAt(this.updatedAt)
            .build();
    }
}
