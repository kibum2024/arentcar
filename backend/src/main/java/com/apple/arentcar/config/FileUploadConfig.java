package com.apple.arentcar.config;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jakarta.servlet.MultipartConfigElement;
import org.springframework.util.unit.DataSize;

@Configuration
public class FileUploadConfig {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();

        // 파일 크기 제한 설정(DataSize를 사용)
        factory.setMaxFileSize(DataSize.ofMegabytes(10));  // 최대 파일 크기 10MB
        factory.setMaxRequestSize(DataSize.ofMegabytes(10));  // 최대 요청 크기 10MB

        return factory.createMultipartConfig();
    }
}
