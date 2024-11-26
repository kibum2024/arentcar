package com.apple.arentcar.mapper;
  
import com.apple.arentcar.model.Branchs;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BranchsMapper  {

    List<Branchs> getAllBranchs();

    Branchs getBranchsById(@Param("branchCode") Integer branchCode);

    void createBranchs(Branchs branchs);

    void updateBranchsById(Branchs branchs);

    void deleteBranchsById(@Param("branchCode") Integer branchCode);

    

}