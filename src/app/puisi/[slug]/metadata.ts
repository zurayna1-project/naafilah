import type { Metadata } from "next";

const SITE_URL = "https://zurayna.site";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const res = await fetch(`${SITE_URL}/api/poems/${params.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      title: "Puisi tidak ditemukan – Zurayna",
    };
  }

  const poem = await res.json();

  const ogImage = poem.coverImage
    ? poem.coverImage
    : `${SITE_URL}/og-image.png`;

  return {
    title: `${poem.title} – Zurayna`,
    description: poem.excerpt || "Ruang Untuk Sebuah Puisi",

    openGraph: {
      title: poem.title,
      description: poem.excerpt,
      url: `${SITE_URL}/puisi/${params.slug}`,
      siteName: "Zurayna",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: poem.title,
      description: poem.excerpt,
      images: [ogImage],
    },
  };
}
