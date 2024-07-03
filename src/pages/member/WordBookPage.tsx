import React, { useEffect, useState } from 'react';
import Word from '../../components/news/Word';
import '../../styles/WordBook.scss';
import { deleteWord, wordBook } from '../../services/apiService';
import { useCookies } from 'react-cookie';
import { redirect, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';

const WordBookPage = () => {
  const [wordData, setWordData] = React.useState([
    {
      no: 0,
      title: '',
      content: '',
    },
  ]);
  const [type, setType] = useState('latest');
  const navigate = useNavigate();
  const [jwtCookie, setjwtCookie, removejwtCookie] = useCookies(['jwtCookie']);
  useEffect(() => {
    const tokenId = jwtCookie['jwtCookie']; // 대괄호를 사용하여 속성에 액세스합니다.
    console.log(tokenId);
    if (!tokenId) {
      alert('로그인 후 사용가능한 기능입니다.');
      navigate('/signin');
    }
    getWords();
    // deleteWord({ id: tokenId });
  }, []);
  useEffect(() => {
    getWords();
    // deleteWord({ id: tokenId });
  }, [type]);

  const getWords = async () => {
    const response = await wordBook({ word: jwtCookie['jwtCookie'] });
    const data = response.user[0].word_bookmark;
    // console.log(data);
    if (type === 'abc') {
      data.sort((a: any, b: any) => {
        const wordA = a.word.toUpperCase(); // 대소문자 구분 없이 정렬
        const wordB = b.word.toUpperCase();
        if (wordA < wordB) return -1;
        if (wordA > wordB) return 1;
        return 0;
      });
      // console.log('sortedData: ', sortedData);
    } else if (type === 'latest') {
      data.reverse();
    } else {
      return;
    }

    if (response.success) {
      const updateWords = data.map((words: any) => ({
        no: words.no,
        title: words.word,
        content: words.explanation,
      }));
      // console.log(updateWords);
      const wordArray = updateWords;
      // console.log(wordArray);

      setWordData(wordArray);
      // console.log(wordData);
    } else {
      const wordArray = [
        {
          no: 0,
          title: '등록된 단어가 없습니다.',
          content: '',
        },
      ];
      setWordData(wordArray);
    }
  };
  const handleType = (str: string) => {
    setType(str);
    // console.log(type);
    getWords();
    // redirect('/wordBook');
    // window.location.href = '';
  };
  // console.log(wordData);
  return (
    <>
      <Helmet>
        <title>단어장 : 개미운동</title>
      </Helmet>
      <div className="outer-wrapper">
        <div className="page-title">
          단어장
          {type === 'latest' && (
            <div className="word-btn-group">
              <div
                className="word-btn btn-selected"
                onClick={() => handleType('latest')}
              >
                최신순
              </div>
              <div className="word-btn" onClick={() => handleType('abc')}>
                가나다순
              </div>
            </div>
          )}
          {type === 'abc' && (
            <div className="word-btn-group">
              <div className="word-btn" onClick={() => handleType('latest')}>
                최신순
              </div>
              <div
                className="word-btn btn-selected"
                onClick={() => handleType('abc')}
              >
                가나다순
              </div>
            </div>
          )}
        </div>
        <div className="wordBook-hr"></div>
        <div className="wordBook">
          {wordData.length === 0 && <div>저장된 단어가 없습니다.</div>}
          <Word wordData={wordData} />
        </div>
      </div>
    </>
  );
};

export default WordBookPage;
