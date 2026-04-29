"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/product.api";
import { getUser } from "@/lib/common.api";
import { supabase } from '@/lib/supabase';
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import ProductCard from "@/components/ProductCard";
import LoginModal from "@/components/ModalLogin";
import SignupModal from "@/components/ModalSignup"

import "./Header.scss";

export default function Header() {
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const { cartCount } = useCart();
  const { profile } = useProfile();
  const pathname = usePathname();

  // fetch data
  useEffect(() => {
    getProducts().then(setProducts);
    getUser().then(setUser);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { href: "/products", label: "SHOP ALL" },
    { href: "/best-sell", label: "BESTSELLERS" },
    { href: "/blogs", label: "BLOG" },
    { href: "/about", label: "ABOUT US" },
  ];

  // Search
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

      const isClickInside =
        target.closest(".group-action-trigger") ||
        target.closest(".input-search");

      if (!isClickInside) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    // document.addEventListener("mousedown", handleClick);
    return() => document.removeEventListener("click", handleClick);
  }, [])
  // [E] Search

  // Clear input value
  const handleClear = () => {
    setValue("");
  }
  // [E] Clear input value

  const handleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  return (
    <header className={`header ${isMenuOpen ? "is-open" : ""}`}>
      <div className="inner">
        <div className="header-content">
          <Link href="/" className="logo"><em>Bloom</em> Beauty</Link>
          {/* Class .group-action-mo use for mobile */}
          <div className="group-action-mo group-action-trigger">
            <button 
              type="button"
              className="group-action-item group-action-search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <span className="icon">
                <Image
                  src="/images/svg/icon-search.svg"
                  alt="Search icon"
                  width={24}
                  height={24}
                />
              </span>
            </button>
            <Link href="/cart" className="group-action-item group-action-cart">
              <span className="icon">
                <Image
                  src="/images/svg/icon-cart.svg"
                  alt="Acount icon"
                  width={24}
                  height={24}
                />
              </span>
              <span className="badge">{cartCount}</span>
            </Link>
          </div>
          <button
            type="button"
            className="btn-gnb"
            onClick={handleMenu}
          >
            <span className="btn-gnb-bar">
              <span className="bar"></span>
            </span>
          </button>
          <div className="header-info">
            <nav className="nav">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${pathname == item.href ? "is-active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="group-action group-action-trigger">
              <button 
                type="button"
                className="group-action-item group-action-search"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
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
              {user ? (
                <Link href="/account" className="group-action-item group-action-account">
                  <span className="icon">
                    <Image
                      // src={profile?.avatar || "/images/svg/icon-account.svg"}
                      src="/images/svg/icon-account.svg"
                      alt="Acount icon"
                      width={18}
                      height={18}
                    />
                  </span>
                  <span className="text">ACOUNT</span>
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="group-action-account btn-action-login"
                    onClick={() => {
                      setOpenLogin(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="text">SIGN IN</span>
                  </button>
                  <button
                    type="button"
                    className="group-action-account btn-action-signup"
                    onClick={() => {
                      setOpenSignup(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="text">SIGN UP</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="dimmd" onClick={() => setIsMenuOpen(false)}></div>
      {/* {isSearchOpen && (
      )} */}
      <div className={`search-box ${isSearchOpen ? "is-open" : ""}`}>
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
      {isSearchOpen && results.length > 0 && (
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

      <LoginModal
        isOpen={openLogin}
        onClose={() => setOpenLogin(false)}
      />

      {openSignup && (
        <SignupModal 
          onClose={() => setOpenSignup(false)} 
          onSwitchToLogin={() => {
            setOpenSignup(false);
            setOpenLogin(true);
          }}
        />
      )}
    </header>
  );
}
