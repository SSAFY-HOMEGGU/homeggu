package com.homeggu.domain.userProfile.dto.response;

import com.homeggu.global.baseTimeEntity.UpdateTimeEntity;
import jakarta.annotation.Nullable;
import lombok.Getter;

@Getter
@Nullable
public class UpdateProfileResponse extends UpdateTimeEntity {
    private String nickname;
    private String address;
    private String addressDetail;
    private String addressNickname;
    private String phoneNumber;
    private String userImagePath;
}
