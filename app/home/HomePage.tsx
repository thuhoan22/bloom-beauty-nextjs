"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NewArrivals from "@/components/NewArrivals";
import BestSeller from "@/components/BestSeller";
import OnTheBlog from "@/components/OnTheBlog";
import SharePost from "@/components/SharePost";

gsap.registerPlugin(ScrollTrigger);

import "./HomePage.scss";

export default function Home() {
  useGSAP(() => {
    const thumbs = gsap.utils.toArray<HTMLElement>(".kits-item .thumb");

    thumbs.forEach((thumb) => {
      gsap.from(thumb, {
        scrollTrigger: {
          trigger: thumb,
          start: "top 0%",
          toggleActions: "play none none none", 
        },
        y: 80,          // từ dưới lên
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
      });
    });
  }, []);

  return (
    <main className="main home-page">
      <div className="key-visual">
        <div className="inner">
          <div className="key-visual-content">
            <strong className="text-title">Discover your inner beauty <br/>with Blossom Glow Kit</strong>
            <span className="text-desc">Great gift for yourself and loved ones</span>
            <Link href="/products" className="btn btn-secondary btn-shop">Shop Now</Link>
          </div>
        </div>
      </div>
      <div className="section section-new-arrivals">
        <div className="inner">
          <NewArrivals />
        </div>
      </div>
      <div className="section section-best-sellers">
        <div className="inner">
          <BestSeller />
        </div>
      </div>
      <div className="section section-kits">
        <div className="inner">
          <div className="kits-list">
            <div className="kits-item">
              <div className="kits-info">
                <div className="text-wrap">
                  <h3 className="text-title">Blossom Glow Kit</h3>
                  <span className="text-desc">Reveal your skin's natural glow with our Lotus Glow Kit. Nourishing body and face creams with lotus extract provide deep hydration and rejuvenation. Suitable for all skin types. Vegan, cruelty-free, eco-friendly.</span>
                  <div className="tag-group">
                    <span className="text-tag"># GreatGift</span>
                    <span className="text-tag"># AntiAging</span>
                    <span className="text-tag"># Ingredients</span>
                  </div>
                </div>
                <div className="btn-group">
                  <Link href="#none" className="btn btn-secondary btn-buy">Shop now</Link>
                  <Link href="#none" className="btn btn-primary btn-arrow">Explore more</Link>
                </div>
              </div>
              <div className="thumb">
                <Image
                  src="/images/img-kit-01.png"
                  alt="Blossom Glow Kit"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="kits-item">
              <div className="kits-info">
                <div className="text-wrap">
                  <h3 className="text-title">Floral Essence Masks Sets</h3>
                  <span className="text-desc">Indulge in the beauty of nature with our Floral Essence Masks set. Each mask features a unique blend of flower extracts to hydrate and nourish your skin. Experience the essence of flowers in your skincare routine.</span>
                  <div className="tag-group">
                    <span className="text-tag"># GreatGift</span>
                    <span className="text-tag"># AntiAging</span>
                    <span className="text-tag"># Ingredients</span>
                  </div>
                </div>
                <div className="btn-group">
                  <Link href="#none" className="btn btn-secondary btn-buy">Shop now</Link>
                  <Link href="#none" className="btn btn-arrow btn-more">Explore more</Link>
                </div>
              </div>
              <div className="thumb">
                <Image
                  src="/images/img-kit-02.png"
                  alt="Floral Essence Masks Sets"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-blogs">
        <div className="inner">
          <OnTheBlog />
        </div>
      </div>
      <div className="section section-skin-quiz">
        <div className="inner">
          <div className="skin-quiz-content">
            <div className="image-box">
              <Image
                src={'/images/img-quiz-01.png'}
                alt={''}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="info-box">
              <strong className="quiz-title">The Skin Quiz</strong>
              <p className="quiz-desc">Meet the quiz that will curate a routine just as unique as you are.</p>
              <Link href="#none" className="btn btn-secondary btn-explore">Explore more</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-tips-share">
        <div className="inner">
          <SharePost />
        </div>
      </div>
    </main>
  );
}
