import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "./share-icons";
import type { IPost } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

function ShareModal({
  post,
  shareOpen,
  setShareOpen,
}: {
  post: IPost;
  shareOpen: boolean;
  setShareOpen: (open: boolean) => void;
}) {
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
        description:
          "Your browser couldn't access the clipboard. Try copying the URL manually.",
      });
    }
  }

  return (
    <Dialog open={shareOpen} onOpenChange={setShareOpen}>
      <DialogContent className="w-[calc(100%-2rem)] grid-cols-1 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Pass it along
          </DialogTitle>
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
              className="shrink-0 rounded-lg cursor-pointer"
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
  );
}

export default ShareModal;
