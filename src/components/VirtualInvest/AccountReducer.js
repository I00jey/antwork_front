const initialState = {
  account: 3000000, //초기 자본 설정
  stock: 0,
  profit: 0,
  purchasePrice: 0,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };
    case 'SET_STOCK':
      return { ...state, stock: action.payload };
    case 'SET_PROFIT':
      return { ...state, profit: action.payload };
    case 'SET_PURCHASE_PRICE':
      return { ...state, purchasePrice: action.payload };
    default:
      return state;
  }
};

export default accountReducer;
