package com.homeggu.pay.domain.transfer.repository;

import com.homeggu.pay.domain.transfer.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferRepository extends JpaRepository<Transfer, Long> {
}
