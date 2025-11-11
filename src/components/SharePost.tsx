"use client";

import Link from "next/link";
import Image from "next/image";

import "./SharePost.scss";

export default function SharePost() {
  const shareImageList = [
    {
      id: 1,
      imgUrl: "/images/img-share-01.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 2,
      imgUrl: "/images/img-share-02.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 3,
      imgUrl: "/images/img-share-03.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 4,
      imgUrl: "/images/img-share-04.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 5,
      imgUrl: "/images/img-share-05.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 6,
      imgUrl: "/images/img-share-06.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 7,
      imgUrl: "/images/img-share-07.png",
      imgInfo: "EcoFriendly our Lotus",
    },
    {
      id: 8,
      imgUrl: "/images/img-share-08.png",
      imgInfo: "EcoFriendly our Lotus",
    },
  ];
  return (
    <div className="product-section share-post">
      <div className="box-head">
        <strong className="text-title">Share  how you blossomed with <em>#bloombeauty</em></strong>
        <div className="btn-box">
          <Link href="#none" className="btn-all">see all</Link>
        </div>
      </div>
      <div className="box-content">
        <ul className="share-post-list">
          {shareImageList.map((item, index) => (
            <li className="share-post-item" key={index}>
              <span className="thumb">
                <Image 
                  src={item.imgUrl} 
                  alt={item.imgInfo} 
                  width={289}
                  height={289}
                />
              </span>
              <div className="btn-group">
                <Link href="#none" className="btn btn-see">
                  <span className="text">See In</span>
                  <span className="icon-instagram">
                    <Image 
                      src="/images/svg/icon-instagram.svg" 
                      alt="Instagram"
                      width={15}
                      height={15}
                    />
                  </span>
                </Link>
                <Link href="#none" className="btn btn-secondary btn-buy">Buy Now</Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="btn-box">
          <Link href="#none" className="btn btn-secondary btn-follow">Follow us</Link>
        </div>
      </div>
    </div>
  )
}
