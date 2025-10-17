import "./ProductFilter.scss";

type ProductProps = {
  name: string;
  desc: string;
  price: number;
  sale: number;
  image: string;
};

export default function ProductFilter() {
  return (
    <div className="filter-area">
      <h2>Filter</h2>
    </div>
  );
}
