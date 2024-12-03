package com.apple.arentcar.service;

import com.apple.arentcar.mapper.PostsMapper;
import com.apple.arentcar.model.*;
import com.apple.arentcar.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostsService {

    @Autowired
    PostsMapper postsMapper;

    @Autowired
    JwtUtil jwtUtil;

    public List<Notices> getPostsAll() {return postsMapper.getPostsAll();}
    public List<Notices> getAllNotices(Integer pageSize, Integer pageNumber) {
        int offset = pageNumber * pageSize;
        return postsMapper.getAllNotices(pageSize, offset);
    }
    public int countAllNotices() { return postsMapper.countAllNotices(); }
    public Notices getNotice(Integer postCode) { return postsMapper.getNotice(postCode); }
    public List<Notices> getSearchNotices(String keyword, Integer pageSize, Integer pageNumber) {
        int offset = pageNumber * pageSize;
        return postsMapper.getsSearchNotices(keyword, pageSize, offset);
    }
    public int countSearchNotices(String keyword) { return postsMapper.countSearchNotices(keyword); }

    public void createNotices(Notices notices) { postsMapper.createNotice(notices); }
    public void updateNotice(Notices notices) { postsMapper.updateNotice(notices); }
    public void deleteNotice(Integer postCode) { postsMapper.deleteNotice(postCode); }


    public int countAllReviews() { return postsMapper.countAllNotices(); }
    public List<Reviews> getAllReviews(Integer pageSize, Integer pageNumber) {
        int offset = pageNumber * pageSize;
        return postsMapper.getAllReviews(pageSize, offset);
    }
    public List<Reviews> getSearchAllReviews(String keyword, Integer pageSize, Integer pageNumber) {
        int offset = pageNumber * pageSize;
        return postsMapper.getSearchAllReviews(keyword, pageSize, offset);
    }
    public int countReviews() { return postsMapper.countReviews(); }
    public int countSearchReviews(String keyword) { return postsMapper.countSearchReviews(keyword); }
    public Reviews getReview(Integer postCode) { return postsMapper.getReview(postCode); }
    public void createReview(Reviews reviews) {
        postsMapper.createReviewPosts(reviews);
        System.out.println(reviews.getPostCode());
        postsMapper.createReview(reviews);
    }
    public void deleteReview(Integer postCode) {
        System.out.println(postCode);
        postsMapper.deleteReview(postCode);
        postsMapper.deletePostsRV(postCode);
    }
    public List<ChartsCount> dayChartsCount() {
        return postsMapper.dayChartsCount();
    }
    public List<ChartsAvg> dayChartsAvg() {
        return postsMapper.dayChartsAvg();
    }
    public List<ChartsCount> ageChartsCount() {
        return postsMapper.ageChartsCount();
    }
    public List<ChartsAvg> ageChartsAvg() {
        return postsMapper.ageChartsAvg();
    }


    public List<Inquirys> getAllInquirys() { return postsMapper.getAllInquirys(); }
    public Inquirys getInquirys(Integer postCode) { return postsMapper.getInquirys(postCode); }
    public List<Responses> getResponses(Integer pageCode) { return postsMapper.getResponses(pageCode); }
    public void createResponses(Responses responses) { postsMapper.createResponses(responses); }
    public void updateResponses(Responses responses) { postsMapper.updateResponses(responses); }
    public void deleteResponses(Integer code) { postsMapper.deleteResponses(code); }
}
