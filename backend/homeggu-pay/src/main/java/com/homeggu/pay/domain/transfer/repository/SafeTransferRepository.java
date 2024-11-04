package com.homeggu.pay.domain.transfer.repository;

import com.homeggu.pay.domain.transfer.entity.SafeTransfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SafeTransferRepository extends JpaRepository<SafeTransfer, Long> {
}
