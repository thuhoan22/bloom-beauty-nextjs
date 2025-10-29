"use client";

import { useCart } from "../context/CartContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import Image from "next/image";
import Link from "next/link";
import RatingDisplay from "@/components/RatingDisplay";

import "./ProductCard.scss";

interface ProductCardProps {
  id: number;
  name: string;
  desc: string;
  price: number;
  sale: number;
  rating: number;
  image: string;
};

export default function ProductCard({ id, name, desc, price, sale, rating, image }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(id)
  };

  const { addViewed } = useRecentlyViewed();

  return (
    <div className="card">
      <div className="thumb">
        <Link href={`/products/${id}`} onClick={() => addViewed(id)}>
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="card-image"
          />
        </Link>
      </div>
      <div className="card-info">
        {sale > 0 && (
          <p className="label-sale">-{sale.toLocaleString()}%</p>
        )}
        <div className="text-wrap">
          <h3 className="text-title">{name}</h3>
          <RatingDisplay rating={rating} />
          <span className="text-desc">{desc}</span>
          {/* <p className="text-price">${price.toLocaleString()}</p> */}
          <p className="text-price">
              {sale > 0 ? (
                <>
                  <span className="sale-price">
                    ${(price * (1 - sale / 100)).toLocaleString()}
                  </span>
                  <span className="original-price">
                    ${price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span>${price.toLocaleString()}</span>
              )}
            </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn btn-add"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
