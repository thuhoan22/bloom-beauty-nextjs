"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { createOrder } from "@/lib/order.api";
import { getLocation } from "@/lib/location.api";
import { supabase } from "@/lib/supabase";

import "./Ordering.scss";

interface Ward {
  name: string;
  code: number;
}

interface District {
  name: string;
  code: number;
  wards: Ward[];
}

interface Province {
  name: string;
  code: number;
  districts: District[];
}

export default function Ordering() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [form, setForm] = useState({
    name: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    getLocation().then(setProvinces);
  }, []);

  // Khi chọn Tỉnh → load Quận
  useEffect(() => {
    if (!form.province) return;

    const selected = provinces.find(
      (p) => p.name === form.province
    );

    setDistricts(selected?.districts || []);

    setForm((prev) =>
      prev.district || prev.ward
        ? { ...prev, district: "", ward: "" }
        : prev
    );
  }, [form.province, provinces]);

  // Khi chọn Quận → load Phường
  useEffect(() => {
    const selected = districts.find(
      (d) => d.name === form.district
    );

    setWards(selected?.wards || []);
    setForm((prev) => ({ ...prev, ward: "" }));
  }, [form.district, districts]);

  // submit
  const handleSubmit = async () => {
    const { name, province, district, ward, address, phone } = form;

    if (!name || !province || !district || !ward || !address || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await createOrder({
      customer: form,
      items: cartItems,
      payment_method: paymentMethod,
    });

    if (res.success) {
      toast.success("Order placed successfully!");

      await supabase
        .from("cart_items")
        .delete()
        .in(
          "product_id",
          cartItems.map((item) => item.product_id)
        );

      clearCart(); 
      
      setTimeout(() => {
        router.push("/products");
      }, 100);
    } else {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="main-content checkout-page">
      <div className="inner">
        <div className="box-panel">
          <div className="panel-head">
            <h3 className="text-title">Contact information</h3>
          </div>
          <div className="panel-info">
            <ul className="info-list form-list">
              <li className="info-item info-item-col">
                <div className="col">
                  <label htmlFor="name" className="label">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="input" 
                    value={form.name}
                    placeholder="Full Name"
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                <div className="col">
                  <label htmlFor="phone" className="label">Phone</label>
                  <input 
                    type="tel"
                    id="phone" 
                    name="phone"
                    className="input" 
                    value={form.phone}
                    placeholder="Phone"
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </li>
              <li className="info-item info-item-col">
                <div className="col">
                  <span className="label">Province/City</span>
                  <select
                    className="input" 
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                  >
                    <option value="">Province/City</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <span className="label">District</span>
                  <select
                    className="input" 
                    value={form.district}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value })
                    }
                    disabled={!form.province}
                  >
                    <option value="">District</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <span className="label">Ward</span>
                  <select
                    className="input" 
                    value={form.ward}
                    onChange={(e) =>
                      setForm({ ...form, ward: e.target.value })
                    }
                    disabled={!form.district}
                  >
                    <option value="">Ward</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
              <li className="info-item">
                <label htmlFor="address" className="label">Address</label>
                <input 
                  type="text"
                  id="address" 
                  name="address"
                  className="input" 
                  value={form.address}
                  placeholder="Address"
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </li>

              <li className="info-item">
                <span className="label">Payment method</span>
                <div className="payment-method">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span className="checkbox-label">Cash on delivery (COD)</span>
                  </label>

                  <label className="payment-option" aria-disabled="true">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      disabled
                    />
                    <span className="checkbox-label">Card payment (coming soon)</span>
                  </label>
                </div>
              </li>
            </ul>
            <button 
              type="button" 
              className="btn btn-secondary btn-order"
              onClick={handleSubmit} disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
