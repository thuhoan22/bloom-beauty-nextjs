"use client";

interface BlogDetailProps {
  id: number;
}

export default function BlogDetail({ id }: BlogDetailProps) {
  return (
    <main className="main-content blog-detail-page">
      <div className="inner">
        <div>BlogDetail</div>
      </div>
    </main>
  )
}
