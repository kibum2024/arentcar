import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { refreshAccessToken, handleLogout } from 'common/Common';
import 'manager/system/posts/PostNotices.css';
import { store } from '../../../redux/store';
// import { store } from 'redux/store'; 왜 안될까?


const PostNotices = ({ onClick }) => {
  //공지사항
  const [notices, setNotices] = useState([]);
  const [totalNotices, setTotalNotices] = useState(0);
  //검색/페이징
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 10;
  // const [totalPages, setTotalPages] = useState(0);
  //컬럼
  const [columnNotices] = useState([
    { columnName: '코드', field: 'post_code', width: 100, align: 'center'},
    { columnName: '구분', field: 'post_type', width: 100, align: 'center'},
    { columnName: '제목', field: 'post_title', width: 500, align: 'left'},
    { columnName: '작성자', field: 'author', width: 150, align: 'center'},
    { columnName: '작성일', field: 'created_at', width: 150, align: 'center'},
    { columnName: '작업', field: '', width: 230, align: 'center'},
  ]);
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

  //공지사항 가져오기
  const pageingNotices = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetchNotices(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await fetchNotices(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const fetchNotices = async (token) => { 
    const params = {
      pageSize,
      pageNumber,
    };

    if(searchName && searchName.trim() !== "") {
      params.postName = searchName;
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/notices`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if(response.data) {
      setNotices(response.data);
    }
  }

  //상세 내용 가져오기
  const getByCodeNotices = async (code) => {
    try {
      const token = localStorage.getItem("accessToken");
      await getNotices(token, code);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getNotices(newToken, code);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const getNotices = async (token, code) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/notices/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    )
    if(response.data) {
      setPostCode(response.data.post_code);
      setPostTitle(response.data.post_title);
      setPostContent(response.data.post_content);
      setAuthorCode(response.data.author_code);
      setAuthorName(response.data.author);
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

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/notices/count`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    if(typeof response.data === "number") {
      setTotalNotices(response.data);
    } else {
      console.error('Unexpected response:', response.data);
    }
  }

  
  //어드민 code 가져오기
  const handleAdminCode = async () => {
    setAuthorCode(store.getState().adminState.adminCode)
  }

  //공지사항 생성/수정 기능 제어
  const handleSaveData = async (e) => {
    if(postTitle === "" || postContent === ""){
      alert("제목과 내용을 입력해세요");
      
    } else {
      const newPost = {
        post_code: postCode,
        post_type: postType,
        post_title: postTitle,
        post_content: postContent,
        author_code: authorCode,
        author_type: authorType,
        author: null,
        created_at: null,
        updated_at: null,
      }
      if(e === "추가") {
        postCreateNotice(newPost);
        setIsPopUp(false);
      } else if (e === "수정") {
        if(window.confirm('공지를 수정하시겠습니까?')) {
          postUpdateNotices(newPost, newPost.post_code);
          setIsPopUp(false);
        }
      }
    }

  }

  //공지사항 생성
  const postCreateNotice = async (newPost) => {
    try {
      const token = localStorage.getItem('accessToken');
      await createNotice(token, newPost);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await createNotice(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the menus pageing!', error);
      }
    }
  } 
  const createNotice = async (token, newPost) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/notices`,
      newPost,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    // console.log(response.data);
    pageingNotices();
    alert("공지사항이 등록되었습니다.");
    // setNotices((prevNotice)=>[...prevNotice, response.data])
  }

  //공지사항 수정
  const postUpdateNotices = async (newPost,code) => {
    try {
      const token = localStorage.getItem('accessToken');
      await updateNotices(token, newPost, code);
      
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await updateNotices(newToken, newPost, code);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the menus pageing!', error);
      }
    }

  }
  const updateNotices  = async (token,newPost,code) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/notices/${code}`,
      newPost,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    )
    pageingNotices();
    alert("수정되었습니다.")
  }

  
  //공지사항 삭제
  const postDeleteNotices = async (code) => {
    try {
      const token = localStorage.getItem('accessToken');
      await deleteNotices(token, code)
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const newToken = await refreshAccessToken();
        await deleteNotices(newToken, code)
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const deleteNotices = async (token, code) => {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/notices/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,  
      }
    )
    pageingNotices();
    alert("삭제되었습니다.");
  }

  //페이지 불러오기
  useEffect(()=>{
    pageingNotices();
    getTotalCount();
  }, [totalNotices, pageNumber])

  //검색
  const handleSearchClick = async () => {
    pageingNotices();
    getTotalCount();
    setPageNumber(0);
  }

  //생성/수정/보기 팝업창 제어
  const handlePopupClick = (e) =>{
    // console.log(arguments)

    if(e[0] === "추가") {
      handleCreateClick(e[0])
    } else if(e[0] === "보기") {
      handleReadClick(e[0], e[1])
    } else if(e[0] === "수정") {
      handleUpdateClick(e[0], e[1])
    }
  }
  //생성 팝업창
  const handleCreateClick = (e) => {
    setIsPopUp(true);
    setPopupType(e);
    setPostType("NT");
    setAuthorType("AM");
    setPostCode();
    setPostTitle("");
    setPostContent("");
    handleAdminCode(); //setAuthorCode()
  }
  //수정 팝업창
  const handleUpdateClick = (e,i) => {
    setIsPopUp(true);
    setPopupType(e);
    setAuthorType("AM");
    setPostType("NT");
    getByCodeNotices(i); //setPostTitle() setPostContent()
  }
  //보기 팝업창
  const handleReadClick = async (e,i) => {
    setIsPopUp(true);
    setPopupType(e);
    getByCodeNotices(i);
  }

  //삭제 기능
  const handleDeleteClick = (e) => {
    if (window.confirm('공지를 정말로 삭제하시겠습니까?')) {
      postDeleteNotices(e)
    }
  }
  //텍스트박스 크기조절
  let totalPages = Math.ceil(totalNotices / pageSize);
  if (totalPages < 1) { totalPages = 1; }
  if (totalNotices === 0) { totalPages = 0; }
  //페이지 뒤로
  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const textarea = useRef();
  const handleResizeHeight = (e) => {
    setPostContent(e.target.value);
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  }

  return (
    <div className='manager-post-notice-wrap'>
      <div className='manager-post-notice-header-wrap'>
        <div className='manager-post-notice-header-title'>
          <hr/>
            <h5 className='manager-post-notice-header-h5'> 공지사항 게시판 </h5>
          <hr/>
        </div>
      </div>

      <div className='manager-post-notice-table-wrap'>
        <div className='manager-post-notice-table-head'>
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="manager-post-serch">제목</label>
            <input id='manager-post-serch' className='width200' type="text" 
              onChange={(e)=>(setSearchName(e.target.value))} 
              onKeyDown={(e)=>{if(e.key === "Enter") {handleSearchClick()} }}></input>
            <button className='manager-button manager-button-search' onClick={()=>handleSearchClick()}> 검색 </button>
            <span> [ 검색건수 : {totalNotices}건 ] </span>
          </div>

          <div>
              <button className='manager-button manager-button-insert' onClick={()=> handlePopupClick(["추가"])}> 추가</button>
              <button className='manager-button manager-button-close' onClick={() => handleCloseClick()}> 닫기</button>
          </div>
        </div>

        <table className='manager-post-notice-table-body'>
          <thead>
            <tr>
              {columnNotices && (columnNotices.map((column,index)=>(
                  <th key={index} className='manager-post-notice-table-head-colmn' style={{ width: `${column.width}px`, textAlign: `center` }}>
                    {column.columnName}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
          {notices && (
            notices.map((notice, index)=>(
              <tr key={index}>
                {columnNotices && (columnNotices.map((column,index)=>(
                  <td key={index} className='manager-post-notice-table-row-colmn'
                    style={{width:`${column.width}`, textAlign:`${column.align}`}}
                  > 
                    {column.field === '' ? (<>
                      <button className='manager-button post-btn3' onClick={()=>handlePopupClick([ "보기", notice["post_code"] ])}> 보기 </button> 
                      <button className='manager-button post-btn2' onClick={()=>handlePopupClick([ "수정", notice["post_code"] ])}> 수정 </button> 
                      <button className='manager-button post-btn1' onClick={()=>handleDeleteClick(notice["post_code"])}> 삭제 </button> 
                    </>) : (
                      notice[column.field]
                    )}
                  </td>
                )))}
              </tr>
            ))
          )}
          </tbody>
        </table>
        {isPopUp && (
          <div className='manager-post-notice-popup'>
            {(popupType == "추가" || popupType == "수정") && (
              <div className='manager-post-notice-popup-wrap'>
                <div className='manager-post-notice-popup-header'>
                  <div className='manager-post-notice-popup-title'> <h6 className='manager-post-notice-h6'>공지사항 {popupType}</h6> </div>
                  <div className='manager-post-notice-popup-buttons'>
                    <button className='manager-button manager-post-notice-popup-save' onClick={()=>{handleSaveData(popupType)}}> {popupType} </button>
                    <button className='manager-button manager-post-notice-popup-close' onClick={()=>{setIsPopUp(!isPopUp)}}> 닫기 </button>
                  </div>
                </div>
                <div className='manager-post-notice-popup-line'>
                  <label className='manager-post-notice-popup-line-label'>제목</label>
                  <input className='width400' value={postTitle} onChange={(e)=>setPostTitle(e.target.value)}/>
                </div>
                <div className='manager-post-notice-popup-line'>
                  <label className='manager-post-notice-popup-line-label' style={{verticalAlign: 'top'}}>내용</label>
                  <textarea className='width400 manager-post-notice-popup-line-textarea' 
                  rows={2} ref={textarea} value={postContent} onChange={(e)=>{handleResizeHeight(e)}}/>
                </div>
                <div className='manager-post-notice-popup-line'>
                  <label className='manager-post-notice-popup-line-label'>게시물 코드</label>
                  <input className='width30 word-center' type="text" value={postCode} disabled/>
                </div>
                <div className='manager-post-notice-popup-line'>
                  <label className='manager-post-notice-popup-line-label'>게시물 유형</label>
                  <input className='width50 word-center' type="text" value={postType} disabled/>
                </div>
                <div className='manager-post-notice-popup-line'>
                  <label className='manager-post-notice-popup-line-label'>작성자</label>
                  <input className='width80 word-center' type="text" value={authorName +" "+ authorCode} disabled/>
                </div>
                <div className='manager-post-notice-popup-line'>
                  <label className='manager-post-notice-popup-line-label'>작성자 유형</label>
                  <input className='width50 word-center' type="text" value={authorType} disabled/>
                </div>
                {/* postCode postType postTitle postContent authorCode authorType postContent가 넘어갔을때 문제 */}
              </div>
            )}

            {/* 사용자 페이지랑 비슷하게 */}
            {popupType == "보기" && (
              <div className='manager-post-notice-popup-wrap manager-post-notice-popup-read'>
                <div className='manager-post-notice-popup-header'>
                  <div className='manager-post-notice-popup-title'> <h6 className='manager-post-notice-h6'> {postTitle}</h6> </div>
                  <div className='manager-post-notice-popup-buttons'>
                    <div className='manager-post-notice-popup-author'> 작성자 : {authorName} </div>
                    <button className='manager-button manager-post-notice-popup-close' onClick={()=>{setIsPopUp(!isPopUp)}}> 닫기 </button>
                  </div>
                </div>
                <hr/>
                <div className='manager-post-notice-popup-line manager-post-notice-popup-content'>
                  {postContent}
                </div>
              </div>
            )}

          </div>
        )}
        <div className='manager-post-notice-table-paging flex-align-center'>
          <button className='manager-button' onClick={()=>setPageNumber(pageNumber - 1)}
            style={{color: pageNumber === 0 ? '#aaa' : '#26319b'}}
            disabled={pageNumber === 0}
          >이전</button>
          <div className='manager-post-notice-table-paging-page'>{(pageNumber+1)} / {totalPages}</div>
          <button className='manager-button' onClick={()=>setPageNumber(pageNumber + 1)}
            style={{color: (pageNumber + 1) >= totalPages ? '#aaa' : '#26319b'}}
            disabled={ (pageNumber + 1) >= totalPages }
          >다음 </button>
        </div>
        
      </div>

    </div>
  );
}

export default PostNotices;

