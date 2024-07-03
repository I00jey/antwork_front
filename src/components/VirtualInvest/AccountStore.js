import { createStore } from 'redux';
import accountReducer from '../VirtualInvest/AccountReducer';

const AccountStore = createStore(accountReducer);

export default AccountStore;
