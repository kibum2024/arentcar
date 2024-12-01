import React, { useState, useEffect, useRef } from 'react';
import 'user/content/RentalRateGuide.css';

const RentalRateGuide = () => {
  const rentalQqualificationRef = useRef(null);
  const feeGuideRef = useRef(null);
  const additionalFeeRef = useRef(null);
  const rentalProcessRef = useRef(null);
  const returnProcessRef = useRef(null);
  const insuranceRewardRef = useRef(null);
  const damageExemptionRef = useRef(null);
  const etcInfoRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsSticky(currentScrollY > 159);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);


  const handleImageClick = (position) => {
    setActiveMenu(position);

    const refs = {
      "rental-qualification": rentalQqualificationRef,
      "fee-guide": feeGuideRef,
      "additional-fee": additionalFeeRef,
      "rental-process": rentalProcessRef,
      "return-process": returnProcessRef,
      "insurance-reward": insuranceRewardRef,
      "damage-exemption": damageExemptionRef,
      "etc-info": etcInfoRef,
    };

    const offset = isSticky ? 159 : 360; // 고정 헤더의 높이에 따라 오프셋 계산
    const targetRef = refs[position];

    if (targetRef && targetRef.current) {
      const elementTop = targetRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='rental-rate-guide-wrap'>
      <div className='rental-rate-guide-title-wrap'>
        <div className='rental-rate-guide-title'>대여 및 요금안내</div>
        <div className='rental-rate-guide-sub-title'>업계최초 고객만족도 3관왕! 변함없는 1위의 A렌터카의 서비스를 경험하세요!</div>
      </div>
      <div className={`rental-rate-guide-menu-wrap ${isSticky ? 'sticky' : ''}`}>
        <div
          className={`rental-rate-guide-sub-menu ${activeMenu === "rental-qualification" ? 'active' : ''}`}
          onClick={() => handleImageClick("rental-qualification")}
        >          
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel01.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>대여 자격</div>
        </div>
        <div
        className={`rental-rate-guide-sub-menu ${activeMenu === "fee-guide" ? 'active' : ''}`}
        onClick={() => handleImageClick("fee-guide")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel02.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>요금 안내</div>
        </div>
        <div
        className={`rental-rate-guide-sub-menu ${activeMenu === "additional-fee" ? 'active' : ''}`}
        onClick={() => handleImageClick("additional-fee")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel03.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>추가 요금</div>
        </div>
        <div
        className={`rental-rate-guide-sub-menu ${activeMenu === "rental-process" ? 'active' : ''}`}
        onClick={() => handleImageClick("rental-process")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel04.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>대여 절차</div>
        </div>
        <div
        className={`rental-rate-guide-sub-menu ${activeMenu === "return-process" ? 'active' : ''}`}
        onClick={() => handleImageClick("return-process")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel05.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>반납 절차</div>
        </div>
        <div
        className={`rental-rate-guide-sub-menu ${activeMenu === "insurance-reward" ? 'active' : ''}`}
        onClick={() => handleImageClick("insurance-reward")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel06.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>보험 및 보상</div>
        </div>
        <div
          className={`rental-rate-guide-sub-menu ${activeMenu === "damage-exemption" ? 'active' : ''}`}
          onClick={() => handleImageClick("damage-exemption")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel07.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>자차손해면책제도</div>
        </div>
        <div
        className={`rental-rate-guide-sub-menu ${activeMenu === "etc-info" ? 'active' : ''}`}
        onClick={() => handleImageClick("etc-info")}
        >
          <div className='rental-rate-guide-sub-menu-img-wrap'>
            <img className='rental-rate-guide-sub-menu-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-pannel08.png`} alt="" />
          </div>
          <div className='rental-rate-guide-sub-menu-title'>기타 안내</div>
        </div>
      </div>
      {/* 대여자격 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={rentalQqualificationRef}>
        <div className='rental-rate-guide-menu-title'>대여 자격</div>
        <div className="rental-rate-guide-menu-rental-qualification-content">
          <p className="txt">도로교통법상 유효한 운전면허증을 소지하여야 대여가 가능하며, 1종 면허의 경우 적성기간 경과 후 1년이 지나면 운전면허 취소로 대여가 불가합니다.</p>
          <div className="rental-rate-guide-menu-rental-qualification-content-box">
            <table>
              <thead>
                <tr>
                  <th>차량 유형</th>
                  <th>9인승 이하</th>
                  <th>11~12인승</th>
                  <th>15인승</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>면허 종류</th>
                  <td>2종 보통 이상</td>
                  <td>1종 보통 이상</td>
                  <td>1종 보통 이상</td>
                </tr>
                <tr>
                  <th>운전자 연령</th>
                  <td>만 21세 이상 ~ 만 80세 미만 (대여일 기준)</td>
                  <td>만 21세 이상 ~ 만 80세 미만 (대여일 기준)</td>
                  <td>만26세 이상 ~ 만 80세 미만 (대여일 기준)</td>
                </tr>
                <tr>
                  <th>취득 후 기간</th>
                  <td>면허 취득일로부터 1년 이상 경과</td>
                  <td>면허 취득일로부터 1년 이상 경과</td>
                  <td>면허 취득일로부터 1년 이상 경과</td>
                </tr>
              </tbody>
            </table>
            <ul className="lst dot">
              <li>A렌터카는 [여객자동차 운수사업법 시행규칙 제 67조]에 의거 15인승 이하 차량만 대여가 가능합니다.</li>
              <li>운전면허증에 원동기가 함께 기재되어 있는 경우 운전경력증명서를 지참하셔야 차량대여가 가능합니다.</li>
              <li>대여 시 반드시 예약자 본인의 운전면허증을 지참하셔야 합니다. (정보가 지점 대여 시 상이할 경우, 예약이 취소되거나 추가 확인이 필요할 수 있습니다.)</li>
              <li>국제운전면허증 소지자의 경우, 입국일을 증명할 수 있도록 여권을 지참해주시길 바랍니다.</li>
              <li>만 21세 이상 나이는 생년월일이 지나야 인정됩니다.</li>
            </ul>
          </div>
        </div>
      </div>
      {/* 요금안내 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={feeGuideRef}>
        <div className='rental-rate-guide-menu-title'>요금 안내</div>
      </div>
      {/* 추가요금 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={additionalFeeRef}>
        <div className='rental-rate-guide-menu-title'>추가 요금</div>
        <div className="rental-rate-guide-additional-fee-content-wrap">
          <ul className="rental-rate-guide-additional-fee-content">
            <li>
              <div className="rental-rate-guide-additional-fee-img-wrap">
                <img className='rental-rate-guide-additional-fee-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-fee01.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="tit">휴차 보상료</dt>
                <dd>
                  차량대여 중 발생한 자차사고(임차인 가해사고)로 인해&nbsp;차량의 수리가 필요한 경우, 차량수리 기간동안 차량에 발생한 영업손실에
                  대해<br />
                  차량수리비 이외 표준대여료의 50% 휴차보상료가 고객 부담입니다.
                </dd>
              </dl>
            </li>
            <li>
              <div className="rental-rate-guide-additional-fee-img-wrap">
                <img className='rental-rate-guide-additional-fee-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-fee02.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="tit">차량 수리비</dt>
                <dd>
                  차량대여 중 렌터카의 손망실이 발생한 경우의 (임차인 과실사고 및 가해자 불명의 자차사고) 렌터카 수리비는 고객 부담이며 렌터카 수리 시<br />
                  특별한 사유를 제외하고 A렌터카와 협의를 거쳐 정해진 곳에서 수리를 해야 합니다.
                </dd>
              </dl>
            </li>
            <li>
              <div className="rental-rate-guide-additional-fee-img-wrap">
                <img className='rental-rate-guide-additional-fee-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-fee03.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="tit">교통법규 위반 범칙금</dt>
                <dd>
                  차량 대여 중 도로교통법 위반으로 발생한 모든 범칙금은 고객 부담.(주정차 위반, 버스전용차선위반, 안전벨트 미착용 등)이며, 도로교통법 위반에
                  <br />
                  따른 사고의 경우 보험보상의 일부 혜택을 받지 못 할 수도 있습니다.
                </dd>
              </dl>
            </li>
            <li>
              <div className="rental-rate-guide-additional-fee-img-wrap">
                <img className='rental-rate-guide-additional-fee-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-fee04.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="tit">차량 유류비</dt>
                <dd>
                  모든 차량은 Full-Tank(연료를 가득 채운 상태) 에서 대여해 드리며 반납시에도 Full-Tank 상태로 반납을 해야 합니다. <br />
                  연료가 가득 채워지지 않았을 경우에는 가득 주유 시 예상되는 금액으로 주유 비용을 정산해야 합니다.
                  <ul className="lst dot">
                    <li>실비정산시, 지점 내 데스크에 비치된 유류정산 기준표 참고</li>
                  </ul>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
      {/* 대여절차 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={rentalProcessRef}>
        <div className='rental-rate-guide-menu-title'>대여 절차</div>
        <div className="rental-rate-guide-rental-process-content-wrap">
          <ul className="rental-rate-guide-rental-process-content">
            <li>
              <div className="rental-rate-guide-rental-process-img-wrap">
                <img className='rental-rate-guide-rental-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step01.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">1. 지점 방문</p>
              <p className="txt">
                직원에게 예약번호 또는 <br />
                예약자 성명을 말씀해주세요.<br />
                (외국인일 경우 여권 및 국제면허증 지참)
              </p>
            </li>
            <li>
              <div className="rental-rate-guide-rental-process-img-wrap">
                <img className='rental-rate-guide-rental-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step02.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">2. 고객 정보 확인</p>
              <p className="rental-rate-guide-rental-process-detail-txt">
                예약사항을 확인 후, <br />
                차량임대차 계약서 작성을 위해<br />
                면허증을 담당직원에게 제시해 주세요.
              </p>
            </li>
            <li>
              <div className="rental-rate-guide-rental-process-img-wrap">
                <img className='rental-rate-guide-rental-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step03.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">3. 대여료 결제</p>
              <p className="rental-rate-guide-rental-process-detail-txt">
                대여기간 및 차종, 옵션 등 <br />
                최종 확인한 후<br />
                차량 대여료를 결제해주세요.
              </p>
            </li>
            <li>
              <div className="rental-rate-guide-rental-process-img-wrap">
                <img className='rental-rate-guide-rental-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step04.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">4. 차량 확인 및 계약서 작성</p>
              <p className="rental-rate-guide-rental-process-detail-txt">
                직원을 따라 주차장으로 이동하신 후 <br />
                차량 상태를 확인하시고<br />
                차량 임대차 계약서에 서명해주세요.
              </p>
            </li>
          </ul>
        </div>
      </div>
      {/* 반납절차 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={returnProcessRef}>
        <div className='rental-rate-guide-menu-title'>반납 절차</div>
        <div className="rental-rate-guide-return-process-content-wrap">
          <ul className="rental-rate-guide-return-process-content">
            <li>
              <div className="rental-rate-guide-return-process-img-wrap">
                <img className='rental-rate-guide-return-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step01.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">1. 지점 방문</p>
              <p className="rental-rate-guide-return-process-detail-txt">
                반납지점 주차장에 차량을 주차하고 <br />
                시동을 완전히 끈 후 차량 Key 와 <br />
                소지품을 챙겨 지점 사무실로 들어갑니다.
              </p>
            </li>
            <li>
              <div className="rental-rate-guide-return-process-img-wrap">
                <img className='rental-rate-guide-return-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step05.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">2. 자동차 키 반납</p>
              <p className="rental-rate-guide-return-process-detail-txt">
                담당직원에게 <br />
                차량 Key를 반납하세요.
              </p>
            </li>
            <li>
              <div className="rental-rate-guide-return-process-img-wrap">
                <img className='rental-rate-guide-return-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step06.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">3. 차량 확인</p>
              <p className="rental-rate-guide-return-process-detail-txt">
                담당직원과 함께 차량이 주차된 곳으로 <br />
                이동하여 차량 상태, <br />
                유류상태 등을 확인해 주세요.
              </p>
            </li>
            <li>
              <div className="rental-rate-guide-return-process-img-wrap">
                <img className='rental-rate-guide-return-process-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-purchase-step03.png`} alt="" />
              </div>
              <p className="rental-rate-guide-txt">4. 추가 비용 정산</p>
              <p className="rental-rate-guide-return-process-detail-txt">
                반납시간 초과, 차량의 손망실, <br />
                유류비, 범칙금 등 추가금이 <br />
                발생한 경우 추가비용을 정산해주세요.
              </p>
            </li>
          </ul>
        </div>
      </div>
      {/* 보험 및 보상 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={insuranceRewardRef}>
        <div className='rental-rate-guide-menu-title'>보험 및 보상</div>
        <div className="rental-rate-guide-insurance-reward-content-wrap">
          <p className="rental-rate-guide-insurance-reward-content-title">차량 사고 시 보험 및 보상범위</p>
          <p className="rental-rate-guide-insurance-reward-content-txt">A렌터카의 모든 차량은 차량 이용 중 사고가 발생하였을 때 아래의 보험 보상범위 내에서 고객님을 보호하기 위해 최선을 다하겠습니다.</p>
          <div className="rental-rate-guide-insurance-reward-content-box">
            <table>
              <thead>
                <tr>
                  <th>대인</th>
                  <th className="align-l">무한</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>대물</th>
                  <td className="align-l">사고 건당 2천만원</td>
                </tr>
                <tr>
                  <th>자손</th>
                  <td className="align-l">개인당 1천5백만원 (*계약서상 등록되지 않은 운전자는 종합보험 혜택 불가)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* 자차 손해 면책제도(CDW) */}
      <div className='rental-rate-guide-menu-title-wrap' ref={damageExemptionRef}>
        <div className='rental-rate-guide-menu-title'>자차 손해 면책제도(CDW)</div>
        <div className="rental-rate-guide-damage-exemption-content-wrap">
          <p className="rental-rate-guide-damage-exemption-content-txt">
            차량대여 중 귀책사유로 인하여 발생하는 모든 차량손해(손, 망실)는 고객님의 책임이 발생하며, 자차손해 면책제도(CDW)에 가입하신 경우 고객의 실수로 발생한
            자차사고에 대한 보호를
            받으실 수가 있습니다.
          </p>

          <dl className="define-area">
            <dt>면책금 안내</dt>
            <dd>
              <p className="rental-rate-guide-damage-exemption-content-txt">
                CDW 면책금액에 따라 차량손해의 액수에 상관없이 사고로 인한 파손 부위 1건당 10만원~30만원만 지불하시면 차량손해에 대한 책임을 보호 받을 수
                있습니다.<br />
                (고객부담금 면제 상품 가입 시에는 차량손해 액수에 상관없이 고객부담금이 없습니다.)
              </p>
              <div className="rental-rate-guide-damage-exemption-content-box">
                <table>
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>국산차량</th>
                      <th>수입차량</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>내륙</th>
                      <td>고객부담금 면제 / 10만원 / 30만원</td>
                      <td rowspan="2">30만원 (단일 면책금 제도 운영)</td>
                    </tr>
                    <tr>
                      <th>제주</th>
                      <td>
                        고객부담금 면제 / 30만원
                      </td>
                    </tr>
                  </tbody>
                </table>

                <ul className="lst dot">
                  <li>자차손해 면책제도의 면책금 가입 종류에 따라 가입 요금이 다릅니다.</li>
                </ul>
              </div>
            </dd>
            <dt>차량 수리비</dt>
            <p className="rental-rate-guide-damage-exemption-content-txt">
              차량대여 중 발생하는 귀책사유로 인한 당사 차량손해(손, 망실)는 고객님께서 차량 수리비를 지불하셔야 합니다.<br />
              자차손해 면책제도(CDW )를 가입한 경우 차량수리비가 면책금 종류에 따라 가입된 면책금 미만인 경우에는 실비정산을 하며, <br />
              가입된 면책금 이상인 경우 각각 가입 하신 최고의 면책금만 지불하시면 됩니다.
            </p>
            <dt>휴차보상료</dt>
            <dd>
              <p className="rental-rate-guide-damage-exemption-content-txt">
                자차손해 면책제도 가입 유무와 관계없이 사고로 인하여 차량이 휴차 할 경우에는 차량 운영의 차질로 인하여 발생한 수리기간 동안<br />
                대여차량 정상요금의 50%에 해당하는 휴차보상료가 청구됩니다.
              </p>
              <div className="rental-rate-guide-damage-exemption-content-box">
                <table>
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>국산차량</th>
                      <th>수입차량</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>청구기준</th>
                      <td>
                        차량 잔존가 대비 50% 이상의 파손 발생 시 청구<br />
                        (CDW 가입여부 무관)
                      </td>
                      <td>
                        차량 파손 시 수리기간 동안<br />
                        발생하는 영업손실금 청구
                      </td>
                    </tr>
                    <tr>
                      <th>청구금액</th>
                      <td colspan="2">
                        (사고 건당 수리일) X (대여차량 1일 대여요금 50% 할인금액)
                      </td>
                    </tr>
                  </tbody>
                </table>
                <ul className="lst dot">
                  <li>자차손해 면책제도의 면책금 가입 종류에 따라 가입 요금이 다릅니다.</li>
                </ul>
              </div>
            </dd>
          </dl>
        </div>
      </div>
      {/* 기타 안내 */}
      <div className='rental-rate-guide-menu-title-wrap' ref={etcInfoRef}>
        <div className='rental-rate-guide-menu-title'>기타 안내</div>
        <div className="rental-rate-guide-etc-info-content-wrap">
          <ul className="rental-rate-guide-etc-info-content">
            <li>
              <div className="rental-rate-guide-etc-info-img-wrap">
                <img className='rental-rate-guide-etc-info-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-etc-info01.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="rental-rate-guide-txt">교통 법규</dt>
                <dd>
                  <ul className="lst dot">
                    <li>임차인 및 운전자는 교통법규 위반 시 제반사항은 임차인 본인의 책임입니다.</li>
                    <li>도로교통법 위반 시 보험보상의 일부 혜택을 받지 못할 수도 있습니다.</li>
                  </ul>
                </dd>
              </dl>
            </li>
            <li>
              <div className="rental-rate-guide-etc-info-img-wrap">
                <img className='rental-rate-guide-etc-info-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-etc-info02.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="rental-rate-guide-txt">연료 및 주행거리</dt>
                <dd>
                  <ul className="lst dot">
                    <li>유류비는 임차인 본인의 부담입니다.</li>
                    <li>모든 차량은 대여 시 Full-Tank 서비스를 제공중이기 때문에 출발시와 동일하게 Full-Tank로 반납하여야 합니다.
                    </li>
                    <li>주행거리에는 제한이 없습니다.</li>
                  </ul>
                </dd>
              </dl>
            </li>
            <li>
              <div className="rental-rate-guide-etc-info-img-wrap">
                <img className='rental-rate-guide-etc-info-img' src={`${process.env.REACT_APP_IMAGE_URL}/ico-etc-info03.png`} alt="" />
              </div>
              <dl className="descri-box">
                <dt className="rental-rate-guide-txt">계약 연장</dt>
                <dd>
                  <ul className="lst dot">
                    <li>대여 중 부득이하게 계약 연장 필요 시, 사전에 대여지점의 동의를 받아야 합니다 .</li>
                    <li>연장 시, 초과요금은 임차인이 부담하여야 합니다.</li>
                    <li>사전 동의 없이 연장 사용기간 중 발생한 차량손해에 대해서는 보험 및 보상의 혜택을 받지 못할 수도 있습니다.</li>
                  </ul>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RentalRateGuide;