package com.apple.arentcar.service;

import com.apple.arentcar.dto.RentalRateResponseDTO;
import com.apple.arentcar.model.RentalRates;
import com.apple.arentcar.mapper.RentalRatesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalRatesService {

    @Autowired
    private RentalRatesMapper rentalRatesMapper;

    public List<RentalRates> getAllRentalRates() {
        return rentalRatesMapper.getAllRentalRates();
    }

    public RentalRates getRentalRatesById(Integer rateCode) {
        return rentalRatesMapper.getRentalRatesById(rateCode);
    }

    public List<RentalRateResponseDTO> getRentalRatesByCarTypeCategory(String carTypeCategory) {
        return rentalRatesMapper.getRentalRatesByCarTypeCategory(carTypeCategory);
    }

    public void createRentalRates(RentalRates rentalRates) {
        rentalRatesMapper.createRentalRates(rentalRates);
    }

    public void updateRentalRatesById(RentalRates rentalRates) {
        rentalRatesMapper.updateRentalRatesById(rentalRates);
    }

    public void deleteRentalRatesById(Integer rateCode) {
        rentalRatesMapper.deleteRentalRatesById(rateCode);
    }

    

}