import Image from "next/image";

import "./RatingDisplay.scss";

export default function RatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [
    ...Array(fullStars).fill('full'),
    ...(halfStar ? ['half'] : []),
    ...Array(5 - fullStars - (halfStar ? 1 : 0)).fill('empty'),
  ];

  return (
    <div className="rating-box">
      <div className="rating">
        {stars.map((type, i) => (
          <Image
            key={i}
            src={`/images/svg/icon-star-${type}.svg`}
            alt={`${type} star`}
            width={14}
            height={14}
          />
        ))}
      </div>
      <span className="text-number">({rating})</span>
    </div>
  );
}
