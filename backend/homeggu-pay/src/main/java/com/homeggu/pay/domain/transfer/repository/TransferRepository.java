package com.homeggu.pay.domain.transfer.repository;

import com.homeggu.pay.domain.transfer.entity.Transfer;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface TransferRepository extends JpaRepository<Transfer, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Transfer> findById(Long transferId);
}
