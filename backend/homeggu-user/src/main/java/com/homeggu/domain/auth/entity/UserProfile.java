package com.homeggu.domain.auth.entity;

import com.homeggu.global.baseTimeEntity.CreateTimeEntity;
import com.homeggu.global.baseTimeEntity.UpdateTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile extends UpdateTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userProfileId;

    @Column(nullable = false)
    private String nickname;

    @Column
    private String address;

    @Column
    private String addressDetail;

    @Column
    private String userImagePath;

    @Column
    private String phoneNumber;

    @Column
    private int balance;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;
}
