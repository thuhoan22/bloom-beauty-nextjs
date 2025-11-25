"use client"

import { useState } from "react";
import Image from "next/image";
import { products } from "@/data/products";

export default function AccountOrder({ filter }: { filter: string }) {
  const [visibleCount, setVisibleAcount] = useState(3);

  const total = products.length;
  const remaining = total - visibleCount;
  const showMore = () => {
    setVisibleAcount(total);
  }
  return (
    <>
      <h3 className="text-title">You orders <span>({filter})</span></h3>
      <div className="info-main">
        <ul className="order-list">
          <li className="order-item is-cancel">
            <div className="order-head">
              <p className="text-base"><em>Order No. 167749-0500</em>, february 27, 2023 12:42 pm</p>
              <div className="text-other custom-col">
                <span className="text-process custom-row-mid">In processing</span>
                <span className="text-status custom-row-last">cancel</span>
              </div>
            </div>
            <div className="order-content">
              <ul className="product-list">
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-015.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Soft Finish</strong>
                      <span className="info-desc">All Around Safe Block Sun Milk SPF50+/PA+++</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-015.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Lip Glowy Balm</strong>
                      <span className="info-desc">A lightweight, moisture-rich lip balm powered by Korean skincare.</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-015.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Firm & Lift Anti-Aging Program</strong>
                      <span className="info-desc">Numbers don't lie. 40M bottles sold, Global no.1 Facial Mist provides instant hydration and a stunning glow. Whether used before or after makeup/spf, enjoy the luxurious boost.</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-027.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Firm & Lift Anti-Aging Program</strong>
                      <span className="info-desc">Numbers don't lie. 40M bottles sold, Global no.1 Facial Mist provides instant hydration and a stunning glow. Whether used before or after makeup/spf, enjoy the luxurious boost.</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="btn-area">
              <button type="button" className="btn btn-primary btn-show">Show More (+2 items)</button>
              {/* <button type="button" className="btn btn-primary btn-show" onClick={showMore}>Show More (+{remaining} items)</button> */}
            </div>
            <div className="order-summary">
              <p className="text-base">Delivery date: february 27, 2023 12:42 pm</p>
              <div className="text-other custom-col">
                <div className="text-other-item">
                  <span className="text custom-row-mid">Total</span>
                  <span className="text custom-row-last">$140.00</span>
                </div>
                <div className="text-other-item">
                  <span className="text custom-row-mid">Delivery</span>
                  <span className="text custom-row-last">0</span>
                </div>
                <div className="text-other-item text-other-total">
                  <span className="text custom-row-mid">Total</span>
                  <span className="text custom-row-last">$140.00</span>
                </div>
              </div>
            </div>
          </li>
          <li className="order-item is-deliverd">
            <div className="order-head">
              <p className="text-base"><em>Order No. 167749-0500</em>, february 27, 2023 12:42 pm</p>
              <div className="text-other custom-col">
                <span className="text-status custom-row-last">Deliverd</span>
              </div>
            </div>
            <div className="order-content">
              <ul className="product-list">
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-015.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Soft Finish</strong>
                      <span className="info-desc">All Around Safe Block Sun Milk SPF50+/PA+++</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-015.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Lip Glowy Balm</strong>
                      <span className="info-desc">A lightweight, moisture-rich lip balm powered by Korean skincare.</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-015.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Firm & Lift Anti-Aging Program</strong>
                      <span className="info-desc">Numbers don't lie. 40M bottles sold, Global no.1 Facial Mist provides instant hydration and a stunning glow. Whether used before or after makeup/spf, enjoy the luxurious boost.</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="btn-area">
              <button type="button" className="btn btn-primary btn-show">Show More (+2 items)</button>
            </div>
            <div className="order-summary">
              <p className="text-base">Delivery date: february 27, 2023 12:42 pm</p>
              <div className="text-other custom-col">
                <div className="text-other-item">
                  <span className="text custom-row-mid">Total</span>
                  <span className="text custom-row-last">$140.00</span>
                </div>
                <div className="text-other-item">
                  <span className="text custom-row-mid">Delivery</span>
                  <span className="text custom-row-last">0</span>
                </div>
                <div className="text-other-item text-other-total">
                  <span className="text custom-row-mid">Total</span>
                  <span className="text custom-row-last">$140.00</span>
                </div>
              </div>
            </div>
          </li>
          <li className="order-item is-canceled">
            <div className="order-head">
              <p className="text-base"><em>Order No. 167749-0500</em>, february 27, 2023 12:42 pm</p>
              <div className="text-other custom-col">
                <span className="text-status custom-row-last">Canceled</span>
              </div>
            </div>
            <div className="order-content">
              <ul className="product-list">
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-013.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Soft Finish</strong>
                      <span className="info-desc">All Around Safe Block Sun Milk SPF50+/PA+++</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
                <li className="product-item">
                  <div className="box-left">
                    <div className="thumb">
                      <Image 
                        src="/images/product-020.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">Lip Glowy Balm</strong>
                      <span className="info-desc">A lightweight, moisture-rich lip balm powered by Korean skincare.</span>
                      <span className="info-code">Product code: 10896</span>
                    </div>
                  </div>
                  <div className="box-right custom-col">
                    <div className="item-each">
                      {/* 2 Pcs = 2 pieces */}
                      <span className="quantity custom-row-mid">2 Pcs</span>
                      <div className="cost custom-row-last">$19.60</div>
                    </div>
                    <div className="item-total">
                      <span className="total-text custom-row-mid">Total:</span>
                      <span className="total-value custom-row-last">$39.20</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="btn-area">
              <button type="button" className="btn btn-primary btn-show">Show More (+2 items)</button>
            </div>
            <div className="order-summary">
              <p className="text-base">Delivery date: february 27, 2023 12:42 pm</p>
              <div className="text-other custom-col">
                <div className="text-other-item">
                  <span className="text custom-row-mid">Total</span>
                  <span className="text custom-row-last">$140.00</span>
                </div>
                <div className="text-other-item">
                  <span className="text custom-row-mid">Delivery</span>
                  <span className="text custom-row-last">0</span>
                </div>
                <div className="text-other-item text-other-total">
                  <span className="text custom-row-mid">Total</span>
                  <span className="text custom-row-last">$140.00</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}