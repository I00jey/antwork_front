import axios from 'axios';
import { useEffect, useState } from 'react';
import { NewsProp } from '../../types/NewsProp';
import NewsList from '../../components/news/NewsList';
import { Link, useParams, NavLink } from 'react-router-dom';
import '../../styles/NewsPage.scss';
import Loading from '../../components/news/Loading';
import NotFound from '../error/404Page';
import { Helmet } from 'react-helmet';

function NewsPage() {
  const { group } = useParams();
  const [news, setNews] = useState<NewsProp[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDataFromServer = async () => {
    try {
      if (!group) return;

      let url = process.env.REACT_APP_BACKSERVER + `/news/${group}`;

      // Axios를 사용하여 서버에 GET 요청
      await axios.get(url).then((res) => {
        // console.log(res.data);
        setNews(res.data);
        // setLoading(true) // 로딩창 확인 위해
      });
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
  };
  useEffect(
    () => {
      fetchDataFromServer();
      // console.log(group)
    },
    [group]
    // []
  );

  const refresh = async () => {
    setLoading(true);
    try {
      let url2 = process.env.REACT_APP_BACKSERVER + `/news/get${group}`;
      const newData = await axios.get(url2);
      // setLoading(false);
      // setNews(newData.data);
      // console.log(newData);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error('refresh error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>개미운동 : 뉴스룸</title>
      </Helmet>
      {(group && group === 'economy') ||
      group === 'stock' ||
      group === 'coin' ? (
        <main className="outer-wrapper">
          <div>
            <div className="page-title">뉴스룸</div>
            <div className="newsNav">
              <ul className="newsLinks">
                <li>
                  <NavLink
                    to="/news/economy"
                    style={({ isActive }) => {
                      return {
                        color: isActive ? '#0056F3' : '#333',
                      };
                    }}
                  >
                    경제
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/news/stock"
                    style={({ isActive }) => {
                      return {
                        color: isActive ? '#0056F3' : '#333',
                      };
                    }}
                  >
                    주식
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/news/coin"
                    style={({ isActive }) => {
                      return {
                        color: isActive ? '#0056F3' : '#333',
                      };
                    }}
                  >
                    코인
                  </NavLink>
                </li>
              </ul>
              <ul className="refresh-btn">
                <li className="material-symbols-outlined" onClick={refresh}>
                  cached
                </li>
              </ul>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            news.map((data: NewsProp, index: number) => {
              return <NewsList key={index} data={data} />;
            })
          )}
        </main>
      ) : (
        <NotFound />
      )}
    </>
  );
}

export default NewsPage;
