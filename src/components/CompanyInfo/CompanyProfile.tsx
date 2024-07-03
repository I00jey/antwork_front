import React, { useEffect, useRef, useState } from 'react';

// CompanyProfile 컴포넌트에서 props 타입 정의
interface CompanyProfileProps {
  search: string;
}

const CompanyProfile: React.FC<CompanyProfileProps> = (props) => {
  const container = useRef<HTMLDivElement>(null);
  // const [symbol, setSymbol] = useState('NASDAQ:AAPL'); // 기본값 설정

  const search = props.search;
  // console.log(search);

  const symbol = search;
  // console.log(symbol);

  // useEffect(() => {

  //   // search 값이 변경될 때마다 symbol 업데이트
  //   setSymbol(`NASDAQ:${search}`);
  // }, [search]);

  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      isTransparent: false,
      colorTheme: 'white',
      symbol: search,
      locale: 'kr',
    });

    // Check if container exists before appending the script
    if (container.current) {
      // Clear the container before appending the script
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      if (container.current) {
        // Clear the container on component unmount
        container.current.innerHTML = '';
      }
    };
  }, [symbol]); // Empty dependency array ensures useEffect runs only once

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://kr.tradingview.com/"
          rel="noopener nofollow noreferrer"
          target="_blank"
        >
          <span className="blue-text">트레이딩뷰에서 모든 시장 추적</span>
        </a>
      </div>
    </div>
  );
};

export default CompanyProfile;
