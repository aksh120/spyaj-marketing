import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Link>

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">{title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 border-b pb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Dec 30, 2024
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" /> Editorial Team
          </div>
          <button className="flex items-center gap-2 ml-auto hover:text-primary transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        <p className="lead text-xl mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>

        <h3>Why This Matters</h3>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>

        <h3>Looking Ahead</h3>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium.
        </p>
      </article>
    </div>
  );
}
