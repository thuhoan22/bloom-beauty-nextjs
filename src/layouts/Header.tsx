"use client";

import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

import "./Header.scss";

export default function Header() {
  const { cartCount } = useCart();
  const pathname = usePathname();

  const navItems = [
    { href: "/products", label: "SHOP ALL" },
    { href: "/best-sell", label: "BESTSELLERS" },
    { href: "/blogs", label: "BLOG" },
    { href: "/about", label: "ABOUT US" },
    // { href: "/cart", label: "CART" },
  ];

  return (
    <header className="header">
      <div className="inner">
        <div className="header-content">
          <Link href="/" className="logo"><em>Bloom</em> Beauty</Link>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname == item.href ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="group-action">
            <Link href="/account" className="group-action-item">ACOUNT</Link>
            <Link href="/cart" className="group-action-item group-action-cart">
              <span>CART</span>
              <span className="badge">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
