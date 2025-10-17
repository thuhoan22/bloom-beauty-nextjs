import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import "./ProductList.scss";

export default function ProductList() {
  return (
    <main className="main-content product-page">
      <div className="inner">
        {/* <div className="box-head">
          <strong className="text-title">Product</strong>
        </div> */}
        <div className="box-content">
          <ProductFilter />
          <div className="product-area">
            <div className="product-sort">
              <span className="text-total"><em>{products.length}</em> PRODUCT</span>
              <div className="sort-area">
                <span className="text">Sort by</span>
              </div>
            </div>
            <div className="product-list">
              {products.map((item) => (
                <ProductCard 
                  key={item.id} 
                  {...item} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
