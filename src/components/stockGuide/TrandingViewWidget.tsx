// TradingViewWidget.jsx
import { useEffect, useRef, memo } from 'react';

const TradingViewWidget = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "KRX:005930",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "kr",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current?.appendChild(script);
    // return () => {
    //     if (!container.current?.querySelector('script')) {
    //   container.current?.appendChild(script);
    //   }else if(container.current) {
    //     container.current?.removeChild(script);
    //   }else{
    //     return;
    //   }
    // };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '100%', width: '100%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      ></div>
      {/* <div className="tradingview-widget-copyright"><a href="https://kr.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">트레이딩뷰에서 모든 시장 추적</span></a></div> */}
    </div>
  );
};

export default memo(TradingViewWidget);
