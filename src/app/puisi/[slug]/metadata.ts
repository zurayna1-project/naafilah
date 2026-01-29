import type { Metadata } from "next";
import { db } from "@/lib/db"; // Menggunakan DB langsung, bukan fetch API

type Props = {
  params: Promise<{ slug: string }>; // Update: Next.js terbaru params adalah Promise
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Tunggu params (untuk Next.js versi terbaru)
  const slug = (await params).slug;

  // Ambil data langsung dari DB (lebih stabil daripada fetch API internal)
  const poem = await db.poem.findUnique({
    where: { slug: slug },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      createdAt: true,
    }
  });

  if (!poem) {
    return {
      title: "Puisi tidak ditemukan – Zurayna",
      description: "Puisi yang Anda cari mungkin telah dihapus atau dipindahkan.",
    };
  }

  // Logika gambar: Gunakan cover puisi jika ada, jika tidak gunakan default
  // Karena kita sudah set 'metadataBase' di layout, kita bisa pakai path relatif string
  const ogImage = poem.coverImage ? poem.coverImage : "/og-image.png";

  const description = poem.excerpt || "Baca puisi selengkapnya di Zurayna.";

  return {
    title: `${poem.title} – Zurayna`,
    description: description,

    openGraph: {
      title: poem.title,
      description: description,
      // url akan otomatis digenerate oleh Next.js berdasarkan metadataBase + slug
      siteName: "Zurayna",
      type: "article",
      publishedTime: poem.createdAt.toISOString(),
      authors: ["Zurayna"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: poem.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: poem.title,
      description: description,
      images: [ogImage],
    },
  };
}