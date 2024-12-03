import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { refreshAccessToken, handleLogout } from 'common/Common';
import 'manager/system/PostReviews.css';
import ReviewPopup from 'manager/system/ReviewPopup';
import { AvgCharts, RvCharts } from './Charts';
import Loading from 'common/Loading';


const PostReviews = ({ onClick }) => {
  const [loading, setLoading] = useState(false);
  //고객후기
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  //검색/페이징
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 10;
  // const [totalPages, setTotalPages] = useState(0);
  //컬럼
  const [columnReviews] = useState([
    { columnName: '코드', field: 'post_code', width: 100, align: 'center'},
    { columnName: '구분', field: 'post_type', width: 100, align: 'center'},
    { columnName: '별점', field: 'review_rating', width: 150, align: 'center'},
    { columnName: '제목', field: 'post_title', width: 350, align: 'left'},
    { columnName: '작성자', field: 'author', width: 150, align: 'center'},
    { columnName: '작성일', field: 'created_at', width: 150, align: 'center'},
    { columnName: '작업', field: '', width: 230, align: 'center'},
  ]);//review_rating
  //팝업창
  const [isPopUp, setIsPopUp] = useState(false);
  const [popupType, setPopupType] = useState()
  // 상세내용
  const [postCode,setPostCode] = useState();
  const [postType,setPostType] = useState();
  const [postTitle,setPostTitle] = useState("");
  const [postContent,setPostContent] = useState("");
  const [authorCode,setAuthorCode] = useState();
  const [authorType,setAuthorType] = useState();
  const [authorName,setAuthorName] = useState();
  const [reviewRating, setReviewRating] = useState();
  //통계
  const [statistics, setStatistics] = useState();
  const [stats, setStats] = useState(0);



  const pageReviews = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetchReviews(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await fetchReviews(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const fetchReviews = async (token) => {
    const params = {
      pageSize,
      pageNumber,
    };
    if(searchName && searchName.trim() !== "") {
      params.postName = searchName;
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if(response.data) {
      setReviews(response.data);
    }
  }

  //검색된 개수
  const getTotalCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getCount(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const newToken = await refreshAccessToken();
        await getCount(newToken);
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const getCount = async (token) => {
    const params = searchName && searchName.trim() !== "" ? { postName: searchName } : {}

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/count`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    if(typeof response.data === "number") {
      setTotalReviews(response.data);
    } else {
      console.error('Unexpected response:', response.data);
    }
  }

  const getByCodeReviews = async (code) => {
    try {
      const token = localStorage.getItem('accessToken');
      await getReviews(token, code);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getReviews(newToken, code);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const getReviews = async (token, code) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    )
    if(response.data) {
      setPostTitle(response.data.post_title);
      setPostContent(response.data.post_content);
      setAuthorName(response.data.author);
      setReviewRating(response.data.review_rating);
      // scoreSeting(response.data.review_rating);
    }

  }

  const postDeleteReviews = async (code) => {
    try {
      const token = localStorage.getItem('accessToken');
      await deleteReviews(token,code);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await deleteReviews(newToken, code);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    } finally {
      setLoading(false);
    }
  }
  const deleteReviews = async (token,code) => {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    )
    pageReviews();
  }

  useEffect(()=>{
    getTotalCount();
    pageReviews();
  }, [pageNumber])

  //검색
  const handleSearchClick = async () => {
    pageReviews();
    getTotalCount();  
    setPageNumber(0);
  }


  const handleDeleteClick = (e) => {
    if (window.confirm('후기를 정말로 삭제하시겠습니까?')) {
      postDeleteReviews(e)
    }
  }


  //팝업창
  const handlePopupClick = (e) =>{
    if(e[0] === "보기") {
      setPopupType(e[0]);
      getByCodeReviews(e[1]);
      
    } else if(e[0] === "통계") {
      setPopupType(e[0]);
    } else if(e[0] === "추가") {
      setPopupType(e[0]);
    }
    
    setIsPopUp(true)
  }

  let totalPages = Math.ceil(totalReviews/ pageSize);
  if (totalPages < 1) { totalPages = 1; }
  if (totalReviews === 0) { totalPages = 0; }

  const scoreSeting = (star) => {
    const scoreStar = [];
    for (let index = 0; index < star; index++) {
      scoreStar.push("★");
    }
    for (let index = 0; index < 5 - star; index++) {
      scoreStar.push("☆");
    }
    return <> {scoreStar} </>
  }
  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleClosePopup = () => {
    setPopupType("")
  };
  return (
    <div className='manager-post-reviews-wrap'>
      <div className='manager-post-reviews-header-wrap'>
        <div className='manager-post-reviews-header-title'>
          <h5 className='manager-post-reviews-header-h5'> 고객후기 게시판 </h5>
        </div>
      </div>
      <div className='manager-post-reviews-table-wrap'>
        <div className='manager-post-reviews-table-head'>
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="manager-post-serch">제목</label>
            <input id='manager-post-serch' className='width200' type="text" 
              value={searchName}  
              onChange={(e)=>(setSearchName(e.target.value))} 
              onKeyDown={(e)=>{if(e.key === "Enter") {handleSearchClick()} }}></input>
            <button className='manager-button manager-button-search' onClick={()=>handleSearchClick()}> 검색 </button>
            <span> [ 검색건수 : {totalReviews}건 ] </span>
          </div>

          <div>
              <button className='manager-button manager-button-insert' onClick={()=> handlePopupClick(["통계"])}> 통계 </button>
              {/* <button className='manager-button manager-button-insert' onClick={()=> setPopupType("추가")}> 추가 </button> */}
              <button className='manager-button manager-button-close' onClick={() => handleCloseClick()}> 닫기</button>
          </div>
        </div>

        <table className='manager-post-reviews-table-body'>
          <thead>
            <tr>
              {columnReviews && (columnReviews.map((column,index)=>(
                  <th key={index} className='manager-post-reviews-table-head-colmn' style={{ width: `${column.width}px`, textAlign: `center` }}>
                    {column.columnName}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody> 
            {reviews && (reviews.map((review, index)=>(
                <tr key={index}>
                  {columnReviews && (columnReviews.map((column,index)=>(
                    <td key={index} className='manager-post-reviews-table-row-colmn'
                      style={{width:`${column.width}`, textAlign:`${column.align}`}}>
                      {column.field === '' ? (
                        <>
                          <button className='manager-button post-btn2' onClick={()=> handlePopupClick([ "보기", review["post_code"] ])}> 보기 </button>
                          {/* <button className='manager-button post-btn3' > 수정 </button>  */}
                          <button className='manager-button post-btn1' onClick={()=> handleDeleteClick(review["post_code"]) }> 삭제 </button> 
                        </>
                      ) : (
                        review[column.field]
                      )}
                    </td>
                  )))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {isPopUp && (
          <div className='manager-post-review-popup'>
            {popupType === "보기" && (
              <div className='manager-post-review-popup-wrap manager-post-review-popup-read'>
                <div className='manager-post-review-popup-header'>
                  <div className='manager-post-review-popup-title'> <h6 className='manager-post-review-h6'> {postTitle} </h6> </div>
                  <div className='manager-post-review-popup-buttons'>
                    <div className='manager-post-review-popup-author'> 
                      작성자 : {authorName} <span style={{fontSize:"14px"}}>│</span>
                      <div className='manager-post-review-popup-scope'>
                        {scoreSeting(reviewRating)}
                        {/* ⭐ ★ ☆ */}
                      </div>
                    </div>
                    <button className='manager-button manager-post-review-popup-close' onClick={()=>{setPostContent(""); setIsPopUp(false);}}>닫기</button>
                  </div>
                </div>
                <hr/>
                <div className='manager-post-review-popup-line'>
                  {postContent}
                </div>
              </div>
            )}

            {popupType === "통계" && (
              <div className='manager-post-review-popup-wrap manager-post-review-popup-statistics'>
                <div className='manager-post-review-popup-header'>
                  <div className='manager-post-review-popup-title'> <h6 className='manager-post-review-h6'> {popupType} </h6> </div>
                  <div className='manager-post-review-popup-buttons'>
                    <button className='manager-button manager-post-review-popup-close' onClick={()=>setIsPopUp(false)}>닫기</button>
                  </div>
                </div>
                <hr style={{margin:" 10px 0px "}}/>
                <div className='manager-post-review-popup-line'>
                  {/* 대분류  리뷰수 전체평균 */}
                  {/* 소분류  날짜별 연령별 성별 */}
                  <ul>
                    <li onClick={()=>{setStats(0)}} className={`${stats === 0 ? 'on' : ''}`}> 날짜별 </li>
                    <li onClick={()=>{setStats(1)}} className={`${stats === 1 ? 'on' : ''}`}> 연령별 </li>
                    {/* <li onClick={()=>{setStats(2)}} className={`${stats === 2 ? 'on' : ''}`}> 성별 </li> 형님이 성별 추가하기 귀찮은이까 하지말라고 하신거 */}
                  </ul>
                </div>
                <div className='manager-post-review-popup-line manager-post-review-popup-content'>
                  <div className='manager-post-review-popup-line-statistics'> 
                    {/* <차트> $ npm install recharts */}
                    <RvCharts stats={stats}/>
                    <div className='manager-post-review-popup-bold'>리뷰수</div>
                  </div>
                  <div className='manager-post-review-popup-line-statistics'>
                    {/* <차트> $ npm install recharts */}
                    <AvgCharts stats={stats}/>
                    <div className='manager-post-review-popup-bold'>평균</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
        <div className='manager-post-reviews-table-paging flex-align-center'>
          <button className='manager-button' onClick={()=>setPageNumber(pageNumber - 1)}
            style={{color: pageNumber === 0 ? '#aaa' : '#26319b'}}
            disabled={pageNumber === 0}
          >이전</button>
          <div className='manager-post-reviews-table-paging-page'>{(pageNumber+1)} / {totalPages}</div>
          <button className='manager-button' onClick={()=>setPageNumber(pageNumber + 1)}
            style={{color: (pageNumber + 1) >= totalPages ? '#aaa' : '#26319b'}}
            disabled={ (pageNumber + 1) >= totalPages }
          >다음 </button>
        </div>

      </div>
      {/* {popupType === "추가" && (
      <ReviewPopup colse={handleClosePopup} />
      )} */}
      {loading && (
        <Loading />
      )}
    </div>
  )
}

export default PostReviews;