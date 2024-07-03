import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  kakaoLogin,
  mainBoards,
  mainNews,
  showRank,
} from '../services/apiService';
import Slider from '../components/Slider';
import TrandingMiniWidget from '../components/stockGuide/TrandingMiniWidget';
import TrandingCryptoWidget from '../components/stockGuide/TrandingCryptoWidget';
import { Link } from 'react-router-dom';
import { NewsProp } from '../types/NewsProp';
import { CommunityProp } from '../types/CommunityProp';

import MainVirtualRanking from '../components/MainVirtualRanking';

import { useCookies } from 'react-cookie';
import Banner from '../components/Banner';

const MainPage = () => {
  const [newsData, setNewsData] = React.useState([
    {
      thumbnail: '',
      title: '',
      content: '',
      id: '',
    },
  ]);
  const [isLogin, setIsLogin] = useState(false);
  const [jwtCookie, setjwtCookie, removejwtCookie] = useCookies(['jwtCookie']);
  useEffect(() => {
    const tokenId = jwtCookie['jwtCookie'];
    // console.log(tokenId);
    if (!tokenId) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);
  const [boardData, setBoardData] = React.useState([
    {
      image: '',
      title: '',
      content: '',
      writer: '',
      date: '',
      like: 0,
      id: '',
    },
  ]);

  const [newslist, setNewslist] = useState<NewsProp[]>([]);
  const [boardlist, setBoardlist] = useState<CommunityProp[]>([]);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getNews();
    getBoard();
  }, []);
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    // console.log(newsData);
    // console.log(boardData);
  }, [newsData, boardData]);

  useEffect(() => {
    const textContainer = textContainerRef.current;
    const maxHeight = 100; // 필요에 따라 조절

    if (textContainer && textContainer.scrollHeight > maxHeight) {
      while (textContainer.scrollHeight > maxHeight) {
        textContainer.textContent =
          textContainer.textContent?.replace(/\W*\s(\S)*$/, '...') || '';
      }
    }
  }, []);

  const getNews = async () => {
    const response = await mainNews();
    const data = response.news;
    setNewslist(data);
    if (response.success) {
      const updateNews = data.map((news: any) => {
        return {
          thumbnail:
            news.smallimg || process.env.PUBLIC_URL + 'board-default.png',
          title: news.title,
          content: news.content,
          id: news._id,
        };
      });
      setNewsData(updateNews);
    } else {
      const newsArray = [
        {
          thumbnail: 'default-image',
          title: '등록된 뉴스가 없습니다.',
          content: '',
          id: '',
        },
      ];
      setNewsData(newsArray);
    }
  };

  const getBoard = async () => {
    const response = await mainBoards();
    const data = response.board;
    setBoardlist(data);
    // console.log('hihihiddddddd', data);
    if (response.success) {
      const updateBoard = data.map((boards: any) => {
        // console.log('boards:', boards);
        return {
          image: boards.image || process.env.PUBLIC_URL + 'board-default.png',
          title: boards.title,
          content: boards.content,
          writer: boards.userId.user_nickname,
          date: (boards.date as string).split('T')[0],
          like: boards.likedUser.length,
          id: boards._id,
        };
      });
      // console.log(updateNews);
      // const boardArray = updateBoard;
      setBoardData(updateBoard);
      // console.log(boardData);
    } else {
      const boardArray = [
        {
          image: process.env.PUBLIC_URL + 'board-default.png',
          title: '등록된 게시글이 없습니다.',
          content: '',
          writer: '',
          date: '',
          like: 0,
          id: '',
        },
      ];
      setBoardData(boardArray);
    }
  };

  const move = (str: string) => {
    if (str === 'left') {
      if (translate === 0) {
        return;
      }
      setTranslate((prev) => prev + 67);
    } else if (str === 'right') {
      if (translate === -201) {
        return;
      }
      setTranslate((prev) => prev - 67);
    }
    // console.log(translate);
  };
  // console.log('newslist', newslist);
  // console.log('newsdata', newsData);

  const [userRank, setUserRank] = useState<
    Array<{ userid: string; profit: number; win: number; profile: string }>
  >([]);
  // console.log('userRank', userRank);

  useEffect(() => {
    const showRanking = async () => {
      try {
        const response = await showRank({});
        if (response) {
          // console.log('show rank response 전송 성공');
          // console.log('respone', response);
          // 여기에서 response를 처리하거나 다른 작업을 수행할 수 있습니다.
          setUserRank(response.rank);
        }
      } catch (error) {
        console.error('API 호출 에러:', error);
      }
    };
    // fetchData 함수를 호출하여 데이터를 가져오도록 설정

    showRanking();
  }, []);

  return (
    <>
      <Helmet>
        <title>개미운동</title>
      </Helmet>
      <div className="inner-wrapper">
        <Banner />
      </div>
      <div className="inner-wrapper">
        <div className="section0">
          <span>주식을 시작하고 싶은 당신을 위해</span>
          {!isLogin && (
            <Link to="/signin">
              <img
                className="section1-img2"
                src={process.env.PUBLIC_URL + 'back.png'}
              />
            </Link>
          )}
          {isLogin && (
            <Link to="/stockGuide">
              <img
                className="section1-img2"
                src={process.env.PUBLIC_URL + 'back.png'}
              />
            </Link>
          )}
        </div>
      </div>
      <div className="outer-wrapper">
        <div className="inner-wrapper">
          <div className="section1">
            <div>
              주식을 시작하고 싶지만
              <br />
              엄두도 내지 못하는
              <br />
              당신을 위해
            </div>
            <span>주식을 시작하고 싶은 당신을 위해</span>

            <img
              className="section1-img1"
              src={process.env.PUBLIC_URL + 'finance.jpg'}
            />

            {isLogin && (
              <Link to="/stockGuide">
                <button key="signin-button">개미운동 시작하기</button>
              </Link>
            )}

            <br />
            {!isLogin && (
              <Link to="/signin">
                <button key="signin-button">개미운동 시작하기</button>
              </Link>
            )}
            {isLogin && (
              <Link to="/stockGuide">
                <button key="signin-button">개미운동 시작하기</button>
              </Link>
            )}
          </div>
          {newsData.length >= 2 && (
            <div className="section2">
              {newsData.slice(0, 2).map((news, idx) => (
                <Link
                  to={`/news/detail/${newslist[idx]._id}`}
                  state={{ data: newslist[idx] }}
                  key={idx}
                >
                  <div className="main-news" key={idx}>
                    <img className="main-news-thumbnail" src={news.thumbnail} />
                    <div className="main-news-text">
                      <div className="main-news-title">{news.title}</div>
                      <div className="main-news-point point-latest">최신</div>
                      <div className="main-news-point point-news">뉴스</div>
                      <div className="main-news-content" ref={textContainerRef}>
                        {news.content}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="inner-wrapper">
          <div className="section3">
            <TrandingMiniWidget />
          </div>
          <div className="section4">
            <MainVirtualRanking data={userRank} />
          </div>
        </div>
      </div>
      <div className="point-section">
        <div className="outer-wrapper">
          <div className="thumb-title">개미의 시선</div>
          <div className="inner-wrapper">
            <div className="main-community">
              <div
                className="section5"
                style={{ transform: `translate(${translate}vw)` }}
              >
                <Slider boardlist={boardlist} boardData={boardData} />
              </div>
            </div>
          </div>
          <div className="slider-btn-group">
            <div className="slider-btn-left" onClick={() => move('left')}>
              <span className="material-symbols-rounded">chevron_left</span>
            </div>

            <div className="slider-btn-right" onClick={() => move('right')}>
              <span className="material-symbols-rounded">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MainPage;
