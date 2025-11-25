"use client"

import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

import "./CartPage.scss";

interface CartItem {
  id: number;
  quantity: number;
}

export default function CartPage() {
  const { cartItems, updateItemQuantity, removeFromCart } = useCart();

  const cartData = cartItems.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    return {
      ...cartItem,
      ...product,
      quantity: cartItem.quantity,
      total: product ? product.price * cartItem.quantity : 0,
    };
  });

  const subtotal = cartData.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Update quantity
  const handleIncrease = (id: number, qty: number) => {
    updateItemQuantity(id, qty + 1);
  };
  
  const handleDecrease = (id: number, qty: number) => {
    if (qty > 1) updateItemQuantity(id, qty - 1);
    else removeFromCart(id);
  };

  // Remove item
  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  return (
    <main className="main-content cart-page">
      <div className="inner">
        <div className="box-head">
          <strong className="text-title">Shopping Cart</strong>
          <span className="text-desc">{cartItems.length} items in your cart</span>
        </div>
        <div className="box-content">
          <div className="order-box">
            <ul className="order-list">
              {cartData.map((item) => (
                <li className="order-item" key={item.id}>
                  <div className="order-item-left">
                    <div className="thumb">
                      <Image 
                        src={item.image}
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="info">
                      <strong className="info-name">{item.name}</strong>
                      <span className="info-price">${item.price}</span>
                    </div>
                  </div>
                  <div className="order-item-right">
                    <div className="input-box">
                      <div className="counter">
                        <button 
                          type="button" 
                          className="btn-counter btn-minus"
                          onClick={() => handleDecrease(item.id, item.quantity)}
                        >
                          <span className="icon-minus"></span>
                        </button>
                        <input 
                          type="number" 
                          id="counter-number"
                          className="input-counter"
                          placeholder="0"
                          min="0"
                          value={item.quantity}
                          aria-label="Label"
                          readOnly
                        />
                        <button 
                          type="button" 
                          className="btn-counter btn-plus"
                          onClick={() => handleIncrease(item.id, item.quantity)}
                        >
                          <span className="icon-plus"></span>
                        </button>
                      </div>
                    </div>
                    <span className="total-final">${item.total}</span>
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      <span className="icon-remove"></span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="summary-box">
            <div className="summary">
              <strong className="summary-title">Order Summary</strong>
              <ul className="summary-list">
                <li className="summary-item">
                  <span className="key">Subtotal</span>
                  <span className="value">${subtotal.toFixed(2)}</span>
                </li>
                <li className="summary-item">
                  <span className="key">Tax</span>
                  <span className="value">${tax.toFixed(2)}</span>
                </li>
                <li className="summary-item summary-total">
                  <span className="key">Total</span>
                  <span className="value">${total.toFixed(2)}</span>
                </li>
              </ul>
              <button type="button" className="btn btn-secondary btn-checkout">Proceed to Checkout</button>
              <Link href="/" className="btn-continue-shoping">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
