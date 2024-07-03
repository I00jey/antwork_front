// 계좌
export const setAccount = (account) => ({
  type: 'SET_ACCOUNT',
  payload: account,
});

// 총 보유 주식 수
export const setStock = (stock) => ({
  type: 'SET_STOCK',
  payload: stock,
});

// 손익 저장
export const setProfit = (profit) => ({
  type: 'SET_PROFIT',
  payload: profit,
});

// 평단가
export const setPurchasePrice = (price) => ({
  type: 'SET_PURCHASE_PRICE',
  payload: price,
});
