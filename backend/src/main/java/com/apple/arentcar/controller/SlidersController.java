package com.apple.arentcar.controller;

import com.apple.arentcar.model.Sliders;
import com.apple.arentcar.service.SlidersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class SlidersController {

    @Autowired
    private SlidersService slidersService;

    @GetMapping("/user/sliders")
    public List<Sliders> getAllSliders() {
        return slidersService.getAllSliders();
    }

    @GetMapping("/user/sliders/{sliderCode}")
    public ResponseEntity<Sliders> getSlidersById(
            @PathVariable Integer sliderCode) {
        Sliders sliders = slidersService.getSlidersById(sliderCode);
        if (sliders != null) {
            return ResponseEntity.ok(sliders);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Value("${file.upload-dir.arentcar}")
    private String uploadDir;

    @PostMapping("/user/sliders")
    public ResponseEntity<Sliders> createSliders(
            @RequestParam("slider_name") String sliderName,
            @RequestParam("slider_position") String sliderPosition,
            @RequestParam(value = "slider_image_name", required = false) MultipartFile sliderImageName,
            @RequestParam("slider_enable") String sliderEnable,
            @RequestParam("slider_url") String sliderUrl
    ) {
        Sliders slidersSave = new Sliders();
        slidersSave.setSliderName(sliderName);
        slidersSave.setSliderPosition(sliderPosition);
        slidersSave.setSliderEnable(sliderEnable);
        slidersSave.setSliderUrl(sliderUrl);

        if (sliderImageName != null && !sliderImageName.isEmpty()) {
            String slidersSaveImagePath = saveSlidersImage(sliderImageName);
            slidersSave.setSliderImageName(slidersSaveImagePath);
        }

        slidersService.createSliders(slidersSave);
        return ResponseEntity.status(HttpStatus.CREATED).body(slidersSave);
    }

    private String saveSlidersImage(MultipartFile slidersSaveImage) {
        String fileName = StringUtils.cleanPath(slidersSaveImage.getOriginalFilename());
        Path slidersSaveImagePath = Paths.get(uploadDir + fileName);

        try {
            Files.createDirectories(slidersSaveImagePath.getParent());
            Files.copy(slidersSaveImage.getInputStream(), slidersSaveImagePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }


    @PutMapping("/user/sliders/{sliderCode}")
    public ResponseEntity<Void> updateSlidersById(
            @PathVariable Integer sliderCode,
            @RequestBody Sliders sliders) {
        sliders.setSliderCode(sliderCode);

        slidersService.updateSlidersById(sliders);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/sliders/{sliderCode}")
    public ResponseEntity<Void> deleteSlidersById(
            @PathVariable Integer sliderCode) {
        slidersService.deleteSlidersById(sliderCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/sliders/{sliderEnable}")
    public List<Sliders> getSlidersBySliderEnable(
            @PathVariable String sliderEnable) {
        return slidersService.getSlidersBySliderEnable(sliderEnable);
    }

}