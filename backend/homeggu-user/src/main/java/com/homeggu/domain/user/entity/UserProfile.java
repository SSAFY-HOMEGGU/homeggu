package com.homeggu.domain.user.entity;

import com.homeggu.domain.auth.entity.User;
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
    private String addressNickname;

    @Column
    private String userImagePath;

    @Column
    private String phoneNumber;

    @Column
    private int balance;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private User user;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateAddress(String address) {
        this.address = address;
    }

    public void updateAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

    public void updateAddressNickname(String addressNickname) {
        this.addressNickname = addressNickname;
    }

    public void updateUserImagePath(String userImagePath) {
        this.userImagePath = userImagePath;
    }

    public void updatePhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
