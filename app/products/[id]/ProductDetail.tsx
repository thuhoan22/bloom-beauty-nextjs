"use client";

import { useState, useEffect  } from "react";
import { useCart } from "@/context/CartContext";
import { notFound, useParams } from "next/navigation";
import { getProductById } from "@/lib/product.api";
import Image from "next/image";
import ProductGallery from "@/components/ProductGallery";
import RatingDisplay from "@/components/RatingDisplay";
import RecentlyViewed from "@/components/RecentlyViewed";

import "./ProductDetail.scss";

interface ProductDetailProps {
  id: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  const { addToCart } = useCart();

  // icon skin type
  const getSkinIcon = (skinType?: string) =>
    skinType === "All Skin Types"
      ? "/images/svg/icon-skin-all.svg"
      : "/images/svg/icon-skin-type.svg";

  // fetch product
  useEffect(() => {
    if (!id) return;

    getProductById(Number(id)).then(setProduct);
  }, [id]);

  // accordion (fix cho HTML từ Supabase)
  useEffect(() => {
    if (!product) return;

    const buttons = document.querySelectorAll(".accordion-item .btn-text");

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const item = target.closest(".accordion-item");
      if (!item) return;

      item.classList.toggle("is-open");
    };

    buttons.forEach((btn) => btn.addEventListener("click", handleClick));

    return () => {
      buttons.forEach((btn) => btn.removeEventListener("click", handleClick));
    };
  }, [product]);

  // loading
  if (!product) return <p>Loading...</p>;

  const handleAddToCart = () => {
    addToCart(product.id);
  };

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
            <p className="text-desc">{product?.product_details?.full_desc}</p>
            <span className="text-size">Size: {product?.product_details?.size}</span>
            <div className="text-recommend">
              <strong>RECOMMENDED FOR</strong>
              <ul className="skin-type-list">
                {(product?.details?.typeSkin ?? []).map((type: string, index: number) => (
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
            {product.product_details?.more_info && (
              <div 
                className="more-info"
                dangerouslySetInnerHTML={{ __html: String(product.product_details.more_info) }}
              />
            )}
          </div>
        </div>
        <RecentlyViewed />
      </div>
    </main>
  );
}
