import { useEffect } from "react";

interface PageMetadataProps {
  title: string;
  description: string;
}

export function PageMetadata({ title, description }: PageMetadataProps) {
  useEffect(() => {
    document.title = `${title}`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = description;
      document.head.appendChild(newMeta);
    }
  }, [title, description]);

  return null;
}
