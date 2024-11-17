package com.homeggu.pay.global.client;

import com.homeggu.pay.global.client.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "homeggu-user")
public interface UserServiceClient {

    @GetMapping("/api/user/profile/detail")
    UserResponse getUserProfile(@RequestHeader("userId") Long userId);

}
