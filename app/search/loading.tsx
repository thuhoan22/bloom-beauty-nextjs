import React from 'react'

export default function loading() {
  return (
    <div className="search-loading">
      <div className="inner">
        <div className="skeleton-title"></div>
        <ul className="skeleton-list">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="skeleton-item">
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
