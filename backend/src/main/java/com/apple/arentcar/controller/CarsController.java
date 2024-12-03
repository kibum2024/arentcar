package com.apple.arentcar.controller;

import com.apple.arentcar.dto.CarTypesDTO;
import com.apple.arentcar.model.CarTypes;
import com.apple.arentcar.service.CarsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class CarsController {

    @Autowired
    private CarsService carsService;

    @GetMapping("/manager/cars")
    public List<CarTypes> getAllCars() { return carsService.getAllCars(); }

    @GetMapping("/manager/cars/{carTypeCode}")
    public ResponseEntity<CarTypes> getCarsById(@PathVariable Integer carTypeCode) {
        CarTypes carTypes = carsService.getCarsById(carTypeCode);
        if (carTypes != null) {
            return ResponseEntity.ok(carTypes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 차종 조회 및 페이지네이션(검색 기능 포함)
    @GetMapping("/manager/cars/paged")
    public ResponseEntity<List<CarTypesDTO>> getCarsWithPaging(
                                             @RequestParam int pageSize, // 10
                                             @RequestParam int pageNumber, // 기본 페이지 1
                                             @RequestParam(required = false) String carTypeName) {
        List<CarTypesDTO> carTypes;
        if (carTypeName != null && !carTypeName.isEmpty()) {
            carTypes = carsService.getCarsByNameWithPaging(carTypeName, pageSize, pageNumber);
        } else {
            carTypes = carsService.getCarsWithPaging(pageSize, pageNumber);
        }
        return ResponseEntity.ok(carTypes);
    }

    // 전체 차종 수 조회(검색 기능 포함)
    @GetMapping("/manager/cars/count")
    public ResponseEntity<Integer> getTotalCarsCount(@RequestParam(required = false) String carTypeName) {
        int count;
        if (carTypeName != null && !carTypeName.isEmpty()) {
            count = carsService.countCarsByName(carTypeName);
        } else {
            count = carsService.countAllCars();
        }
        return ResponseEntity.ok(count);
    }
    
    // 파일 업로드 경로
    @Value("${file.upload-dir.arentcar}")
    private String uploadDirectory;

    // 차종 등록 + 이미지 파일 업로드
    @PostMapping("/manager/cars")
    public ResponseEntity<CarTypes> createCars(@RequestPart("file") MultipartFile file,
                                               @RequestPart("carData") String carData) {
        try {
            // 파일 처리
            String originalFilename = file.getOriginalFilename();
            // 파일에 고유한 이름 부여하기
//            String uniqueFilename = UUID.randomUUID().toString() + "-" + originalFilename;

//            Path filePath = Paths.get(uploadDirectory, uniqueFilename);
            Path filePath = Paths.get(uploadDirectory, originalFilename);

            // 파일 이름 중복 확인
//            if (Files.exists(filePath)) {
//                return ResponseEntity.status(HttpStatus.CONFLICT).body("File with the same name already exists!");
//            }
            
            // StandardCopyOption.REPLACE_EXISTING -> 중복된 파일은 덮어쓰겠음
            // 덮어쓰기를 허용하므로 중복 확인은 필요하지 않음
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // JSON 데이터 처리
            ObjectMapper objectMapper = new ObjectMapper();
            CarTypes carTypes = objectMapper.readValue(carData, CarTypes.class);
            carTypes.setCarImageName(originalFilename); // 파일 이름을 CarTypes 객체에 설정

            CarTypes savedCars = carsService.createCars(carTypes);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCars);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 차종 삭제
    @DeleteMapping("/manager/cars/{carTypeCode}")
    public ResponseEntity<Void> deleteCarsById(@PathVariable Integer carTypeCode) {
        carsService.deleteCarsById(carTypeCode);
        return ResponseEntity.noContent().build();
    }

    // 차종 수정 + 이미지 파일 업로드
    @PutMapping("/manager/cars/{carTypeCode}")
    public ResponseEntity<Void> updateCarsById(@PathVariable Integer carTypeCode,
                                               @RequestPart("file") MultipartFile file,
                                               @RequestPart("carData") String carData) {
        try {
            // 파일 처리
            String originalFilename = file.getOriginalFilename();
            // 파일에 고유한 이름 부여하기
//            String uniqueFilename = UUID.randomUUID().toString() + "-" + originalFilename;

//            Path filePath = Paths.get(uploadDirectory, uniqueFilename);
            Path filePath = Paths.get(uploadDirectory, originalFilename);

            // 파일 이름 중복 확인
//            if (Files.exists(filePath)) {
//                return ResponseEntity.status(HttpStatus.CONFLICT).body("File with the same name already exists!");
//            }

            // 덮어쓰기를 허용하므로 중복 확인은 필요하지 않음
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // JSON 데이터 처리
            ObjectMapper objectMapper = new ObjectMapper();
            CarTypes carTypes = objectMapper.readValue(carData, CarTypes.class);
            carTypes.setCarImageName(originalFilename); // 파일 이름을 CarTypes 객체에 설정
            carTypes.setCarTypeCode(carTypeCode);

            carsService.updateCarsById(carTypes);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
