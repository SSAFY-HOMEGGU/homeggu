package com.homeggu.domain.user.repository;

import com.homeggu.domain.user.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Integer> {

}
