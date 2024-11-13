import React, { useState } from "react";
import './ManagerReservation.css';

const ManagerReservation = () => {
  // 모달 열기/닫기 상태와 데이터 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  // 모달 열기 함수
  const openModal = (data) => {
    console.log("data : ", data);
    setModalData(data);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="container">
        {/* 왼쪽 네비게이션 영역 */}
        {/* <nav className="sidebar">
          <h3>관리자 nav</h3>
          <p>1</p>
          <p>2</p>
          <p>3</p>
        </nav> */}

        {/* 오른쪽 메인 콘텐츠 영역 */}
        <div className="main-content">
          <header>
            <h2>예약현황</h2>
          </header>
          <div className="filter">
            <span>
              <select name="options">
                <option value="option1">지점명</option>
                <option value="option2">지점 1</option>
                <option value="option3">지점 2</option>
                <option value="option4">지점 3</option>
              </select>
            </span>
            <span>
              <input type="text" placeholder="예약자 성함" name="username" />
              <button type="submit" className="gray-button">
                조회
              </button>
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>예약코드</th>
                <th>고객명</th>
                <th>지점명</th>
                <th>차량번호</th>
                <th>차량명</th>
                <th>대여일</th>
                <th>반납일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* 예약 정보 표 행 */}
              <tr>
                <td>R12345</td>
                <td>김철수</td>
                <td>지점 1</td>
                <td>123가4567</td>
                <td>쏘나타</td>
                <td>2024-11-01</td>
                <td>2024-11-10</td>
                <td>
                  <button
                    className="gray-button"
                    onClick={() => openModal({
                      code: 'R12345',
                      name: '김철수',
                      branch: '지점 1',
                      carNumber: '123가4567',
                      carName: '쏘나타',
                      rentalDate: '2024-11-01',
                      returnDate: '2024-11-10'
                    })}
                  >
                    상세
                  </button>
                </td>
              </tr>
              <tr>
                <td>R67890</td>
                <td>이영희</td>
                <td>지점 2</td>
                <td>456나7890</td>
                <td>아반떼</td>
                <td>2024-11-05</td>
                <td>2024-11-15</td>
                <td>
                  <button
                    className="gray-button"
                    onClick={() => openModal({
                      code: 'R67890',
                      name: '이영희',
                      branch: '지점 2',
                      carNumber: '456나7890',
                      carName: '아반떼',
                      rentalDate: '2024-11-05',
                      returnDate: '2024-11-15'
                    })}
                  >
                    상세
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        // <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={closeModal}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>상세 정보</h3>
            <div className="info-box">
              <p>
                <strong>고객명:</strong> <span>{modalData.name}</span>
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>지점명:</strong> <span>{modalData.branch}</span>
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>차량번호:</strong> <span>{modalData.carNumber}</span>
              </p>
              <p>
                <strong>차량명:</strong> <span>{modalData.carName}</span>
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>대여일:</strong> <span>{modalData.rentalDate}</span>
              </p>
              <p>
                <strong>반납일:</strong> <span>{modalData.returnDate}</span>
              </p>
            </div>
            <div className="btm-btn">
              <button type="button" className="gray-button" id="left-btn">
                예약취소
              </button>
              <button type="button" className="gray-button" id="right-btn">
                반납
              </button>
            </div>
          </div>
        // </div>
      )}
    </div>
  );
};

export default ManagerReservation;
