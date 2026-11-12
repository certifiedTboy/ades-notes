import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Eye,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { IPost } from "@/lib/types";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "./share-icons";

interface PostCardProps {
  post: IPost;
  index?: number;
  variant?: "default" | "featured" | "compact";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostCard({
  post,
  index = 0,
  variant = "default",
}: PostCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blogs/${post.slug}`
      : `/blogs/${post.slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);

  async function copyPostLink() {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({ title: "Link copied", description: "Share this post anywhere." });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Couldn't copy link",
        description: "Your browser couldn't access the clipboard. Try copying the URL manually.",
      });
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="group relative bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
      data-testid={`card-post-${post?._id}`}
    >
      <Link href={`/blogs/${post?.slug}`}>
        <div>
          {post?.coverImage && (
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={post?.coverImage}
                alt={post?.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground gap-2 mb-2">
              {post?.categoryName && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {post.categoryName}
                </span>
              )}

              <div className="flex items-center gap-2">
                {variant && variant !== "compact" && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post?.readingTime} min read
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post?.viewCount?.toLocaleString()}
                </span>

                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {post?.commentCount}
                </span>
              </div>
            </div>

            <h3 className="font-serif truncate text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer mb-1">
              {post?.title}
            </h3>

            {post.excerpt && (
              <p className="text-sm text-muted-foreground mb-4 truncate">
                {post?.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between px-5 pb-5 pt-3 border-t border-border">
        <div className="flex items-center gap-2 min-w-0">
          {post?.author?.picture ? (
            <img
              src={post?.author?.picture}
              alt={`${post?.author?.firstName} ${post?.author?.lastName}`}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {post?.author?.firstName[0]}
            </div>
          )}
          <span className="text-xs text-muted-foreground truncate">
            {post?.author?.firstName} {post?.author?.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(post?.createdAt).split(",")[0]}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Share ${post.title}`}
            title="Share post"
            onClick={() => setShareOpen(true)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Pass it along</DialogTitle>
            <DialogDescription>
              Share “{post.title}” with someone who might enjoy it.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X (Twitter)"
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
                <TwitterIcon className="h-5 w-5" />
              </span>
              X (Twitter)
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                <FacebookIcon className="h-5 w-5" />
              </span>
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodeURIComponent(post.excerpt || "")}&source=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600/10 text-sky-700">
                <LinkedinIcon className="h-5 w-5" />
              </span>
              LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-700">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              WhatsApp
            </a>
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-muted-foreground">
              Or copy the link
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-1.5 pl-3">
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {postUrl}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={copyPostLink}
                className="shrink-0 rounded-lg"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}
