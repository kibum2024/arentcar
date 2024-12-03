package com.apple.arentcar.mapper;

import com.apple.arentcar.model.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostsMapper {
    List<Notices> getPostsAll();
    List<Notices> getAllNotices(Integer pageSize, Integer pageNumber);
    int countAllNotices();
    List<Notices> getsSearchNotices(String keyword, Integer pageSize, Integer pageNumber);
    int countSearchNotices(String keyword);
    Notices getNotice(Integer postCode);
    void createNotice(Notices notice);
    void updateNotice(Notices notice);
    void deleteNotice(Integer postCode);

    List<Reviews> getAllReviews(Integer pageSize, Integer pageNumber);
    int countReviews();
    List<Reviews> getSearchAllReviews(String keyword, Integer pageSize, Integer pageNumber);
    int countSearchReviews(String keyword);
    Reviews getReview(Integer postCode);
    void createReviewPosts(Reviews reviews);
    void createReview(Reviews reviews);
    void deleteReview(Integer postCode);
    void deletePostsRV(Integer postCode);
    List<ChartsAvg> dayChartsAvg();
    List<ChartsCount> dayChartsCount();
    List<ChartsAvg> ageChartsAvg();
    List<ChartsCount> ageChartsCount();

    List<Inquirys> getAllInquirys();
    Inquirys getInquirys(Integer postCode);
    List<Responses> getResponses(Integer postCode);
    void createResponses(Responses responses);
    void updateResponses(Responses responses);
    void deleteResponses(Integer responseCode);
}
