    package com.apple.arentcar.mapper;
  
import com.apple.arentcar.model.VisitorLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VisitorLogMapper  {

    List<VisitorLog> getAllVisitorLog();

    VisitorLog getVisitorLogById(@Param("visitorLogCode") Integer visitorLogCode);

    Integer getVisitorLogCount();

    void createVisitorLog(@Param("ipAddress") String ipAddress);

}