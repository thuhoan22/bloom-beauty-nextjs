"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { getOrders } from "@/lib/order.api";

import "./AccountPage.scss";

type OrderStatus = "processing" | "shipping" | "delivered" | "canceled";

interface OrderItem {
  name: string | null;
  image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string | number;
  created_at: string;
  status: OrderStatus;
  order_items: OrderItem[];
  total: number;
}

export default function AccountOrder({ filter }: { filter: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleMap, setVisibleMap] = useState<Record<string, number>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const res = await getOrders();
      if (!res.success) {
        const msg =
          typeof (res as any).error === "string"
            ? (res as any).error
            : (res as any).error?.message || "Failed to load orders";
        setLoadError(msg);
        setOrders([]);
        return;
      }

      const data = (res.data || []) as Order[];
      setOrders(data);
      setLoadError(null);

      // init visible count = 3 cho mỗi order
      const init: Record<string, number> = {};
      data.forEach((o) => {
        init[String(o.id)] = 3;
      });
      setVisibleMap(init);
    };

    run();
  }, []);

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "is-processing";
      case "shipping":
        return "is-shipping";
      case "delivered":
        return "is-delivered";
      case "canceled":
        return "is-canceled";
      default:
        return "";
    }
  }

  const getProgressIndex = (status: OrderStatus) => {
    if (status === "canceled") return -1;
    if (status === "processing") return 0;
    if (status === "shipping") return 1;
    return 2; // delivered
  };

  const formatMoney = (n: number) => `$${n.toFixed(2)}`;

  const getFakeDeliveryInfo = (status: OrderStatus, createdAt: string) => {
    const base = new Date(createdAt);
    const addDays = (d: number) =>
      new Date(base.getTime() + d * 24 * 60 * 60 * 1000);

    if (status === "processing") {
      return `Estimated delivery: ${addDays(5).toLocaleDateString()}`;
    }
    if (status === "shipping") {
      return `Estimated delivery: ${addDays(2).toLocaleDateString()}`;
    }
    if (status === "delivered") {
      return `Delivered on: ${addDays(1).toLocaleDateString()}`;
    }
    return `Canceled on: ${addDays(0).toLocaleDateString()}`;
  };

   // filter orders
  const normalizedFilter = (filter || "").trim().toLowerCase();
  const isStatusFilter = (
    ["processing", "shipping", "delivered", "canceled"] as const
  ).includes(normalizedFilter as OrderStatus);

  const filteredOrders =
    normalizedFilter === "all" || !isStatusFilter
      ? orders
      : orders.filter((o) => o.status === (normalizedFilter as OrderStatus));

  return (
    <>
      <div className="panel-head">
        <h3 className="text-title">You orders <span>({filter})</span></h3>
      </div>
      <div className="panel-info">
        {loadError && (
          <p className="text-base" style={{ color: "crimson" }}>
            {loadError}
          </p>
        )}
        {!loadError && filteredOrders.length === 0 && (
          <p className="text-base">No orders found.</p>
        )}
        <ul className="order-list">
          {filteredOrders.map(order => {
            const orderId = String(order.id);
            const visible = visibleMap[orderId] || 3;
            const remaining = (order.order_items?.length || 0) - visible;
            const progressIndex = getProgressIndex(order.status);
            const shippingFee = 0;
            const subtotal = order.total / 1.08;
            const tax = order.total - subtotal;

            return (
              <li
                key={orderId}
                className={`order-item ${getStatusClass(order.status)}`}
              >
                {/* HEAD */}
                <div className="order-head">
                  <p className="text-base">
                    <em>Order No. {orderId}</em>
                    {/* {new Date(order.created_at).toLocaleString()} */}
                  </p>

                  <div className="text-other custom-col">
                    <span className="text-status custom-row-last">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="order-progress">
                  {order.status === "canceled" ? (
                    <p className="text-base">Order canceled</p>
                  ) : (
                    <ul className="progress-steps">
                      {["processing", "shipping", "delivered"].map((s, idx) => (
                        <li
                          key={s}
                          className={`progress-steps-item ${idx <= progressIndex ? "is-done" : ""}`}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ITEMS */}
                <div className="order-content">
                  <ul className="product-list">
                    {order.order_items.slice(0, visible).map((item, idx) => (
                      <li key={idx} className="product-item">
                        <div className="box-left">
                          <div className="thumb">
                            <Image
                              src={item.image || "/assets/images/placeholder.png"}
                              alt={item.name || "Product"}
                              width={100}
                              height={100}
                            />
                          </div>
                          <div className="info">
                            <strong className="info-name">
                              {item.name || "Unnamed product"}
                            </strong>
                          </div>
                        </div>

                        <div className="box-right custom-col">
                          <div className="item-each">
                            <span className="quantity custom-row-mid">
                              {item.quantity} Pcs
                            </span>
                            <div className="cost custom-row-last">
                              ${item.price}
                            </div>
                          </div>

                          <div className="item-total">
                            <span className="total-text custom-row-mid">
                              Total:
                            </span>
                            <span className="total-value custom-row-last">
                              ${item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SHOW MORE */}
                {remaining > 0 && (
                  <div className="btn-area">
                    <button
                      type="button"
                      className="btn btn-primary btn-show"
                      onClick={() =>
                        setVisibleMap(prev => ({
                          ...prev,
                          [orderId]: order.order_items.length,
                        }))
                      }
                    >
                      Show More (+{remaining} items)
                    </button>
                  </div>
                )}

                {/* SUMMARY */}
                <div className="order-summary">
                  <div className="order-summary-left">
                    <p className="text-base">{getFakeDeliveryInfo(order.status, order.created_at)}</p>
                    <p className="text-base">Payment: Cash on delivery (COD)</p>
                  </div>
                  <div className="order-summary-right custom-col">
                    <div className="text-item">
                      <span className="text custom-row-mid">Subtotal</span>
                      <span className="text custom-row-last">
                        {formatMoney(subtotal)}
                      </span>
                    </div>
                    <div className="text-item">
                      <span className="text custom-row-mid">Shipping</span>
                      <span className="text custom-row-last">
                        {formatMoney(shippingFee)}
                      </span>
                    </div>
                    <div className="text-item">
                      <span className="text custom-row-mid">Tax</span>
                      <span className="text custom-row-last">
                        {formatMoney(tax)}
                      </span>
                    </div>
                    <div className="text-item">
                      <span className="text custom-row-mid">Total</span>
                      <span className="text custom-row-last">
                        <em>{formatMoney(order.total)}</em>
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}