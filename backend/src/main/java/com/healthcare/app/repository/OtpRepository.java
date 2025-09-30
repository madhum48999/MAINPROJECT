package com.healthcare.app.repository;

import com.healthcare.app.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);

    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiresAt < :now")
    void deleteExpiredOtps(@Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Otp o SET o.used = true WHERE o.email = :email AND o.otpCode = :otpCode")
    void markOtpAsUsed(@Param("email") String email, @Param("otpCode") String otpCode);
}
