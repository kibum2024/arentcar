package com.apple.arentcar.mapper;
  
import com.apple.arentcar.dto.RentalRateResponseDTO;
import com.apple.arentcar.model.RentalRates;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RentalRatesMapper  {

    List<RentalRates> getAllRentalRates();

    RentalRates getRentalRatesById(@Param("rateCode") Integer rateCode);

    List<RentalRateResponseDTO> getRentalRatesByCarTypeCategory(@Param("carTypeCategory") String carTypeCategory);

    void createRentalRates(RentalRates rentalRates);

    void updateRentalRatesById(RentalRates rentalRates);

    void deleteRentalRatesById(@Param("rateCode") Integer rateCode);

    

}