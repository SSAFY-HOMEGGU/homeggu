package com.homeggu.pay.global.client;

import com.homeggu.pay.global.client.dto.response.SalesBoardResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "homeggu-goods")
public interface GoodsServiceClient {

    @GetMapping("/api/goods/board/{boardId}")
    SalesBoardResponse getGoods(@PathVariable("boardId") Long boardId);

}
