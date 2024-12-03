import React from "react";
import { motion } from "framer-motion";
import "./Profile.css"; // CSS 파일 경로를 업데이트하세요.

const profiles1 = [
  { id: 1, name: "양무리", description: "프로젝트 팀장 & 차종 / 차량관리 개발자", image: "k2.jpg" },
  { id: 2, name: "김주석", description: "예약관리 개발자", image: "k3.jpg" },
  { id: 3, name: "김다래", description: "예약/마이페이지 개발자", image: "y1.jpg" },
  { id: 4, name: "강미라", description: "결제관리 개발자", image: "y2.jpg" },
];

const profiles2 = [
  { id: 5, name: "민지환", description: "고객지원 개발자", image: "k4.jpg" },
  { id: 6, name: "김윤지", description: "통계 개발자", image: "y3.jpg" },
  { id: 7, name: "김기범", description: "메뉴/로그인 개발자", image: "k1.jpg" },
  { id: 8, name: "박세희", description: "디자인", image: "y4.jpg" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const Profile = () => {
  return (
    <div className="profile-wrap">
      <motion.div
        className="profiles-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {profiles1.map((profile) => (
          <motion.div key={profile.id} className="profile-item" variants={itemVariants}>
            <img
              src={`${process.env.REACT_APP_IMAGE_URL}/${profile.image}`}
              alt={`${profile.name} 사진`}
              className="profile-image"
            />
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-description">{profile.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="profiles-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {profiles2.map((profile) => (
          <motion.div key={profile.id} className="profile-item" variants={itemVariants}>
            <img
              src={`${process.env.REACT_APP_IMAGE_URL}/${profile.image}`}
              alt={`${profile.name} 사진`}
              className="profile-image"
            />
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-description">{profile.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Profile;
