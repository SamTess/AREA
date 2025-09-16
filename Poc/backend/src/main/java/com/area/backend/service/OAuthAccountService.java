package com.area.backend.service;

import com.area.backend.dto.OAuthAccountDto;
import com.area.backend.model.OAuthAccount;
import com.area.backend.repository.OAuthAccountRepository;
import com.area.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OAuthAccountService {

    private final OAuthAccountRepository oauthRepo;
    private final UserRepository userRepo;

    public Optional<OAuthAccountDto> findByProviderAndProviderUserId(String provider, String providerUserId) {
        return oauthRepo.findByProviderAndProviderUserId(provider, providerUserId)
                .map(OAuthAccountDto::fromEntity);
    }

    public List<OAuthAccountDto> findByUserId(Long userId) {
        return oauthRepo.findByUserId(userId).stream()
                .map(OAuthAccountDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OAuthAccountDto createForUser(Long userId, String provider, String providerUserId,
                                         String accessToken, String refreshToken,
                                         OffsetDateTime tokenExpiresAt, String scope) {
        if (!userRepo.existsById(userId)) {
            throw new EntityNotFoundException("User not found: " + userId);
        }

        Optional<OAuthAccount> existing = oauthRepo.findByProviderAndProviderUserId(provider, providerUserId);
        OAuthAccount entity = existing.orElseGet(() -> {
            OAuthAccount a = new OAuthAccount();
            a.setUserId(userId);
            a.setProvider(provider);
            a.setProviderUserId(providerUserId);
            return a;
        });

        entity.setAccessToken(accessToken);
        entity.setRefreshToken(refreshToken);
        entity.setTokenExpiresAt(tokenExpiresAt);
        entity.setScope(scope);

        OAuthAccount saved = oauthRepo.save(entity);
        return OAuthAccountDto.fromEntity(saved);
    }

    @Transactional
    public OAuthAccountDto updateTokens(Long accountId, String accessToken, String refreshToken, OffsetDateTime expiresAt, String scope) {
        OAuthAccount entity = oauthRepo.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("OAuth account not found: " + accountId));
        entity.setAccessToken(accessToken);
        entity.setRefreshToken(refreshToken);
        entity.setTokenExpiresAt(expiresAt);
        entity.setScope(scope);
        OAuthAccount saved = oauthRepo.save(entity);
        return OAuthAccountDto.fromEntity(saved);
    }

    @Transactional
    public void deleteById(Long id) {
        oauthRepo.deleteById(id);
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        oauthRepo.deleteByUserId(userId);
    }
}
