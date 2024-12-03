import { useParams } from "react-router-dom";
import "./Notices.css"
import axios from "axios";
import { useEffect, useState } from "react";

const Notices = () => {
  const params = useParams().postId;

  const [notices, setNotices] = useState();

  const detailNotices = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/customers/notices/${params}`);
      
      if (response.data) {
        setNotices(response.data);
      }
    } catch (error) {
      console.error('There was an error fetching the movies!', error);
    }
  }

  useEffect(()=>{
    detailNotices();
  },[])

  return(
    <div className="user-customers-detail">
      <div className="user-customers-header">
        <h3 className="user-customers-header-h3">
          공지사항
        </h3>
      </div>
      <div className="user-customers-wrap">
        <div className="user-customers-detail-notices">
          <div className="user-customers-detail-notices-header">
            <div className="user-customers-detail-notices-title">
              <h4>
                {notices && (<>
                  {notices.post_title}
                </>)}
              </h4>
            </div>
            <div className="user-customers-detail-notices-author">
              <div>
                {notices && (<>
                  {notices.author}
                </>)}
              </div>
              <div>
                {notices && (<>
                  {notices.created_at}
                </>)}
              </div>
            </div>
          </div>
          <hr/>
          <div className="user-customers-detail-notices-content">
            {notices && (<>
              {notices.post_content}
            </>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notices;