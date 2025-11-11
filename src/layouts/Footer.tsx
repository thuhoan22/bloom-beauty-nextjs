"use client";

import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="inner">
        <div className="sns-area">
          <ul className="sns-list">
            <li className="sns-item">
              <Link href="#none" className="sns-link">
                <Image
                  src="/images/svg/icon-sns-facebook.svg"
                  alt="Icon Facebook"
                  width={30}
                  height={30}
                />
              </Link>
            </li>
            <li className="sns-item">
              <Link href="#none" className="sns-link">
                <Image
                  src="/images/svg/icon-sns-pinterest.svg"
                  alt="Icon Pinterest"
                  width={30}
                  height={30}
                />
              </Link>
            </li>
            <li className="sns-item">
              <Link href="#none" className="sns-link">
                <Image
                  src="/images/svg/icon-sns-twitter.svg"
                  alt="Icon Twitter"
                  width={30}
                  height={30}
                />
              </Link>
            </li>
            <li className="sns-item">
              <Link href="#none" className="sns-link">
                <Image
                  src="/images/svg/icon-sns-instagram.svg"
                  alt="Icon Instagram"
                  width={30}
                  height={30}
                />
              </Link>
            </li>
          </ul>
        </div>
        <div className="other-area">
          <div className="other-item">
            <h2 className="logo"><em>Bloom</em> Beauty</h2>
            <p className="text-desc">Discover nature's beauty with our natural care products.</p>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="icon">
                  <Image 
                    src="/images/svg/icon-phone.svg"
                    alt="Phone"
                    width={16}
                    height={16}
                  />
                </span>
                <div className="text"><Link href="tel:+84 020 123 456">+84 020 123 456</Link></div>
              </li>
              <li className="contact-item">
                <span className="icon">
                  <Image 
                    src="/images/svg/icon-email.svg"
                    alt="Email"
                    width={16}
                    height={16}
                  />
                </span>
                <div className="text"><Link href="mailto:bloombt@kmail.com">bloombt@kmail.com</Link></div>
              </li>
              <li className="contact-item">
                <span className="icon">
                  <Image 
                    src="/images/svg/icon-map.svg"
                    alt="Location"
                    width={16}
                    height={16}
                  />
                </span>
                <div className="text"><Link href="#none">Hanoi, Vietnam</Link></div>
              </li>
            </ul>
          </div>
          <div className="other-item">
            <div className="nav-list">
              <div className="nav-item">
                <strong className="nav-title">Help</strong>
                <Link href="#none" className="nav-link">Contact us</Link>
                <Link href="#none" className="nav-link">FAQ</Link>
                <Link href="#none" className="nav-link">Shipping &amp; Returns</Link>
              </div>
              <div className="nav-item">
                <strong className="nav-title">MY ACCOUNT</strong>
                <Link href="#none" className="nav-link">Addresses</Link>
                <Link href="#none" className="nav-link">Order Status</Link>
                <Link href="#none" className="nav-link">Wishlist</Link>
              </div>
              <div className="nav-item">
                <strong className="nav-title">CUSTOMER CARE</strong>
                <Link href="#none" className="nav-link">About us</Link>
                <Link href="/blogs" className="nav-link">Blog</Link>
              </div>
            </div>
          </div>
          <div className="other-item">
            <strong className="text-title">SIGN UP FOR EMAILS</strong>
            <p className="text-desc">Stay informed, subscribe to our newsletter now!</p>
            <input type="text" placeholder="Email" id="input-subscribe" className="input-text" />
            <button type="button" className="btn btn-arrow btn-arrow-white btn-subscribe">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="inner">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; 2025 Bloom Beauty</p>
            <div className="policy-term">
              <Link href="#none" className="policy-term-item">Privacy Policy</Link>
              <Link href="#none" className="policy-term-item">terms and conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
