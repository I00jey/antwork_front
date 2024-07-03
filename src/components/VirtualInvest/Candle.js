// Candle.js

import { createChart, ColorType, PriceScaleMode } from 'lightweight-charts';
import { symbol } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

export const Candle = (props) => {
  const {
    data,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = 'black',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
    symbolName = symbol, // 심볼 이름
    volumeArr,
  } = props;

  const chartContainerRef = useRef();
  const [legendContent, setLegendContent] = useState(''); // 호버 시 캔들 상태 legend

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      priceScale: {
        mode: PriceScaleMode.Normal,
      },
    });

    chart.timeScale().fitContent();

    // ////////////////////////
    // volume
    const areaSeries = chart.addAreaSeries({
      topColor: '#009EFA',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
      lineColor: '#009EFA',
      lineWidth: 2,
    });
    areaSeries.priceScale().applyOptions({
      scaleMargins: {
        // 캔들 탑, 바텀 위치 조정
        top: 0.2,
        bottom: 0.2,
      },
    });

    const volumeSeries = chart.addHistogramSeries({
      color: '#009EFA',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.5,
        bottom: 0,
      },
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.75, // 캔들과 볼륨의 간격
        bottom: 0,
      },
    });

    const volumeData = volumeArr.map((item) => {
      return {
        time: item.time,
        value: Number(item.value),
        color: item.color,
      };
    });
    if (volumeData) {
      volumeSeries.setData(volumeData);
    }

    //////////////////////////////
    // 이동평균선 지표 추가(이평)

    const movingAverages = [
      { length: 7, color: '#F3C5FF' },
      { length: 14, color: '#FFC75F' },
      { length: 20, color: '#00C9A7' },
      { length: 128, color: '#008CCA' },
    ];

    for (const { length, color } of movingAverages) {
      const movingAverage = chart.addLineSeries({
        color,
        priceLineSource: true,
        priceLineVisible: true,
        lastValueVisible: true,
      });

      const movingAverageData = data.map((item, index) => {
        const closePrices = data
          .slice(Math.max(0, index - length + 1), index + 1)
          .map((d) => d.close);
        const average =
          closePrices.reduce((sum, close) => sum + close, 0) /
          closePrices.length;
        return { time: item.time, value: average };
      });

      movingAverage.setData(movingAverageData);
    }

    // ////////////////////////
    // candle 스타일

    const newSeries = chart.addCandlestickSeries({
      upColor: 'rgba(38, 166, 154, 1)',
      downColor: 'rgba(255, 78, 66, 1)',
      borderDownColor: 'rgba(255, 78, 66, 1)',
      borderUpColor: 'rgba(38, 166, 154, 1)',
      wickDownColor: 'rgba(255, 78, 66, 1)',
      wickUpColor: 'rgba(38, 166, 154, 1)',
    });
    newSeries.setData(data);

    // ////////////////////////
    // 호버 시 가격 정보 legend

    const updateLegend = (param) => {
      const validCrosshairPoint = !(
        param === undefined ||
        param.time === undefined ||
        param.point.x < 0 ||
        param.point.y < 0
      );

      if (validCrosshairPoint) {
        const bar = param.seriesData.get(newSeries);
        const time = bar.time;
        const openPrice = bar.value !== undefined ? bar.value : bar.open;
        const closePrice = bar.value !== undefined ? bar.value : bar.close;
        const highPrice = bar.value !== undefined ? bar.value : bar.high;
        const lowPrice = bar.value !== undefined ? bar.value : bar.low;

        //gap = 시작, 종가의 차이 (소수 둘째까지 출력) , percentage = gap과 종가의 백분율
        // checkpercentage = 양, 음봉 체크 후 부호설정
        const gap = Math.abs(closePrice - openPrice).toFixed(2);
        const checkGap =
          openPrice < closePrice ? String('+' + gap) : String('-' + gap);
        const percentage = ((gap / closePrice) * 100).toFixed(2);
        const checkPercentage =
          openPrice < closePrice
            ? String('+' + percentage)
            : String('-' + percentage);

        setLegendContent(
          `
          <div>
          <div style="font-size: 24px; margin: 10px 10px; display: inline-block">${symbolName}</div>
          <div style="font-size: 12px; margin: 5px 5px; display: inline-block">시: ${openPrice.toFixed(
            1
          )}</div>
          <div style="font-size: 12px; margin: 5px 5px; display: inline-block">종: ${closePrice.toFixed(
            1
          )}</div>
          <div style="font-size: 12px; margin: 5px 5px; display: inline-block">고: ${highPrice.toFixed(
            1
          )}</div>
          <div style="font-size: 12px; margin: 5px 5px; display: inline-block">저: ${lowPrice.toFixed(
            1
          )}</div>
          <div style="font-size: 12px; margin: 5px 5px; display: inline-block"> ${checkGap}  (${checkPercentage}%)</div>
          </div>
          
          <div>
          <div style="font-size: 15px; margin: 5px 10px; display: inline-block; font-weight: bold">${time}</div>
          <div style="font-size: 15px; margin: 5px 5px; display: inline-block; color:#F3C5FF; font-weight:bold">${
            movingAverages[0].length + '일선'
          }</div>
          <div style="font-size: 15px; margin: 5px 5px; display: inline-block; color:#FFC75F; font-weight:bold">${
            movingAverages[1].length + '일선'
          }</div>
          <div style="font-size: 15px; margin: 5px 5px; display: inline-block; color:#00C9A7; font-weight:bold">${
            movingAverages[2].length + '일선'
          }</div>
          <div style="font-size: 15px; margin: 5px 5px; display: inline-block; color:#008CCA; font-weight:bold">${
            movingAverages[3].length + '일선'
          }</div>
          </div>`
        );
      }
    };

    chart.subscribeCrosshairMove(updateLegend);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.unsubscribeCrosshairMove(updateLegend);
      chart.remove();
    };
  }, [data, backgroundColor, textColor, symbolName]);

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <div ref={chartContainerRef} />
      <div
        id="legend"
        style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          zIndex: 1,
          fontSize: '14px',
          fontFamily: 'sans-serif',
          lineHeight: '18px',
          fontWeight: 300,
        }}
        dangerouslySetInnerHTML={{ __html: legendContent }}
      />
    </div>
  );
};

export default Candle;
