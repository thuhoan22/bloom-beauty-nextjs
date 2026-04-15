"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import AccountContact from "./AccountContact";
import AccountPassword from "./AccountPassword";
import AccountAddress from "./AccountAddress";
import AccountOrder from "./AccountOrder";
import ModalConfirm from "@/components/ModalConfirm";

import "./AccountPage.scss";

interface MenuItem {
  id: number;
  name: string;
  hasSubMenu: boolean;
  subItems: { name: string, filter: string }[];
  component: React.ComponentType<any> | null; // Kiểu component React
}

export default function AccountPage() {
  const router = useRouter(); 
  const [openConfirm, setOpenConfirm] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 1, name: "Contact information", hasSubMenu: false, subItems: [], component: AccountContact, },
    { id: 2, name: "Change password", hasSubMenu: false, subItems: [], component: AccountPassword, },
    { id: 3, name: "Addresses", hasSubMenu: false, subItems: [], component: AccountAddress, },
    {
      id: 4,
      name: "Orders",
      hasSubMenu: true,
      subItems: [
        { name: "All period", filter: "All" },
        { name: "For this month", filter: "This month" },
        { name: "Last this month", filter: "Last month" },
        { name: "This year", filter: "This year" },
        { name: "Last year", filter: "Last year" }
      ],
      component: null,
    },
    {
      id: 5,
      name: "Wishlist",
      hasSubMenu: true,
      subItems: [
        { name: "All period", filter: "all" },
        { name: "For this month", filter: "this_month" },
      ],
      component: null,
    },
  ]
  const [openSubMenu, setOpenSubMenu] = useState<{ [key: number]: boolean }>({});                      // Lưu trạng thái mở / đóng của các submenu (ví dụ: Orders, Wishlist)
  const [activeItem, setActiveItem] = useState<number | null>(1);                                      // Lưu ID của navigation-item đang active (cho các mục KHÔNG có submenu)
  const [activeParentId, setActiveParentId] = useState<number | null>(null);                           // Lưu ID của navigation-item là cha đang active (mục CÓ submenu)
  const [activeSubItem, setActiveSubItem] = useState<{ parentId: number, name: string } | null>(null); // Lưu submenu nào đang được active (ví dụ: “This month”, “Last year”... của Orders)
  const [orderFilter, setOrderFilter] = useState<string>("all");                                       // Lưu filter hiện đang dùng cho component AccountOrder
  const [activeComponent, setActiveComponent] = useState<React.ReactNode | null>(
    React.createElement(AccountContact)
  );                                                                                                   // Lưu component đang được hiển thị trong phần nội dung bên phải (Mặc định là AccountContact)

  const toggleSubMenu = (id: number) => {
    setOpenSubMenu((prevState: { [key: number]: boolean }) => ({
      ...prevState,
      [id]: !prevState[id], // Đảo giá trị open/close cho item có submenu
    }));
  };

  const handleItemClick = (id: number, component: React.ComponentType<any> | null, hasSubMenu: boolean) => {
    if (hasSubMenu) {
      toggleSubMenu(id); // Mở submenu nếu có
      setActiveItem(1); // Đóng mục active nếu có submenu
    } else {
      // Reset submenu khi click item thường
      setActiveParentId(null);
      setActiveSubItem(null);
      setOpenSubMenu({}); // đóng tất cả submenu

      setActiveItem(id); // Nếu không có submenu, thêm class active
      setActiveComponent(component ? React.createElement(component) : null); // Render component nếu có
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    const { data } = await supabase.auth.getSession();

    const token = data.session?.access_token;

    await supabase
      .from("user_sessions")
      .update({ is_active: false })
      .eq("session_token", token);

    await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed!");
      return;
    }

    toast.success("Logged out!");
    router.push("/");
  };

  return (
    <main className="main-content account-page">
      <div className="inner">
        <div className="box-content box-content-sidebar">
          <div className="box-sidebar account-left">
            <h2 className="text-title">Account</h2>
            <ul className="navigation-area">
              {menuItems.map(item => (
                item.hasSubMenu ? (
                  <li 
                    key={item.id} 
                    className={`navigation-item ${openSubMenu[item.id] ? "is-open" : ""} ${activeParentId === item.id ? "is-active" : ""}`}>
                    <div className="navigation-item-btn" onClick={() => toggleSubMenu(item.id)}>
                      <strong className="text-md text-nav">{item.name}</strong>
                      <span className="icon">
                        {activeSubItem?.parentId === item.id ? (
                          <Image src="/images/svg/icon-arrow-down-pink.svg" alt="icon-arrow" width={12} height={6} />
                        ) : (
                          <Image src="/images/svg/icon-arrow-black.svg" alt="icon-arrow" width={12} height={6} />
                        )}
                      </span>
                    </div>
                    {openSubMenu[item.id] && (
                      <ul className="children-item">
                        {item.subItems.map((subItem) => (
                          <li 
                            key={subItem.name} 
                            className={`children-item-link ${activeSubItem?.parentId === item.id && activeSubItem?.name === subItem.name ? "is-active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSubItem({ parentId: item.id, name: subItem.name });  // Kích hoạt submenu
                              setActiveParentId(item.id);      // Kích hoạt mục cha
                              setActiveItem(null);             // Reset activeItem (vì item có submenu đã active)
                              setOrderFilter(subItem.filter);  // Lưu filter
                              setActiveComponent(<AccountOrder filter={subItem.filter} />);  // Render AccountOrder với filter mới
                            }}
                          >
                            <Link href="#none" className="text-sm">{subItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ):(
                  <li 
                    key={item.id} 
                    className={`navigation-item ${activeItem === item.id ? "is-active" : ""}`}
                    onClick={() => handleItemClick(item.id, item.component, item.hasSubMenu)}
                  >
                    <Link href="#none" className="text-nav text-md">{item.name}</Link>
                  </li>
                )
              ))}
            </ul>
            <button className="btn-logout" onClick={() => setOpenConfirm(true)}>Logout</button>
          </div>
          <div className="box-panel account-right">
            {activeComponent || <p>Chọn một mục để xem chi tiết.</p>}
          </div>
        </div>
      </div>

      <ModalConfirm
        isOpen={openConfirm}
        textConfirm={
          <>
            Are you sure <br /> you want to log out?
          </>
        }
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleLogout}
      />
    </main>
  )
}
