"use client";

import { useState } from "react";

import "./ProductFilter.scss";

const FILTERS = [
  {
    id: 'productType',
    title: 'Product Type',
    type: 'checkbox',
    options: ['Sunscreen', 'Makeup remover', 'Cleanser', 'Toner - Serum', 'Cream - Gel', 'Other'],
  },
  {
    id: 'skinType',
    title: 'Skin Type',
    type: 'checkbox',
    options: ['Normal', 'Dryness', 'Oily', 'Sensitive'],
  },
  {
    id: 'priceRange',
    title: 'Price Range',
    type: 'radio',
    options: ['Under $25', '$25 - $50', '$50 - $100', 'Over $100'],
  },
] as const; // Đặt type cứng as const cũng giúp TypeScript hiểu FILTERS là hằng, không bị suy luận sai kiểu string động
interface FilterValues {
  productType: string[];
  skinType: string[];
  priceRange: string | null;
};

export default function ProductFilter({ onApply }: { onApply: (filters: FilterValues) => void }) {
  type CheckboxKey = keyof Pick<FilterValues, "productType" | "skinType">; //type tự động đồng bộ với interface FilterValues

  const [filters, setFilters] = useState<FilterValues>({
    productType: [],
    skinType: [],
    priceRange: null,
  });

  // State để quản lý mở/đóng nhóm filter
  const [openGroups, setOpenGroups] = useState<string[]>(FILTERS.map(f => f.id)); // ban đầu mở hết
  const toggleGroup = (id: string) => {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  // Handle thay đổi checkbox
  const handleCheckboxChange = (group: CheckboxKey, value: string, checked: boolean) => {
    setFilters((prev) => {
      const values = checked
        ? [...prev[group], value]
        : prev[group].filter((v) => v !== value);
      return { ...prev, [group]: values };
    });
  };

  // Handle thay đổi radio
  const handleRadioChange = (value: string) => {
    setFilters((prev) => ({ ...prev, priceRange: value }));
  };

  return (
    <div className="filter-area">
      <h2 className="text-title">Filter</h2>
      <div className="filter-group">
        {FILTERS.map((f) => {
          const isOpen = openGroups.includes(f.id);
          return (
            <div key={f.id} className={`filter-group-item ${isOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="filter-title"
                onClick={() => toggleGroup(f.id)}
              >
                {f.title}
              </button>
              {isOpen && (
                <ul className="filter-list">
                  {f.type === 'checkbox' &&
                    f.options.map((option) => {
                      const key = f.id as CheckboxKey;
                      const isChecked = filters[key].includes(option);
                      const checkboxId = `${f.id}-${option}`;
                    return (
                      <li key={option} className="filter-item">
                        <div className="checkbox">
                          <input 
                            className="checkbox-input" 
                            type="checkbox"
                            id={checkboxId}
                            name={key}
                            value={option} 
                            onChange={(e) => handleCheckboxChange(key, option, e.target.checked)}
                            checked={isChecked}
                          />
                          <label htmlFor={checkboxId} className="checkbox-label">{option}</label>
                        </div>
                      </li>
                    );
                  })}

                  {f.type === 'radio' &&
                    f.options.map((option) => {
                      const radioId = `${f.id}-${option}`;
                      return (
                        <li key={option} className="filter-item">
                          <div className="checkbox">
                            <input
                              className="checkbox-input"
                              type="radio"
                              id={radioId}
                              name="priceRange"
                              value={option}
                              checked={filters.priceRange === option}
                              onChange={() => handleRadioChange(option)}
                            />
                            <label htmlFor={radioId} className="checkbox-label">{option}</label>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <button 
        className="btn btn-filter" 
        onClick={() => onApply(filters)} // gọi callback từ cha
      >
        Apply
      </button>
    </div>
  );
}
