import { useState } from 'react';
import { TradeOrderProps } from '../../types/TradeOrderProps';

const TradeOrder = ({ handleClick }: TradeOrderProps) => {
  return (
    <div className="order-book">
      <div className="max-price" onClick={() => handleClick('upper_price')}>
        ↑ 96,200
      </div>

      <div className="order-wrapper-scroll">
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,900
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              1.22%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              71,420
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,800
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              1.08%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              120,860
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,700
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.95%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              83,016
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,600
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.81%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              87,378
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,500
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.68%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              66,779
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,400
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.54%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              80,134
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,300
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.41%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              75,947
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,200
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.27%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              88,954
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div className="rate-high" onClick={() => handleClick('ask_price')}>
            74,100
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-high"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.14%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              116,966
            </div>
          </div>
        </div>
        <div className="order-wrapper w-blue">
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick('closing_price')}
          >
            74,000
          </div>
          <div className="daily">
            <div
              className="daily-percent"
              onClick={() => handleClick('order_prev_percent')}
            >
              0.00%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              262,998
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,900
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.14%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              45,728
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,800
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.27%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              147,352
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,700
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.41%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              174,029
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,600
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.54%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              197,246
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,500
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.68%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              175,786
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,400
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.81%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              149,031
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,300
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -0.95%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              219,849
            </div>
          </div>
        </div>
        <div className="order-wrapper w-red">
          <div className="rate-row" onClick={() => handleClick('bid_price')}>
            73,200
          </div>
          <div className="daily">
            <div
              className="daily-percent rate-row"
              onClick={() => handleClick('order_prev_percent')}
            >
              -1.08%
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handleClick('order_quantity')}
            >
              208,541
            </div>
          </div>
        </div>
      </div>

      <div className="min-price" onClick={() => handleClick('lower_price')}>
        ↓ 51,800
      </div>
    </div>
  );
};
export default TradeOrder;
