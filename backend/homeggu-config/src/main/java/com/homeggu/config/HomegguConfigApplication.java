package com.homeggu.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class HomegguConfigApplication {

    public static void main(String[] args) {
        SpringApplication.run(HomegguConfigApplication.class, args);
    }

}
