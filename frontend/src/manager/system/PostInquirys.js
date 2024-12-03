import { useEffect, useRef, useState } from "react";
import "./PostInquirys.css"
import axios from "axios";
import { refreshAccessToken, handleLogout } from 'common/Common';
import { store } from '../../redux/store';
import Loading from 'common/Loading';


const PostInquirys = ({ onClick }) => {
  const [loading, setLoading] = useState(false);

  const [inquirys, setInquirys] = useState([])
  //팝업창
  const [isPopUp, setIsPopUp] = useState(false);
  const [popupType, setPopupType] = useState()
  //컬럼
  const [columnInquirys] = useState([
    { columnName: '코드', field: 'post_code', width: 100, align: 'center'},
    { columnName: '구분', field: 'post_type', width: 100, align: 'center'},
    { columnName: '제목', field: 'post_title', width: 400, align: 'left'},
    { columnName: '작성자', field: 'author', width: 150, align: 'center'},
    { columnName: '작성일', field: 'created_at', width: 150, align: 'center'},
    { columnName: '답변여부', field: 'inquiry_status', width: 100, align: 'center'},
    { columnName: '작업', field: '', width: 230, align: 'center'},
  ]);

  // 상세내용
  const [postCode,setPostCode] = useState();
  const [responseCode,setResponseCode] = useState();
  const [postTitle,setPostTitle] = useState("");
  const [postContent,setPostContent] = useState("");
  const [authorCode,setAuthorCode] = useState();
  const [authorType,setAuthorType] = useState();
  const [authorName,setAuthorName] = useState();
  //답변
  const [responses,setResponses] = useState([]);
  const [createContent,setCreateContent] = useState("");

  const postGetInquirys = async () =>{
    try {
      const token = localStorage.getItem('accessToken');
      await getInquirys(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getInquirys(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const getInquirys = async (token)=>{
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/inquirys`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if(response.data) {
      setInquirys(response.data);
    }
  }

  const postGetCodeInquiry = async (code) =>{
    try {
      const token = localStorage.getItem('accessToken');
      await getInquiry(token,code);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getInquiry(newToken,code);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const getInquiry = async (token,code)=>{
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/inquirys/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if(response.data) {
      setPostCode(response.data.post_code);
      setResponseCode(response.data.response_code);
      setPostTitle(response.data.post_title);
      setPostContent(response.data.post_content);
      setAuthorType(response.data.author_type);
      setAuthorName(response.data.author);
    }
  }

  const postGetResponses = async (code) =>{
    try {
      const token = localStorage.getItem('accessToken');
      await getResponses(token,code);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getResponses(newToken,code);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const getResponses = async (token,code)=>{
    
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/responses/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if(response.data) {
      setResponses(response.data);
    }
  }

  const postUpdateResponses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await updateResponses(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await updateResponses(newToken);
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
  const updateResponses = async (token) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/responses`,
      responses,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
  }

  const postCreateResponses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await createResponses(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await createResponses(newToken);
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
  const createResponses = async (token) => {
    const newResponses = {
      response_content:null,
      post_code: postCode,
      response_content: createContent,
      author_code: authorCode,
      author_type: authorType,
      author: null,
      created_at: null,
      updated_at: null,
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/responses`,
      newResponses,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    )
    alert("답변이 작성되었습니다.");
  }

  const postDeleteResponses = async (code) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      await deleteResponses(token,code);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await deleteResponses(newToken,code);
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
  const deleteResponses = async (token, code) => {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/responses/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    )
    alert("답변이 삭제되었습니다.");
  }

  //manager/post/responses/{postCode}
  
  useEffect(()=>{
    postGetInquirys();
    handleAdminCode();
  },[])

  const handleAdminCode = async () => {
    setAuthorCode(store.getState().adminState.adminCode);
    setAuthorName(store.getState().adminState.adminName);
  }

  //페이지 뒤로
  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleAnswer = (i) => {
    setCreateContent("");
    postGetCodeInquiry(i);
    postGetResponses(i);
    setIsPopUp(true);
  }

  const handleUpdate = () => {
    postUpdateResponses();
  }

  const handleDelete = (code) => {
    postDeleteResponses(code).then(function (value) {
      //성공했을 때 실행
      postGetResponses(postCode);
    }, function (reason) {
      //실패했을 때 실행
      alert("삭제에 실패했습니다.")
    });
  }

  const handleCreate = () => {
    postCreateResponses().then(function (value) {
      //성공했을 때 실행
      postGetResponses(postCode);
    }, function (reason) {
      //실패했을 때 실행
      alert("작성의 실패했습니다.")
    });

  }

  const textarea = useRef([]);
  const handleResizeHeight = (e,i) => {
    const copy = [...responses]
    copy[i].response_content = e.target.value;
    setResponses(copy)
    
    // setPostContent(e.target.value);
    for (let index = 0; index < textarea.current.length; index++) {
      if(textarea.current[index]) {
        textarea.current[index].style.height = "auto";
        textarea.current[index].style.height = textarea.current[index].scrollHeight + "px";
      }
    }

  }
  const handleCreateResizeHeight = (e) => {
    setCreateContent(e.target.value);

    for (let index = 0; index < textarea.current.length; index++) {
      if(textarea.current[index]) {
        textarea.current[index].style.height = "auto";
        textarea.current[index].style.height = textarea.current[index].scrollHeight + "px";
      }
    }
  }

  return(
    <div className='manager-post-inquirys-wrap'>
      <div className='manager-post-inquirys-header-wrap'>
        <div className='manager-post-inquirys-header-title'>
          <h5 className='manager-post-inquirys-header-h5'> 고객문의 게시판 </h5>
        </div>
      </div>

      <div className='manager-post-inquirys-table-wrap'>
        <div className='manager-post-inquirys-table-head'>
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="manager-post-serch">제목</label>
            <input id='manager-post-serch' className='width200' type="text"></input>
            <button className='manager-button manager-button-search' onClick={()=>{}}> 검색 </button>
            <span> [ 검색건수 : {1}건 ] </span>
          </div>

          <div>
              {/* <button className='manager-button manager-button-insert' onClick={()=>{}}> 추가</button> */}
              <button className='manager-button manager-button-close' onClick={()=>handleCloseClick()}> 닫기</button>
          </div>
        </div>

        <table className='manager-post-inquirys-table-body'>
          <thead>
            <tr>
              {columnInquirys && (columnInquirys.map((column,index)=>(
                  <th key={index} className='manager-post-inquirys-table-head-colmn' style={{ width: `${column.width}px`, textAlign: `center` }}>
                    {column.columnName}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
          {inquirys && (
            inquirys.map((inquiry, index)=>(
              <tr key={index}>
                {columnInquirys && (columnInquirys.map((column,index)=>(
                  <td key={index} className='manager-post-inquirys-table-row-colmn'
                    style={{width:`${column.width}`, textAlign:`${column.align}`}}
                  > 
                    {column.field === '' ? (<>
                      {/* <button className='manager-button post-btn3' > 보기 </button>  */}
                      <button className='manager-button post-btn2' onClick={()=>handleAnswer(inquiry["post_code"])}> 답변 </button> 
                      <button className='manager-button post-btn1' onClick={()=>console.log(inquiry["post_code"])}> 삭제 </button> 
                    </>) : (
                      inquiry[column.field]
                    )}
                  </td>
                )))}
              </tr>
            ))
          )}
          </tbody>
        </table>
        {isPopUp && (
          <div className='manager-post-inquirys-popup'>
            <div className='manager-post-inquirys-popup-wrap'>
              <div className='manager-post-inquirys-popup-header'>
                <div className='manager-post-inquirys-popup-title'> <h6 className='manager-post-inquirys-h6'> 문의사항 </h6> </div>
                <div className='manager-post-inquirys-popup-buttons'>
                  <button className='manager-button manager-post-inquirys-popup-save' onClick={()=>handleUpdate()}> 수정 </button>
                  <button className='manager-button manager-post-inquirys-popup-close' onClick={()=>{setIsPopUp(!isPopUp)}}> 닫기 </button>
                </div>
              </div>
              <hr/>
              <div className='manager-post-inquirys-popup-line'>
                <div className="manager-post-inquirys-popup-line-header">
                  <div className="manager-post-inquirys-popup-line-header-title">
                    {postTitle}
                  </div>
                  <div className="manager-post-inquirys-popup-line-header-author">
                    작성자 : {authorName}
                  </div>
                </div>
                <div className="manager-post-inquirys-popup-line-body">
                  {postContent}
                </div>
              </div>
              {responses && (
                responses.map((response, index)=>(
                <div key={index}>
                <hr/>
                <div className='manager-post-inquirys-popup-line'>
                  <div className="manager-post-inquirys-popup-line-header">
                    <div className="manager-post-inquirys-popup-line-header-title">
                      {response.author_type === "US" ? (<>작성자</>) : (<>관리자</>)} : {response.author}
                    </div>
                    <div className="manager-post-inquirys-popup-line-header-author">
                      {response.created_at} 
                      {response.author_type === "AM" && (
                        <>
                          &nbsp;
                          <button onClick={()=>handleDelete(response.response_code)} style={{backgroundColor:'#ee0a0a',color:"#ededf0", padding:"0px 4px"}}> 삭제 </button>
                        </> 
                      )}
                    </div>
                  </div>
                  <div className="manager-post-inquirys-popup-line-body">
                    {response.author_type === "AM" ? (
                      <textarea className='manager-post-inquirys-popup-line-textarea' 
                      rows={2} ref={el => (textarea.current[index+1] = el)} value={response.response_content} onChange={(e)=>{handleResizeHeight(e,index)}}/> 
                    ) : (
                      <>
                        {response.response_content}
                      </>
                    )}
                  </div>
                </div>
                </div>
                ))
              )}
              <div className="manager-post-inquirys-popup-answer">
                <h6 className="manager-post-inquirys-popup-answer-h6"> 답변 </h6>
                <textarea className='manager-post-inquirys-popup-line-textarea' 
                rows={2} ref={el => (textarea.current[0] = el)} value={createContent} onChange={(e)=>{handleCreateResizeHeight(e)}}/> 
                <button className="manager-button post-btn2" onClick={()=>handleCreate()}>작성</button>
              </div>
              {/* postCode postType postTitle postContent authorCode authorType postContent가 넘어갔을때 문제 */}
            </div>
          </div>
        )}
      </div>
      {loading && (
        <Loading />
      )}
    </div>
  )
}

export default PostInquirys;