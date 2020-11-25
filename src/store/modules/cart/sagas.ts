import { all, takeLatest, select, call, put } from 'redux-saga/effects';
import { addProductToCartFailure, addProductToCartRequest, addProductToCartSuccess } from './actions';

import { IState } from './../../index';
import api from '../../../services/api';
import { AxiosResponse } from 'axios';

type CheckProductStockRequest = ReturnType<typeof addProductToCartRequest>;
interface IStockResponse {
  id: number;
  quantity: number;
} 

function* checkProductStock({payload}: CheckProductStockRequest) {
  const { product } = payload;

  const currentQuantity: number = yield select((state: IState) => {
    return state.cart.items.find(item => item.product.id === product.id)?.quantity ?? 0;
  });

  const availablesStockResponse: AxiosResponse<IStockResponse> = 
    yield call(api.get, `stock/${product.id}`);

  if (availablesStockResponse.data.quantity > currentQuantity) {
    yield put(addProductToCartSuccess(product));
  } else {
    yield put(addProductToCartFailure(product.id));
  }
}

export default all([
  takeLatest('ADD_PRODUCT_TO_CART_REQUEST', checkProductStock)
]); 