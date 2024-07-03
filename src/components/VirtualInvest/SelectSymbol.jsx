import React, { useEffect, useState } from 'react';

const SelectSymbol = ({ setSymbol }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(() => {
    // 페이지 로드 시 localStorage에서 값을 불러옴
    const storedSymbol = localStorage.getItem('selectedSymbol');
    return storedSymbol || 'BTCUSDT'; // 기본값은 'BTCUSDT'
  });

  const selectSymbol = (e) => {
    const sel = e.target.value;
    setSelectedSymbol(sel);
    setSymbol(sel);
    // 선택된 심볼을 localStorage에 저장
    localStorage.setItem('selectedSymbol', sel);
    window.location.reload();
  };

  return (
    <div className="symbol-Box">
      <label>투자 종목 선택</label>
      <select onChange={selectSymbol} value={selectedSymbol}>
        <option value="BTCUSDT">BTCUSDT</option>
        <option value="ETHUSD">ETHUSD</option>
        <option value="XRPUSDT">XRPUSDT</option>
        <option value="MATICUSDT">MATICUSDT</option>
        <option value="AXSUSDT">AXSUSDT</option>
      </select>
    </div>
  );
};

export default SelectSymbol;
