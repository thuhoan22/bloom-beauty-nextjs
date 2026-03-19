"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AboutUsContent from "./AboutUsContent"
import ShippingReturn from "./ShippingReturn"
import ContactUs from "./ContactUs"
import FAQ from "./FAQ"

gsap.registerPlugin(ScrollTrigger);

import "./AboutUs.scss";

export default function AboutUs() {
  const thumb01Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".thumb-01", {
      scrollTrigger: {
        trigger: thumb01Ref.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
    });
  }, []);

  return (
    <main className="main-content about-page">
      <section className="key-visual">
        <div className="key-visual-box">
          <strong className="key-visual-title">ITALIAN LUXURY <br/> WITH A MODERN EDGE</strong>
        </div>
      </section>
      <section className="section our-born">
        <div className="inner">
          <div className="section-head">
            <strong className="text-title">BORN TO GLOW</strong>
            <p className="text-desc">d'Alba is premium skincare for the effortlessly bold, <br/>where classic Italian elegance meets modern chic attitude.</p>
          </div>
          <div className="section-content">
            <div className="image">
              <Image 
                src="/images/about-003.png"
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="info">
              <p className="text-desc">
                In a world full of noise, we believe in quiet confidence. Not the kind that tries to impress, <br/>
                but the kind that simply is. At d'Alba, luxury is redefined through intention. Clean formulas. <br/>
                Elegant textures. Proven results. Inspired by the tranquil beauty of Alba, Italy, and <br/>
                powered by advanced Korean innovation, we create glow-driven formulas designed to <br/>
                empower you with unapologetic confidence and an undeniable presence.
              </p>
              <p className="text-desc">
                We don't believe in overcomplicating beauty. We believe in routines that feel effortless <br/>
                and results that speak for themselves. For the modern individual who values substance, <br/>
                style, and skin that reflects both—this is your daily dose of understated edge. With <br/>
                d'Alba, you're not just seen. You're unforgettable.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section our-mantra">
        <div className="inner">
          <div className="section-head">
            <strong className="text-title">Our Mantra</strong>
          </div>
          <div className="section-content">
            <div className="item-group">
              <div className="info">
                <span className="text-desc"><em className="text-italic">Glow</em> is our <em className="text-uppercase">SIGNATURE.</em></span>
                <span className="text-desc"><em className="text-italic">Confidence</em> is our <em className="text-uppercase">POWER.</em></span>
              </div>
              <div className="image">
                <div className="thumb thumb-01" ref={thumb01Ref}>
                  <Image 
                    src="/images/@tmp-banner-003.png"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="thumb thumb-02">
                  <Image 
                    src="/images/@tmp-popup-001.png"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="thumb thumb-03">
                  <Image 
                    src="/images/@tmp-popup-002.jpg"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            <div className="item-group">
              <div className="image">
                <div className="thumb">
                  <Image 
                    src="/images/@tmp-banner-002.jpg"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="info">
                <span className="text-desc">
                  We wear <em className="text-italic">Skincare</em><br />
                  the way <em className="text-uppercase">OTHERS</em> wear <em className="text-italic">Heels.</em>
                </span>
              </div>
            </div>
            <div className="item-group">
              <div className="image">
                <div className="thumb">
                  <Image 
                    src="/images/blog-008.webp"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="info">
                <span className="text-desc">
                  <em className="text-italic">Luxury</em> comes from<br />
                  everyday <em className="text-uppercase">SELF-CARE</em> with <em className="text-italic">Intention.</em>
                </span>
              </div>
              <div className="image image-right">
                <div className="thumb">
                  <Image 
                    src="/images/@tmp-banner-001.jpg"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            <div className="item-group">
              <div className="info">
                <span className="text-desc">
                  We don't chase
                  <em className="text-uppercase"> PERFECTION.</em>
                </span>
                <span className="text-desc">
                  We celebrate skin that's
                  <em className="text-italic"> Authentic, <br/>Unfiltered, </em>
                  and <em className="text-italic">Unapologetically Real.</em>
                </span>
              </div>
              <div className="image">
                <div className="thumb">
                  <Image 
                    src="/images/about-002.jpg"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            <div className="item-group">
              <div className="image">
                <div className="thumb">
                  <Image 
                    src="/images/blog-001.webp"
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="info">
                <span className="text-desc">
                  We <em className="text-italic">Mist.</em> 
                  We <em className="text-italic">Move.</em> We <em className="text-uppercase">OWN</em> the <em className="text-italic">Moment.</em>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="our-strory">

      </section>
    </main>
  )
}
