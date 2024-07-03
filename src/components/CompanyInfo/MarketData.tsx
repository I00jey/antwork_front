import React, { useEffect } from 'react';

// 마켓데이터 위젯

const MarketData: React.FC = () => {
  const containerId = 'marketWidgetContainer'; // 고유한 식별자

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';

    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      symbolsGroups: [
        {
          name: '지수',
          originalName: 'Indices',
          symbols: [
            {
              name: 'FOREXCOM:SPXUSD',
              displayName: 'S&P 500',
            },
            {
              name: 'FOREXCOM:NSXUSD',
              displayName: 'US 100',
            },
            {
              name: 'FOREXCOM:DJI',
              displayName: 'Dow 30',
            },
            {
              name: 'INDEX:NKY',
              displayName: 'Nikkei 225',
            },
            {
              name: 'INDEX:DEU40',
              displayName: 'DAX Index',
            },
            {
              name: 'FOREXCOM:UKXGBP',
              displayName: 'UK 100',
            },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      colorTheme: 'white',
      locale: 'kr',
    });

    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && script.parentNode) {
        container.removeChild(script);
      }
    };
  }, [containerId]);

  return (
    <div>
      {/* 고유한 식별자를 가진 컨테이너 */}
      <div
        id={containerId}
        className="tradingview-widget-container"
        style={{ marginTop: '0.5rem' }}
      >
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://kr.tradingview.com/"
            rel="noopener nofollow"
            target="_blank"
          ></a>
        </div>
      </div>
    </div>
  );
};

export default MarketData;
