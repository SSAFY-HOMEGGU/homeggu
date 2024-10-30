package com.homeggu.domain.user.controller;

import com.homeggu.domain.user.entity.UserProfile;
import com.homeggu.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 유저 정보 상세 조회
    @GetMapping()
    public Optional<UserProfile> getUserProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        return userService.getUserProfile(accessToken);
    }
}
