package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.AdminsLoginDTO;
import com.apple.arentcar.dto.ChartDataDTO;
import com.apple.arentcar.model.Branchs;
import com.apple.arentcar.model.Menus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BranchsMapper {

    List<Branchs> findAllBranches();

    List<Branchs> findBranchsByBranchName(@Param("branchname") String branchName);

    List<ChartDataDTO> getBranchChartData(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
