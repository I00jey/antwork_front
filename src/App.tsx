import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userInfo } from './services/apiService';

import './styles/Component.scss';
import './styles/Header.scss';
import './styles/Signin.scss';
import './styles/Main.scss';

import Header from './components/Header';
import MainPage from './pages/MainPage';
import SigninPage from './pages/member/SigninPage';
import SignupPage from './pages/member/SignupPage';
import FindIdPage from './pages/member/FindIdPage';

import NewsPage from './pages/news/NewsPage';
import NewsDetailPage from './pages/news/NewsDetailPage';

import CommunityMain from './pages/community/CommunityMain';
import CommunityReadPage from './pages/community/CommunityReadPage';
import axios, { AxiosError } from 'axios';
import StockGuidePage from './pages/stockGuide/StockGuidePage';
import MyPage from './pages/member/MyPage';
import WordBookPage from './pages/member/WordBookPage';
import NotFound from './pages/error/404Page';
import AdminError from './pages/error/403Page';
import ServerError from './pages/error/500Page';
import Virtual from './components/VirtualInvest/Virtual';
import StockVirtualPage from './pages/stockGuide/StockVirtualPage';
import StockRatePage from './pages/stockGuide/StockRatePage';
import AdminPage from './pages/AdminPage';
import CommunityManage from './pages/admin/CommunityManage';
import DeleteManage from './pages/admin/DeleteManage';

import SavedNews from './pages/member/SavedNews';
import { UserData } from './types/types';

function App() {
  const [serverData, setServerData] = useState('');
  const [errorNum, setErrorNum] = useState(0);

  useEffect(() => {
    // React 컴포넌트가 마운트될 때 한 번 실행
    fetchDataFromServer();
    // notFoundError();
  }, []);

  const fetchDataFromServer = async () => {
    if (process.env.REACT_APP_BACKSERVER) {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKSERVER!, {
          withCredentials: true, // axios에서는 credentials를 설정할 때 withCredentials를 사용
          headers: {
            'Content-Type': 'application/json',
            // 필요에 따라 다른 헤더를 추가할 수 있음
          },
        });

        // console.log(response.data);
        setServerData(response.data.message);
      } catch (error) {
        console.error('Error fetching data with axios:', error);
      }
    } else {
      return;
    }
  };

  const notFoundError = async () => {
    try {
      // console.log(window.location.pathname);

      const currentPath =
        process.env.REACT_APP_BACKSERVER + window.location.pathname;
      console.log(currentPath);
      const response = await axios.get(currentPath, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response);
      if (response.status === 200) {
        return;
      } else if (response.status === 500) {
        setErrorNum(500);
      } else {
        setErrorNum(404);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // 여기에서 axiosError.response를 사용할 수 있습니다.
        // console.log(axiosError.response.status);
        const err = axiosError.response.status;
        if (err === 200) {
          return;
        } else if (err === 403) {
          setErrorNum(403);
        } else if (err === 500) {
          setErrorNum(500);
          // window.location.href = '/500';
        } else {
          setErrorNum(404);
          // window.location.href = '/404';
        }
      }
      // console.log(error);
    }
  };

  const [jwtCookie] = useCookies(['jwtCookie']);

  const [user, setuser] = useState<UserData>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const tokenId = jwtCookie['jwtCookie'];
        if (tokenId) {
          const response = await userInfo({ id: tokenId });
          setuser(response.info); // user
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [jwtCookie]);

  // console.log(user);

  // admin 로그인 시에만 admin페이지가 나오게
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin === 1);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    const localAdmin = localStorage.getItem('isAdmin');
    if (localAdmin !== null) {
      const storedAdmin = JSON.parse(localAdmin);
      setIsAdmin(storedAdmin);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* 404 에러 페이지 */}
          {errorNum === 404 && <Route path="*" element={<NotFound />} />}

          {/* 500 서버 에러 페이지 */}
          {errorNum === 403 && <Route path="*" element={<AdminError />} />}

          {/* 500 서버 에러 페이지 */}
          {errorNum === 500 && <Route path="*" element={<ServerError />} />}

          <Route path="/" element={<MainPage />} />

          <Route path="/news/:group?" element={<NewsPage />} />
          <Route path="/news/detail/:id" element={<NewsDetailPage />} />

          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/findId" element={<FindIdPage />} />
          <Route path="/kakao/callback" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/wordBook" element={<WordBookPage />} />
          <Route path="/savedNews" element={<SavedNews />} />

          <Route path="/stockGuide" element={<StockGuidePage />} />
          <Route path="/stockRate" element={<StockRatePage />} />

          {/* 커뮤니티 */}
          <Route path="/community" element={<CommunityMain />} />
          {/* 커뮤니티 상세보기 */}
          <Route path="/community/:id" element={<CommunityReadPage />} />

          {/* <Route path="/virtual" element={<Virtual />} /> */}
          <Route path="/virtual" element={<StockVirtualPage />} />

          {isAdmin ? (
            <>
              <Route path="/admin" element={<AdminPage data={isAdmin} />} />
              <Route
                path="/admin/communityManage"
                element={<CommunityManage />}
              />
              <Route path="/admin/deleteManage" element={<DeleteManage />} />
            </>
          ) : (
            <Route path="*" element={<AdminError />} />
          )}
        </Routes>
      </BrowserRouter>
      <div>{serverData}</div>
    </div>
  );
}

export default App;
