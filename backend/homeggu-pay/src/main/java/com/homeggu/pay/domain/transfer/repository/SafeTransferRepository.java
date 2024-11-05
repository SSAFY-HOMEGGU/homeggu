package com.homeggu.pay.domain.transfer.repository;

import com.homeggu.pay.domain.transfer.entity.SafeTransfer;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface SafeTransferRepository extends JpaRepository<SafeTransfer, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<SafeTransfer> findById(Long transferId);
}
