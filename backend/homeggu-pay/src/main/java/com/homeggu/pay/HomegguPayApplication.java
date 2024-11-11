package com.homeggu.pay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class HomegguPayApplication {

	public static void main(String[] args) {
		SpringApplication.run(HomegguPayApplication.class, args);
	}

}
