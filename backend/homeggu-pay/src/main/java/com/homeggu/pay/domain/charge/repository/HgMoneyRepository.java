package com.homeggu.pay.domain.charge.repository;

import com.homeggu.pay.domain.charge.entity.HgMoney;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface HgMoneyRepository extends JpaRepository<HgMoney, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<HgMoney> findByUserId(Long userId);
}
