package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.RentalCarsBranchOptionAttrDTO;
import com.apple.arentcar.dto.RentalCarsCarOptionAttrDTO;
import com.apple.arentcar.dto.RentalCarsDTO;
import com.apple.arentcar.model.RentalCars;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RentalCarsMapper {

    List<RentalCars> getAllRentalCars();

    RentalCars getRentalCarsById(Integer carCode);

    // 차량 등록
    void createRentalCars(RentalCars rentalCars);
    // 차량 삭제
    void deleteRentalCarsById(@Param("carCode") Integer carCode);
    // 차량 수정
    void updateRentalCarsById(RentalCars rentalCars);
    // 차량 조회 및 페이지네이션
    List<RentalCarsDTO> getRentalCarsWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);
    // 차량 조회 및 페이지네이션(검색 기능 포함)
    List<RentalCarsDTO> getRentalCarsByNumWithPaging(@Param("carNumber") String carNumber,
                                                  @Param("pageSize") int pageSize,
                                                  @Param("offset") int offset);
    // 전체 차량 수 조회
    int countAllRentalCars();
    // 전체 차량 수 조회(검색 기능 포함)
    int countRentalCarsByNum(@Param("carNumber") String carNumber);
    // 렌탈가능/렌탈중/정비중 전체 차량 수 조회
    int countAvailableRentalCars(@Param("carStatus") String carStatus);
    // <select>의 <option>값으로 차량코드/명 동적으로 불러오기
    List<RentalCarsCarOptionAttrDTO> getRentalCarsCodeName();
    // <select>의 <option>값으로 지점코드/명 동적으로 불러오기
    List<RentalCarsBranchOptionAttrDTO> getRentalCarsBranchCodeName();
    // 엑셀 파일 다운로드용 차량 조회
    List<RentalCarsDTO> getRentalCarsForExcel();
}