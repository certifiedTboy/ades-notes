import { useEffect } from "react";

interface PageMetadataProps {
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export function PageMetadata({
  title,
  description,
  ogType,
  ogImage,
  ogUrl,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: PageMetadataProps) {
  useEffect(() => {
    document.title = `${title}`;

    const updateOrCreateMeta = (
      selector: string,
      attributeName: string,
      attributeValue: string,
      content: string,
    ) => {
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      if (metaTag) {
        metaTag.setAttribute("content", content);
      } else {
        metaTag = document.createElement("meta");
        metaTag.setAttribute(attributeName, attributeValue);
        metaTag.setAttribute("content", content);
        document.head.appendChild(metaTag);
      }
    };

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = description;
      document.head.appendChild(newMeta);
    }

    // Open Graph Meta Tags
    if (ogType) {
      updateOrCreateMeta(
        'meta[property="og:type"]',
        "property",
        "og:type",
        ogType,
      );
    }
    if (ogImage) {
      updateOrCreateMeta(
        'meta[property="og:image"]',
        "property",
        "og:image",
        ogImage,
      );
    }
    if (ogUrl) {
      updateOrCreateMeta(
        'meta[property="og:url"]',
        "property",
        "og:url",
        ogUrl,
      );
    }
    if (title) {
      updateOrCreateMeta(
        'meta[property="og:title"]',
        "property",
        "og:title",
        title,
      );
    }
    if (description) {
      updateOrCreateMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
        description,
      );
    }

    // Twitter Card Meta Tags
    if (twitterCard) {
      updateOrCreateMeta(
        'meta[name="twitter:card"]',
        "name",
        "twitter:card",
        twitterCard,
      );
    }
    if (twitterTitle) {
      updateOrCreateMeta(
        'meta[name="twitter:title"]',
        "name",
        "twitter:title",
        twitterTitle,
      );
    } else if (title) {
      updateOrCreateMeta(
        'meta[name="twitter:title"]',
        "name",
        "twitter:title",
        title,
      );
    }
    if (twitterDescription) {
      updateOrCreateMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
        twitterDescription,
      );
    } else if (description) {
      updateOrCreateMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
        description,
      );
    }
    if (twitterImage) {
      updateOrCreateMeta(
        'meta[name="twitter:image"]',
        "name",
        "twitter:image",
        twitterImage,
      );
    }
  }, [
    title,
    description,
    ogType,
    ogImage,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);

  return null;
}
