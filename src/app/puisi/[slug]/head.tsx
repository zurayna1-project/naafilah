export default async function Head({ params }: { params: { slug: string } }) {
  const SITE_URL = "https://zurayna.site";

  const res = await fetch(`${SITE_URL}/api/poems/${params.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <>
        <title>Puisi tidak ditemukan — Zurayna</title>
      </>
    );
  }

  const poem = await res.json();

  const imageUrl = poem.coverImage
    ? poem.coverImage.startsWith("http")
      ? poem.coverImage
      : `${SITE_URL}${poem.coverImage}`
    : `${SITE_URL}/og-image.png`; // fallback

  return (
    <>
      <title>{poem.title} — Zurayna</title>

      <meta name="description" content={poem.excerpt || "Puisi di Zurayna"} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`${SITE_URL}/puisi/${poem.slug}`} />
      <meta property="og:title" content={poem.title} />
      <meta
        property="og:description"
        content={poem.excerpt || "Puisi di Zurayna"}
      />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={poem.title} />
      <meta
        name="twitter:description"
        content={poem.excerpt || "Puisi di Zurayna"}
      />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
