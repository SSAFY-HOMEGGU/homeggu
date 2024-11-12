package com.homeggu.pay.domain.charge.repository;

import com.homeggu.pay.domain.charge.entity.Charge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargeRepository extends JpaRepository<Charge, Long> {
}
