import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'user/content/BestMovieSlider.css';

const BestMovieSlider = () => {
	const [movies, setMovies] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedDetailIndex, setSelectedDetailIndex] = useState(0);
	const [isMouseOn, setIsMouseOn] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [translateX, setTranslateX] = useState(0);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/movies/best`);
				if (response.data) {
					setMovies(response.data);
				}
			} catch (error) {
				console.error('There was an error fetching the best movies!', error);
			}
		};

		fetchMovies();
	}, []);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.clientX); // 시작 위치 저장
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;

		const distance = e.clientX - startX;
		setTranslateX(distance); // 이동 거리를 실시간으로 설정
	};

	const handleMouseUp = () => {
		setIsDragging(false);

		// 이동 거리가 충분히 크면 이동, 그렇지 않으면 원래 위치로 되돌림
		if (translateX > 100 && currentIndex > 0) {
			setCurrentIndex(prevIndex => prevIndex - 1);
		} else if (translateX < -100 && currentIndex < movies.length - 5) {
			setCurrentIndex(prevIndex => prevIndex + 1);
		}

		setTranslateX(0); // 이동 값 초기화
	};

	const handleDetailMouseOver = (index) => {
		setSelectedDetailIndex(index);
		setIsMouseOn(true);
	};

	const handleDetailMouseleave = () => {
		setSelectedDetailIndex(null);
		setIsMouseOn(false);
	};

	return (
		<div className='best-movie-slider-wrap'>
			<div className='best-movie-slider-view-wrap'>
				<div className="best-movie-slider-button" onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}>
					<i className="bi bi-chevron-left fs-1"></i>
				</div>
				<div
					className='best-movie-slider-view'
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={() => isDragging && handleMouseUp()} // 마우스가 슬라이더 밖으로 나갈 때도 처리
				>
					<ul style={{ transform: `translateX(calc(-${currentIndex * 200}px + ${translateX}px))`, transition: isDragging ? 'none' : 'transform 0.3s ease' }}>
						{movies.map((movie, index) => (
							<li key={index} className="best-movie-slider-view-list" onMouseOver={() => {handleDetailMouseOver(index)}} onMouseLeave={() => {handleDetailMouseleave()}}>
								<div>
									<div>
										<img
											className="best-movie-slider-view-img"
											src={`${process.env.REACT_APP_IMAGE_URL}/images/movie/${movie.movie_image_name}`}
											alt={movie.movie_name}
											draggable="false"
										/>
									</div>
									<div className='best-movie-slider-view-title'>
										<div className='best-movie-slider-view-title1'>{movie.age_restriction_name}</div>
										<div className='best-movie-slider-view-title2'>{movie.movie_name}</div></div>
									<div className='best-movie-slider-view-rating'>
										<div className='best-movie-slider-view-reservation'>{movie.reservation_rate}</div>
										<div className='best-movie-slider-view-rating'>
											{movie.screening_status === 'play' ? (
												<>
													<i className="bi bi-star-fill"></i> {movie.rating}
												</>
											) : (
												<>
													<span>{movie.screening_status}</span>
												</>
											)}
										</div>
									</div>
									<div className='best-movie-slider-view-ranking'><strong><i>{movie.ranking}</i></strong></div>
								</div>
								{isMouseOn && selectedDetailIndex === index && (
									<div className='best-movie-slider-view-detail-wrap'>
										<div className='best-movie-slider-view-detail-reservation'>예매하기</div>
										<div className='best-movie-slider-view-detail-comment'>상세정보</div>
									</div>
								)}
							</li>
						))}
				</ul>
			</div>
			<div className="best-movie-slider-button" onClick={() => currentIndex < movies.length - 5 && setCurrentIndex(currentIndex + 1)}>
				<i className="bi bi-chevron-right fs-1"></i>
			</div>
		</div>
		</div >
	);
}

export default BestMovieSlider;
