package com.apple.arentcar.mapper.post;

import com.apple.arentcar.model.Menus;
import com.apple.arentcar.model.post.Inquirys;
import com.apple.arentcar.model.post.Notices;
import com.apple.arentcar.model.post.Reviews;
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
    List<Reviews> getSearchAllReviews(String keyword, Integer pageSize, Integer pageNumber);
    Reviews getReview(Integer postCode);



    List<Inquirys> getAllInquirys();
}
