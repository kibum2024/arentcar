package com.apple.arentcar.mapper;

import com.apple.arentcar.model.Sliders;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SlidersMapper  {

    List<Sliders> getAllSliders();

    Sliders getSlidersById(@Param("sliderCode") Integer sliderCode);

    void createSliders(Sliders sliders);

    void updateSlidersById(Sliders sliders);

    void deleteSlidersById(@Param("sliderCode") Integer sliderCode);

    List<Sliders> getSlidersBySliderEnable(@Param("sliderEnable") String sliderEnable);

}