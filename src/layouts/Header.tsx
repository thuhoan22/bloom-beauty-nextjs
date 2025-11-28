"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

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

  // Search
  const [isOpen, setIsOpen] = useState(false);
  // const [results, setResults] = useState([]);
  const [results, setResults] = useState<Array<typeof products[number]>>([]); //Chỉ định kiểu phần tử để TypeScript biết kiểu của mảng results
  const [totalResults, setTotalResults] = useState(0);
  const [value, setValue] = useState("");

  // Logic search
  useEffect(() => {
    if (value.trim() === "") {
      setResults([]);
      setTotalResults(0);
      return;
    }

    const keyword = value.toLowerCase();

    const fullMatched = products.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );

    setTotalResults(fullMatched.length);
    setResults(fullMatched.slice(0, 4));
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const clickOutsideGroupAction = !target.closest(".group-action");
      const clickOutsideSearchItem = !target.closest(".search-item");
      if (clickOutsideGroupAction && clickOutsideSearchItem) {
        setIsOpen(false);
      };
    }
    document.addEventListener("click", handleClick);
    return() => document.removeEventListener("click", handleClick);
  }, [])
  // [E] Search

  // Clear input value
  const handleClear = () => {
    setValue("");
  }
  // [E] Clear input value

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
            <button 
              type="button"
              className="group-action-item group-action-search"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="icon">
                <Image
                  src="/images/svg/icon-search.svg"
                  alt="Search icon"
                  width={18}
                  height={18}
                />
              </span>
              <span className="text">Search</span>
            </button>
            <Link href="/account" className="group-action-item">
              <span className="icon">
                <Image
                  src="/images/svg/icon-account.svg"
                  alt="Acount icon"
                  width={18}
                  height={18}
                />
              </span>
              <span className="text">ACOUNT</span>
            </Link>
            <Link href="/cart" className="group-action-item group-action-cart">
              <span className="icon">
                <Image
                  src="/images/svg/icon-cart.svg"
                  alt="Acount icon"
                  width={18}
                  height={18}
                />
              </span>
              <span className="text">CART</span>
              <span className="badge">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
      {/* {isOpen && (
      )} */}
      <div className={`search-box ${isOpen ? "is-open" : ""}`}>
        <div className="search-item">
          <span className="icon">
            <Image
              src="/images/svg/icon-search-pink.svg"
              alt="Search icon"
              width={32}
              height={32}
            />
          </span>
          <input 
            type="text" 
            className="input-search" 
            placeholder="Search" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="button" className="btn-clear" onClick={handleClear}>
            <Image
              src="/images/svg/icon-cancel-pink.svg"
              alt="Cancel icon"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-result">
          <div className="inner">
            <div className="search-result-content">
              <div className="search-result-btn">
                <Link href={`/search?q=${value}`} className="btn btn-secondary btn-view-all">
                  See all <em>{totalResults}</em> results for "{value}"
                </Link>
              </div>
              <ul className="search-result-list product-list">
                {results.map((item) => (
                  <ProductCard 
                    key={item.id}
                    {...item}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
