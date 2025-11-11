"use client"

import Image from "next/image"
import Link from "next/link"

import "./Pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <ul className="pagination-list">
        <li className="pagination-item">
          <button type="button" className="pagination-prev" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <span className="blind">Prev</span>
          </button>
        </li>
        {pages.map((page) => (
          <li className="pagination-item" key={page} >
            <button type="button" onClick={() => onPageChange(page)} className={`pagination-number ${currentPage === page ? "is-active" : ""}`}>
              {page}
            </button>
          </li>
        ))}
        <li className="pagination-item">
          <button type="button" className="pagination-next" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <span className="blind">Next</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
