package com.homeggu.global.s3;

import com.amazonaws.services.s3.AmazonS3;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Transactional
@Service
@RequiredArgsConstructor
public class S3Service {

//    private final AmazonS3 amazonS3Client;
//
//    @Value("${cloud.aws.s3.bucket}")
//    private  String bucket;
//
//    public String uploadFile(MultipartFile file) throws IOException {
//        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//        amazonS3Client.putObject(bucket, fileName, file.getInputStream(), null);
//        return amazonS3Client.getUrl(bucket, fileName).toString(); // 업로드된 파일의 URL 반환
//    }

}
