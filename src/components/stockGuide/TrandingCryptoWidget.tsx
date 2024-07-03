import { useEffect, useRef, memo } from 'react';
const TrandingCryptoWidget = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
            {
              "exchanges": [],
              "dataSource": "SPX500",
              "grouping": "sector",
              "blockSize": "market_cap_basic",
              "blockColor": "change",
              "locale": "kr",
              "symbolUrl": "",
              "colorTheme": "light",
              "hasTopBar": false,
              "isDataSetEnabled": false,
              "isZoomEnabled": true,
              "hasSymbolTooltip": true,
              "width": "100%",
              "height": "100%"
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
      style={{ height: '100%' }}
      ref={container}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: 'calc(100% + 32px)' }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://kr.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          {/* <span className="blue-text">트레이딩뷰에서 모든 시장 추적</span> */}
        </a>
      </div>
    </div>
  );
};

export default memo(TrandingCryptoWidget);
