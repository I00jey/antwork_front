import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { WordsProp } from '../../types/WordsProp';
import '../../styles/NewsDetail.scss';
import WordModal from '../../components/news/WordModal';
import { useCookies } from 'react-cookie';
import { NewsProp } from '../../types/NewsProp';
import ErrorPage from '../error/404Page';
import { Helmet } from 'react-helmet';

const NewsDetailPage = () => {
  const params = useParams();
  const [data, setData] = useState<NewsProp>();

  const [wordsList, setWordsList] = useState<string[]>([]);
  const [wordsDb, setWordsDb] = useState<WordsProp[]>([]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalWord, setModalWord] = useState<WordsProp | null>(null);

  const [cookies, setCookie, removeCookie] = useCookies(['jwtCookie']);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [myHighlight, setMyHighlight] = useState<string[]>([]);

  const [validParams, setValidParams] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKSERVER + '/news/getDetail',
          { params: params }
        );
        const isValid = res.data.isValid;
        if (!isValid) {
          setValidParams(false);
        } else {
          setData(res.data.detail);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    // 시사경제용어 데이터 가져오기
    const getWordsDb = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKSERVER + '/news/getWordsDb'
        );
        const wordsData = res.data;
        const getWordsList = wordsData.map((data: WordsProp) => data.word);
        setWordsList(getWordsList);
        setWordsDb(wordsData);
      } catch (error) {
        console.error(error);
      }
    };

    // 형광펜 했던 텍스트 가져오기
    const getHighlight = async () => {
      if (!data) return;
      try {
        const tokenId = cookies['jwtCookie'];
        if (tokenId) {
          const res = await axios.get(
            process.env.REACT_APP_BACKSERVER + '/news/getHighlight',
            {
              params: { news_id: data._id },
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
          const available = res.data.available;
          // console.log(available);
          if (available) {
            setMyHighlight(res.data.highlight.word);
          }
          // console.log(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getWordsDb();
    const tokenId = cookies['jwtCookie'];
    if (tokenId) {
      getHighlight();
    }
  }, [cookies, data]);

  // 시사경제용어 형광펜 클릭
  const handleWordClick = async (
    word: string,
    positon: { top: number; left: number }
  ) => {
    // 클릭한 단어의 위치 저장
    setModalPosition(positon);

    // 클릭한 단어와 관련된 데이터를 가져오고 필요에 따라 처리
    const wordData = wordsDb.find(
      (singleData: WordsProp) => singleData.word === word
    );

    if (wordData) {
      // console.log('클릭한 단어에 대한 데이터:', wordData);

      // 모달에서 보여줄 단어 저장
      setModalWord(wordData);
      // 모달 열기
      setOpenModal(true);
    } else {
      console.error('클릭한 단어에 대한 데이터를 찾을 수 없습니다.');
    }
  };

  // 모달 닫기 버튼 함수
  const closeModal = () => {
    setOpenModal(false);
    setModalWord(null);
  };

  // 형광펜 삭제
  const highlightClick = async (word: string) => {
    if (!data) return;
    try {
      // 클릭한 단어와 관련된 데이터를 가져오고 필요에 따라 처리
      const hData = myHighlight.find((h) => h === word);
      const res = await axios.post(
        process.env.REACT_APP_BACKSERVER + '/news/deleteHighlight',
        {
          news_id: data._id,
          highlightTxt: hData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      // console.log('--------', res);
      if (res.data.success) {
        alert('형광펜이 삭제되었습니다!');
      } else {
        alert('형광펜 삭제 실패: 관리자에게 문의하세요');
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // 형광펜 표시
  const highlightContent = (
    content: string,
    wordsList: string[],
    myHighlight: string[]
  ) => {
    const sortedWordsList = wordsList.sort((a, b) => b.length - a.length);
    const allWords = [...sortedWordsList, ...myHighlight];
    const regex = new RegExp(
      `(${allWords
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')})`,
      'g'
    );
    const highlightedWords: Set<string> = new Set();

    return content.split(regex).map((word, index) => {
      const isWordsListHighlighted =
        regex.test(word) && !myHighlight.includes(word);
      const isMyHighlightHighlighted = myHighlight.includes(word);

      if (isWordsListHighlighted && !highlightedWords.has(word)) {
        highlightedWords.add(word);
        return (
          <span
            key={index}
            className="highlight"
            onClick={(e) =>
              handleWordClick(word, {
                top: e.currentTarget.offsetTop,
                left: e.currentTarget.offsetLeft,
              })
            }
          >
            {word}
          </span>
        );
      } else if (isMyHighlightHighlighted && !highlightedWords.has(word)) {
        highlightedWords.add(word);
        return (
          <span
            key={index}
            className="myHighlight"
            // style={{ backgroundColor: 'yellow' }}
            onClick={(e) => highlightClick(word)}
          >
            {word}
          </span>
        );
      } else {
        return <span key={index}>{word}</span>;
      }
    });
  };

  // 기사 저장 유무
  useEffect(() => {
    const checkMyNews = async () => {
      if (!data) return;
      const tokenId = cookies['jwtCookie']; // 대괄호를 사용하여 속성에 액세스합니다.
      // console.log(tokenId);
      if (tokenId) {
        const checkNews = await axios.get(
          process.env.REACT_APP_BACKSERVER + '/news/checkMyNews',
          {
            params: { news_id: data._id },
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${tokenId}`,
            },
            withCredentials: true,
          }
        );
        // console.log(checkNews.data);
        setIsSaved(checkNews.data.isSavedNews);
      }
    };
    checkMyNews();
  }, [cookies, data]);

  // 기사 저장
  const myNews = async () => {
    const tokenId = cookies['jwtCookie']; // 대괄호를 사용하여 속성에 액세스합니다.
    if (!tokenId) {
      alert('로그인 후 사용가능한 기능입니다.');
      navigate('/signin');
    } else {
      setIsSaved(!isSaved);
      const saveMyNews = await axios.post(
        process.env.REACT_APP_BACKSERVER + '/news/saveMynews',
        { data },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    }
  };

  // 드래그 가능 여부
  const draggable = () => {
    const tokenId = cookies['jwtCookie'];
    if (!tokenId) {
      alert('로그인 후 사용가능한 기능입니다.');
      navigate('/signin');
    } else {
      setIsDraggable(!isDraggable);
    }
  };

  // 형광펜 on 상태에서 형광펜 삭제
  const removeSpan = async (selectedTxt: string) => {
    if (!data) return;
    try {
      const res = await axios.post(
        process.env.REACT_APP_BACKSERVER + '/news/deleteHighlight',
        {
          news_id: data._id,
          highlightTxt: selectedTxt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      // console.log('--------', res);
      if (res.data.success) {
        alert('형광펜이 삭제되었습니다!');
      } else {
        alert('형광펜 삭제 실패: 관리자에게 문의하세요');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 드래그 : 직접 형광펜 기능
  const dragText = (event: any) => {
    if (!data) return;
    if (isDraggable) {
      // event.preventDefault();
      const selection = window.getSelection();
      const selectedTxt = selection?.toString() || '';
      // console.log('selection >', selection);
      // console.log('selectedText >', selectedTxt);

      if (selection && selectedTxt) {
        const range = selection.getRangeAt(0);

        // 추출된 내용
        const extractedContents = range.extractContents();

        // 새로운 span 요소 생성
        const span = document.createElement('span');
        span.style.backgroundColor = 'lemonchiffon'; // 원하는 백그라운드 컬러로 변경
        span.style.cursor = 'pointer';
        span.appendChild(extractedContents);

        span.addEventListener('click', () => {
          removeSpan(selectedTxt); // 형광펜 삭제 함수 호출
          span.outerHTML = span.innerHTML;
        });

        // 추출된 내용 대신에 span 태그를 삽입
        range.insertNode(span);

        const saveMyHighlight = axios.post(
          process.env.REACT_APP_BACKSERVER + '/news/myHighlight',
          {
            news_id: data._id,
            selectedTxt,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        // window.location.reload();
      }
    } else {
      // 드래그 불가능 상태일 때는 드래그 이벤트 무시
      event.preventDefault();
    }
  };

  return (
    <>

      <Helmet>
        <title>개미운동 : 뉴스룸</title>
      </Helmet>
      {!validParams ? (
        <ErrorPage />
      ) : (
        <>
          <main className="outer-wrapper">
            <div className="detailWrapper">
              <div className="tool">
                <div className="goBackBtn" onClick={() => navigate(-1)}>
                  <span className="material-symbols-rounded">
                    arrow_back_ios_new
                  </span>
                </div>

                <div
                  className={`pen ${isDraggable ? 'active' : ''}`}
                  onClick={draggable}
                >
                  형광펜
                </div>
                <div
                  className={`saveNews ${isSaved ? 'active' : ''}`}
                  onClick={myNews}
                >
                  저장
                </div>
              </div>

              {data ? (
                <>
                  <h1 className="detailTitle">{data.title}</h1>
                  <p className="detailDate">{data.date}</p>
                  <br />

                  <img className="detailImg" src={data.bigimg || ''} />
                  <h3 className="detailSubT">{data.subtitle}</h3>

                  <p className="detailContent" onMouseUp={dragText}>
                    {wordsList.length > 0
                      ? highlightContent(data.content, wordsList, myHighlight)
                      : data.content}
                  </p>
                  <br />
                  <p className="detailSrc">출처 : {data.url}</p>
                </>
              ) : (
                <div></div>
              )}

            </div>

            {/* 모달 */}
            {openModal && modalWord && (
              <WordModal
                modalWord={modalWord}
                closeModal={closeModal}
                modalPosition={modalPosition}
              />
            )}
          </main>
        </>
      )}
    </>
  );
};

export default NewsDetailPage;
