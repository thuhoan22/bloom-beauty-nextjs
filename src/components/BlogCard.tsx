"use client";

import Image from "next/image";
import Link from "next/link";

import "./BlogCard.scss";

interface BlogCardProps {
  id: number;
  title: string;
  desc: string;
  date: string;
  tags: string[];
  image: string;
  showDate?: boolean;
  showTags?: boolean;
};

export default function BlogCard({ id, title, desc, date, tags, image, showDate = true, showTags = true }: BlogCardProps) {
  return (
    <div className="blog-item">
      <div className="thumb">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="blog-image"
        />
      </div>
      <div className="blog-info">
        <div className="text-wrap">
          {showDate && <span className="text-time">{date}</span>}
          <h3 className="text-title">{title}</h3>
          <span className="text-desc">{desc}</span>
          {showTags && (
            <div className="tag-group">
              {tags.map((tag, index) => (
                <span key={index} className="text-tag"># {tag}</span>
              ))}
            </div>
          )}
        </div>
        <Link 
          href={`/blogs/${id}`}
          className="btn btn-primary btn-more"
        >
          Read more
        </Link>
      </div>
    </div>
  )
}
