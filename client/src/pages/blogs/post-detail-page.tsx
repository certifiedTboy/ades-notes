import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { PageMetadata } from "@/components/common/page-metadata";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";
import { transform } from "./transform";
import { Interweave } from "interweave";
import { marked } from "marked";
import { useAuth } from "@/features/context/auth-context";
import ReadingProgress from "./reading-progress";
import ReactionsPanel from "./reaction-panel";
import CommentsSection from "./comments-section";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "./share-icons";
import { usePosts } from "@/features/context/post-context";
import NotFoundBlog from "./not-found-blog";
import { useUnsaveContext } from "@/features/context/unsave-context";
import PostDetailSkeleton from "./post-detail-skeleton";
import { useGetPostDetailsMutation } from "@/features/apis/post-apis";
import type { IPost } from "@/lib/types";

export default function PostDetailPage() {
  const { posts: POSTS, viewPostsDetails } = usePosts();
  const [, params] = useRoute("/blogs/:slug");
  // const [, navigate] = useLocation();
  const { isAuthenticated: isSignedIn } = useAuth();

  const slug = params?.slug ?? "";

  const [post, setPost] = useState<IPost | null>(
    POSTS.find((p) => p.slug === slug) || null,
  );

  const [getPostDetails, { data, isSuccess, isError, isLoading }] =
    useGetPostDetailsMutation();

  const { navigate } = useUnsaveContext();

  useEffect(() => {
    if (slug && !post) {
      getPostDetails(slug);
      viewPostsDetails(slug);
    }
  }, [slug, post, getPostDetails, viewPostsDetails]);

  useEffect(() => {
    if (isSuccess && data) {
      setPost(data.data);
    }
  }, [isSuccess, data]);

  const renderedContent = useMemo(
    () =>
      post?.content
        ? marked.parse(post.content, {
            gfm: true,
            breaks: true,
          })
        : "",
    [post?.content],
  );

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (isError && !isLoading) {
    return <NotFoundBlog />;
  }

  const credit = post?.coverImageCredit;
  let creditText = credit;
  let creditUrl: string | undefined;

  if (credit) {
    const urlMatch = credit.match(/https?:\/\/\S+/);
    if (urlMatch) {
      creditUrl = urlMatch[0];
      creditText = credit.replace(urlMatch[0], "").trim();
    }
  }

  // Get current URL for sharing, safely handling SSR
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen pt-20 pb-20">
      {post && (
        <PageMetadata
          title={`${post.title} | Ade's Notes`}
          description={post.excerpt || ""}
          ogType="article"
          ogImage={post.coverImage}
          ogUrl={currentUrl}
          twitterCard="summary_large_image"
          twitterTitle={post.title}
          twitterDescription={post.excerpt || ""}
          twitterImage={post.coverImage}
        />
      )}

      <ReadingProgress />
      {post?.coverImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-h-[500px] overflow-hidden"
        >
          <img
            src={post?.coverImage}
            alt={post?.title}
            className="w-full h-full object-cover"
            style={{ aspectRatio: "21/9" }}
          />
        </motion.div>
      )}

      {creditText && (
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground mt-2 italic">
            {creditUrl ? (
              <a
                href={creditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {creditText}
              </a>
            ) : (
              creditText
            )}
          </p>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 mt-10">
        <div className="sticky top-16 bg-background/95 backdrop-blur-md z-10 py-4 -mx-4 px-4 mb-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/blogs")}
            className="flex items-center cursor-pointer gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </motion.button>
        </div>

        <div
          className="
            prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-serif
            prose-headings:font-semibold
            prose-a:text-primary
            prose-pre:m-0
            prose-pre:bg-transparent
            prose-pre:p-0
          "
        >
          {/* @ts-ignore */}
          {post?.categoryName && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-4"
            >
              {/* @ts-ignore */}
              {post.categoryName}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-6"
          >
            {post?.title}
          </motion.h1>

          {post?.excerpt && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-6 leading-relaxed italic border-l-4 border-primary pl-4"
            >
              {post?.excerpt}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 py-4 border-y border-border mb-8"
          >
            <div className="flex items-center gap-2">
              {post?.author?.picture ? (
                <img
                  src={post?.author?.picture}
                  alt={`${post?.author?.firstName} ${post?.author?.lastName}`}
                  className="w-9 h-9 rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {post?.author?.firstName[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {`${post?.author?.firstName} ${post?.author?.lastName}`}
                </p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground ml-auto">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post &&
                  new Date(post?.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post?.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post?.viewCount?.toLocaleString()}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {renderedContent && (
              <Interweave
                content={renderedContent as string}
                transform={transform}
              />
            )}
          </motion.div>
        </div>

        {post && post?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post?.tags?.map((tag) => (
              <a
                key={tag}
                href={`/blog?tag=${tag}`}
                className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}

        {/* Social Share Section */}
        {post && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mt-8 py-4 border-y border-border"
          >
            <span className="text-sm font-medium text-muted-foreground">
              Share this post:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X (Twitter)"
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt || "")}&source=${encodeURIComponent(window.location.origin)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}%20${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
          </motion.div>
        )}

        {post && (
          <ReactionsPanel postId={post?._id} userSignedIn={!!isSignedIn} />
        )}
        {post && <CommentsSection postId={post._id} />}
      </div>
    </div>
  );
}
