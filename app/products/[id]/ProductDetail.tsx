"use client";

import { useState, useEffect  } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductGallery from "@/components/ProductGallery";
import RatingDisplay from "@/components/RatingDisplay";
import RecentlyViewed from "@/components/RecentlyViewed";

import "./ProductDetail.scss";

interface ProductDetailProps {
  id: number;
}

export default function ProductDetail({ id }: ProductDetailProps) {
  // const skinIcons: Record<string, string> = {
  //   "All Skin Types": "/images/svg/icon-skin-all.svg",
  // };

  // const getSkinIcon = (skinType: string) =>
  //   skinIcons[skinType] || "/images/svg/icon-skin-type.svg";

  const getSkinIcon = (skinType: string) =>
  skinType === "All Skin Types" ? "/images/svg/icon-skin-all.svg" : "/images/svg/icon-skin-type.svg";

  const product = products.find((p) => p.id === id);

  if (!product) return notFound();

  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(id)
  };

  // vì dùng dangerouslySetInnerHTML nên phải ép kiểu này
  useEffect(() => {
    const accordionButtons = document.querySelectorAll('.accordion-item .btn-text');

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const item = target.closest('.accordion-item');
      if (!item) return;

      item.classList.toggle('is-open');
    };

    accordionButtons.forEach(btn => btn.addEventListener('click', handleClick));

    // cleanup khi unmount
    return () => {
      accordionButtons.forEach(btn => btn.removeEventListener('click', handleClick));
    };
  }, []);

  return (
    <main className="main-content product-detail-page">
      <div className="inner">
        <div className="detail-wrap">
          <div className="detail-thumb">
            {/* <ProductGallery images={product.images ?? []} alt={product.name} /> */}
            <ProductGallery imageSlide={Array.isArray(product.details.imageSlide) ? product.details.imageSlide : [product.details.imageSlide]} alt={product.name} />
          </div>
          <div className="detail-info">
            <h1 className="text-title">{product.name}</h1>
            <RatingDisplay rating={product.rating} />
            <p className="text-price">
              {product.sale > 0 ? (
                <>
                  <span className="sale-price">
                    ${(product.price * (1 - product.sale / 100)).toLocaleString()}
                  </span>
                  {/* <span className="original-price">
                    ${product.price.toLocaleString()}
                  </span> */}
                </>
              ) : (
                <span>${product.price.toLocaleString()}</span>
              )}
            </p>
            <p className="text-desc">{product.details.fullDesc}</p>
            <span className="text-size">Size: {product.details.size}</span>
            <div className="text-recommend">
              <strong>RECOMMENDED FOR</strong>
              <ul className="skin-type-list">
                {product.details.typeSkin.map((type, index) => (
                  <li className="skin-type-item" key={index}>
                    <Image 
                      src={getSkinIcon(type)}
                      alt={type}
                      width={20}
                      height={20}
                    />
                    <span>{type}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-secondary btn-add"
              // onClick={() => console.log("Add to cart:", product.id)}
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            {product.details?.moreInfo && (
              <div 
                className="more-info"
                dangerouslySetInnerHTML={{ __html: String(product.details.moreInfo) }}
              />
            )}
          </div>
        </div>
        <RecentlyViewed />
      </div>
    </main>
  );
}
