import { useEffect, useRef, useState } from "react";
import { refreshAccessToken, handleLogout } from 'common/Common';
import "manager/system/ReviewPopup.css";
import { store } from '../../redux/store';
import axios from "axios";

const ReviewPopup = ( { colse } ) => {
  const [user, setUser] = useState("123");
  const [score, setScore] = useState(0);

  // 상세내용
  const [postCode,setPostCode] = useState();
  const [postType,setPostType] = useState();
  const [postTitle,setPostTitle] = useState("");
  const [postContent,setPostContent] = useState("");
  const [authorCode,setAuthorCode] = useState();
  const [authorType,setAuthorType] = useState();
  const [authorName,setAuthorName] = useState();

  const postCreateReview = async (newPost) => {
    try {
      const token = localStorage.getItem('accessToken');
      await createReview(token, newPost);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await createReview(newToken, newPost);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  } 
  const createReview = async (token, newPost) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews`,
      newPost,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,  
      }
    );
  }

 
  useEffect(()=>{
    pageSeting();
  },[])

  const pageSeting = () => {
    setUser(store.getState().userState);
    setAuthorCode(store.getState().userState.userCode);
    setAuthorName(store.getState().userState.userName);
    setPostTitle(store.getState().userState.userName? store.getState().userState.userName:""+"님 후기");
  }

  const StarSeting = () => {
    const star = [];

    for (let index = 0; index < score; index++) {
      star.push("★");
    }
    for (let index = 0; index < 5 - score; index++) {
      star.push("☆");
    }
    return (<>
      <span onClick={ ()=>setScore(1) } > {star[0]} </span>
      <span onClick={ ()=>setScore(2) } > {star[1]} </span>
      <span onClick={ ()=>setScore(3) } > {star[2]} </span>
      <span onClick={ ()=>setScore(4) } > {star[3]} </span>
      <span onClick={ ()=>setScore(5) } > {star[4]} </span>
    </>)
  }

  const handleCreate = () => {

    if(postContent==="") {
      alert("후기를 적성해주세요.")
      return ;
    }

    const newPost = {
      post_code: postCode,
      post_type: postType,
      post_title: postTitle,
      post_content: postContent,
      author_code: authorCode ? authorCode : 55,
      author_type: authorType,
      author: null,
      created_at: null,
      updated_at: null,
      review_rating: score,
    }

    postCreateReview(newPost);
    alert("후기가 적성되었습니다.")
  }

  //텍스트박스 크기조절
  const textarea = useRef();
  const handleResizeHeight = (e) => {
    setPostContent(e.target.value);
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  }
  const handleColse = () => {
    if(colse){
      colse();
    }
  }
  return (
    <div className="user-review-popup">
      <div className="user-review-popup-wrap">
        <div className="user-review-popup-line">
          <div className="user-review-popup-title"> <h6> {authorName}님 후기</h6> </div>
        </div>
        <div className="user-review-popup-line">
          <div className="user-review-popup-score">
            {/* ★☆☆☆☆ */}
            {StarSeting()}
          </div>
        </div>
        <div className="user-review-popup-line">
          <textarea className="width400 user-review-popup-content"
          rows={5} ref={textarea} onChange={(e)=>{handleResizeHeight(e)}}/>
        </div>
        <div className="user-review-popup-line">
          <button className="manager-button" onClick={()=>handleCreate()}>작성</button> 
          <button className="manager-button" onClick={()=>handleColse()}>닫기</button>
        </div>

      </div>
    </div>
  )
}

export default ReviewPopup;
