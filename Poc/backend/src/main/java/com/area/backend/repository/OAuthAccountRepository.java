package com.area.backend.repository;

import com.area.backend.model.OAuthAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, Long> {
    Optional<OAuthAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
    List<OAuthAccount> findByUserId(Long userId);
    Optional<OAuthAccount> findByUserIdAndProvider(Long userId, String provider);
    void deleteByUserId(Long userId);
}
