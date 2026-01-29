'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // [Baru] Import Image
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface Poem {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  excerpt: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PoemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/poems/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Puisi tidak ditemukan');
        return r.json();
      })
      .then(data => {
        setPoem(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat puisi...</div>
      </div>
    );
  }

  if (error || !poem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-destructive mb-4">{error || 'Puisi tidak ditemukan'}</h1>
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Beranda
          </Link>
          <Link href="/kumpulan-puisi" className="text-foreground hover:text-primary transition-colors font-medium">
            Puisi
          </Link>
          <Link href="/kontak" className="text-foreground hover:text-primary transition-colors font-medium">
            Kontak
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Cover Image Section */}
        {poem.coverImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden" // [Edit] Tambah w-full
          >
            {/* [Baru] Menggunakan Next/Image */}
            <Image
              src={poem.coverImage}
              alt={poem.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="mb-8 text-center">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                    {poem.title}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                    <span>Ditulis: {formatDate(poem.createdAt)}</span>
                    {poem.category && <span>•</span>}
                    {poem.category && <span>{poem.category}</span>}
                  </div>
                </div>

                <div className="font-serif text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {poem.content}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-between items-center mt-8 gap-4"
          >
            <Link href="/kumpulan-puisi" className="flex-1">
              <Button variant="outline" className="w-full group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Kembali
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}