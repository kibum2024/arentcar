import { useState } from "react";
import "manager/system/posts/ReviewPopup.css";

const ReviewPopup = ( { colse } ) => {
  const [user, setUser] = useState("김");


  const handleColse = () => {
    console.log(colse);
    if(colse){
      colse();
    }
  }
  return (
    <div className="user-review-popup">
      <div className="user-review-popup-wrap">
        <div className="user-review-popup-line">
          <div className="user-review-popup-title">{user}님 후기</div>
        </div>
        <div className="user-review-popup-line">
          <div className="user-review-popup-score">
            ★☆☆☆☆
          </div>
        </div>
        <div className="user-review-popup-line">
          <textarea className="user-review-popup-content"/>
        </div>
        <div className="user-review-popup-line">
          <button>작성</button> 
        </div>
        
      </div>
      <button onClick={()=>handleColse()}>닫기</button>
    </div>
  )
}

export default ReviewPopup;
