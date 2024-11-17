package com.apple.arentcar.service;

import com.apple.arentcar.model.Sliders;
import com.apple.arentcar.mapper.SlidersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SlidersService {

    @Autowired
    private SlidersMapper slidersMapper;

    public List<Sliders> getAllSliders() {
        return slidersMapper.getAllSliders();
    }

    public Sliders getSlidersById(Integer sliderCode) {
        return slidersMapper.getSlidersById(sliderCode);
    }

    public void createSliders(Sliders sliders) {
        slidersMapper.createSliders(sliders);
    }

    public void updateSlidersById(Sliders sliders) {
        slidersMapper.updateSlidersById(sliders);
    }

    public void deleteSlidersById(Integer sliderCode) {
        slidersMapper.deleteSlidersById(sliderCode);
    }

    public List<Sliders> getSlidersBySliderEnable(String sliderEnable) {
        return slidersMapper.getSlidersBySliderEnable(sliderEnable);
    }

}