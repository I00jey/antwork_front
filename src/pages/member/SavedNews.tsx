import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import NewsList from '../../components/news/NewsList';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../../styles/SavedNews.scss'


function SavedNews() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwtCookie']);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  const getMynews = async () => {
    const tokenId = cookies['jwtCookie'];

    if (!tokenId) {
      alert('로그인 후 사용 가능한 기능입니다.');
      navigate('/signin');
      return;
    } else {
      const myNews = await axios.get(
        process.env.REACT_APP_BACKSERVER + '/news/getMyNews',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setNews(myNews.data.news);
    }
  };

  useEffect(() => {
    getMynews();
  }, []);

  return (
    <>
      <Helmet>
        <title>뉴스스크랩 : 개미운동</title>
      </Helmet>
      <main className="outer-wrapper">
        <div className="page-title">뉴스 스크랩</div>
        <div className="wordBook-hr"></div>

        {!cookies['jwtCookie'] ? (
          <div></div>
        ) : (
          <>
            {news.length > 0 ? (
              news.map((data, index) => <NewsList key={index} data={data} />)
            ) : (
              <>

              <div className='savedMsg'>
                <p>아직 저장한 뉴스가 없습니다.</p>
                <p>저장하기를 눌러 뉴스를 저장해보세요!</p>
              </div>


                <Link to="/news/economy">
                  <div className="toNews">뉴스룸 바로가기</div>
                </Link>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default SavedNews;
