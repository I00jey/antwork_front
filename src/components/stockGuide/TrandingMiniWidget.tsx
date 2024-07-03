import React, { useEffect } from 'react';

const TrandingMiniWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = `
      {
        "symbol": "KRX:005930",
        "width": "100%",
        "height": "100%",
        "locale": "kr",
        "dateRange": "12M",
        "colorTheme": "light",
        "isTransparent": false,
        "autosize": true,
        "largeChartUrl": "",
        "chartOnly": false,
        "noTimeScale": false
      }
    `;

    const container = document.querySelector(
      '.tradingview-widget-container__widget'
    );
    container?.appendChild(script);

    // return () => {
    //   // Cleanup if needed
    //   container?.removeChild(script);
    // };
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%' }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: '100%' }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://kr.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        ></a>
      </div>
    </div>
  );
};

export default TrandingMiniWidget;
