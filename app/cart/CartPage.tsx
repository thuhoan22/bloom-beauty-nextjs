"use client"

import { useState, useEffect  } from "react";
import { getProducts } from "@/lib/product.api";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ModalConfirm from "@/components/ModalConfirm"

import "./CartPage.scss";

export default function CartPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const { cartItems, updateItemQuantity, removeFromCart } = useCart();
  const { cartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const cartData = cartItems
    .map((cartItem) => {
      // const product = products.find((p) => p.id === cartItem.id);
      const product = products.find((p) => p.id === cartItem.product_id);

      if (!product) return null; 

      return {
        ...cartItem,
        ...product,
        cartItemId: cartItem.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        total: product.price * cartItem.quantity,
      };
    })
    .filter(Boolean);

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
  const handleConfirmRemove = async () => {
    if (!removeId) return;

    await removeFromCart(removeId);
    setRemoveId(null); // đóng popup
  };

  return (
    <>
      <main className="main-content cart-page">
        <div className="inner">
          <div className="box-head">
            <strong className="text-title">Shopping Cart</strong>
            <span className="text-desc">{cartCount} items in your cart</span>
          </div>
          {cartCount > 0 && (
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
                              onClick={() => handleDecrease(item.cartItemId, item.quantity)}
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
                              onClick={() => handleIncrease(item.cartItemId, item.quantity)}
                            >
                              <span className="icon-plus"></span>
                            </button>
                          </div>
                        </div>
                        <span className="total-final">${item.total}</span>
                        <button 
                          type="button" 
                          className="btn-remove"
                          onClick={() => setRemoveId(item.cartItemId)}
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
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-checkout"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                  <Link href="/products" className="btn-continue-shoping" target="_blank">Continue Shopping</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {removeId && (
        <ModalConfirm
          isOpen={true}
          textConfirm={
            <>
              Do you want to remove this product?
            </>
          }
          onCancel={() => setRemoveId(null)}
          onConfirm={() => handleConfirmRemove()}
        />
      )}
    </>
  )
}
