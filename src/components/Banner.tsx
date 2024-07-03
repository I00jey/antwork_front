import React, { useState, useEffect } from 'react';
import '../styles/Main.scss';

const banners = [
  {
    id: 1,
    highlight: '쉬운 주식공부',
    title: '주식 호가창 보는 법부터',
    subTitle: '모의투자까지!',
    explanation: '어디서부터 시작해야 할지 모르는 당신을 위한 주식 길잡이',
    images: [
      process.env.PUBLIC_URL + 'image 65.png',
      process.env.PUBLIC_URL + 'red zigzag.png',
    ],
  },
  {
    id: 2,
    highlight: '매일 업데이트',
    title: '매일 생기는 어려운 단어들',
    subTitle: '더 쉽게 확인하자!',
    explanation: '쏟아지는 어려운 용어의 뜻을 확인하기 편리한 뉴스룸',
    images: [process.env.PUBLIC_URL + 'Group 68.png'],
  },
  // Add more banners as needed
];

const BannerSlider = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBanner((prevBanner) =>
        prevBanner === banners.length - 1 ? 0 : prevBanner + 1
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={'main-banner' + currentBanner}>
      <div className="main-banner-content">
        <div className={'main-highlight' + currentBanner}>
          {banners[currentBanner].highlight}
        </div>
        <div className="main-banner-title">
          {banners[currentBanner].title}
          <br /> {banners[currentBanner].subTitle}
        </div>
        <div className="main-banner-explain">
          {banners[currentBanner].explanation}
        </div>
      </div>
      <div className="main-banner-img">
        {banners[currentBanner].images.map((image, index) => (
          <img
            key={index}
            className={`banner-image${index + 1}`}
            src={image}
            alt={`Banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
