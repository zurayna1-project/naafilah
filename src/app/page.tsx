'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
// [UPDATE] Kembali ke icon standar yang bersih
import { User, ArrowRight } from 'lucide-react';

interface Poem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: string;
  author: string;
}

interface SiteSettings {
  headerImage: string | null;
  siteTitle: string;
  siteSubtitle: string | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialTiktok: string | null;
}

export default function HomePage() {
  const [featuredPoems, setFeaturedPoems] = useState<Poem[]>([]);
  const [latestPoems, setLatestPoems] = useState<Poem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/poems?featured=true', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/poems?latest=true', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/settings', { cache: 'no-store' }).then(r => r.json()),
    ])
      .then(([featured, latest, settingsData]) => {
        setFeaturedPoems(featured.slice(0, 2));
        setLatestPoems(latest.slice(0, 4));
        setSettings(settingsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-serif animate-pulse">Menyiapkan puisi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Header */}
      <header className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {settings?.headerImage ? (
          <div className="absolute inset-0">
             <Image
                src={settings.headerImage}
                alt="Header Background"
                fill
                priority
                className="object-cover"
                quality={90}
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
        )}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground drop-shadow-md"
          >
            {settings?.siteTitle || 'Zurayna'}
          </motion.h1>
          {settings?.siteSubtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-foreground/90 font-medium max-w-2xl drop-shadow-sm"
            >
              {settings.siteSubtitle}
            </motion.p>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">Beranda</Link>
          <Link href="/kumpulan-puisi" className="text-foreground hover:text-primary transition-colors font-medium">Puisi</Link>
          <Link href="/kirim-karya" className="text-foreground hover:text-primary transition-colors font-medium">Kirim Karya</Link>
          <Link href="/kontak" className="text-foreground hover:text-primary transition-colors font-medium">Kontak</Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* --- SECTION PUISI PAPAN ATAS (FEATURED) - Balik ke Original --- */}
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center"
            >
              Puisi Papan Atas
            </motion.h2>
            {featuredPoems.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {featuredPoems.map((poem) => (
                  <motion.div key={poem.id} variants={itemVariants}>
                    <Link href={`/puisi/${poem.slug}`}>
                      {/* Desain Original (Vertikal, Bersih, Gambar Besar) */}
                      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50 h-full flex flex-col">
                        {poem.coverImage && (
                          <div className="aspect-[16/9] overflow-hidden relative">
                             <Image
                                src={poem.coverImage}
                                alt={poem.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             />
                          </div>
                        )}
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {poem.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <User className="h-3 w-3" />
                            <span className="font-medium">Oleh: {poem.author || 'Admin'}</span>
                          </div>
                          {poem.excerpt && (
                            <p className="text-muted-foreground line-clamp-3 font-serif flex-1">
                              {poem.excerpt}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-muted-foreground font-serif text-lg">Belum ada puisi papan atas</p>
            )}
          </div>
        </section>

        {/* --- SECTION PUISI TERBARU (LANDSCAPE - FIXED) --- */}
        <section className="py-16 px-4 md:px-8 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center"
            >
              Puisi Terbaru
            </motion.h2>
            {latestPoems.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {latestPoems.map((poem) => (
                  <motion.div key={poem.id} variants={itemVariants}>
                    <Link href={`/puisi/${poem.slug}`}>
                      {/* Desain Landscape - Hapus Height Fixed agar ringkasan tidak hilang */}
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-primary/30 flex flex-row h-full min-h-[160px]">
                        
                        {/* Kiri: Cover Image (Lebar fix) */}
                        <div className="w-[130px] sm:w-[160px] relative shrink-0">
                            {poem.coverImage ? (
                                <Image
                                  src={poem.coverImage}
                                  alt={poem.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 30vw, 20vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <div className="text-4xl text-muted-foreground/20 font-serif">N</div>
                                </div>
                            )}
                        </div>

                        {/* Kanan: Content */}
                        <CardContent className="flex-1 p-4 flex flex-col justify-center">
                          <h3 className="font-serif text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {poem.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <User className="h-3 w-3" />
                            <span className="truncate">{poem.author || 'Admin'}</span>
                          </div>

                          {poem.excerpt && (
                            // [PENTING] line-clamp-3 akan membatasi 3 baris
                            // dan h-full pada card memastikan teks tidak terpotong kasar
                            <p className="text-sm text-muted-foreground font-serif leading-relaxed line-clamp-3">
                              {poem.excerpt}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-muted-foreground font-serif text-lg">Belum ada puisi terbaru</p>
            )}
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center text-muted-foreground font-serif text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Setiap kata membawa rasa, setiap bait menyimpan cerita. Mari nikmati keindahan puisi yang hadir dari lubuk hati.
            </motion.p>
          </div>
        </section>

        {/* Tentang Zurayna */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Tentang Zurayna
              </h2>
              <p className="text-lg text-muted-foreground font-serif leading-relaxed mb-8">
                Ruang pribadi untuk mengumpulkan dan berbagi karya puisi. 
                Setiap bait adalah ungkapan perasaan yang tulus, setiap kata adalah jejak 
                dari perjalanan jiwa.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 px-4 md:px-8 bg-primary/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-primary/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V5H6v10zm10 0h3l2-4V5h-5v10zM18 3v6h-4v-6h4zM12 3v6h-4v-6h4z"/>
                </svg>
              </div>
              <blockquote className="font-serif text-2xl md:text-3xl italic leading-relaxed mb-6">
                "Buah dari perenungan yang matang, 
                ditanam dalam kebun kesunyian jiwa."
              </blockquote>
              <cite className="text-sm text-muted-foreground">
                — Zurayna
              </cite>
            </motion.div>
          </div>
        </section>

        {/* Galeri Puisi Section (Why Poetry) */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              Galeri Puisi
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 border-2 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="mb-4">
                  <svg className="w-12 h-12 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-center">Pengungkapan Rasa</h3>
                <p className="text-muted-foreground font-serif text-center leading-relaxed">
                  Puisi adalah wadah untuk menuangkan perasaan yang tak terucap, 
                  menyimpan emosi dalam setiap baris yang bermakna.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 border-2 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="mb-4">
                  <svg className="w-12 h-12 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-center">Inspirasi & Harapan</h3>
                <p className="text-muted-foreground font-serif text-center leading-relaxed">
                  Setiap bait membawa pesan yang menginspirasi, 
                  menjadi sumber harapan di tengah segala kehidupan.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 border-2 rounded-lg hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="mb-4">
                  <svg className="w-12 h-12 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-center">Refleksi Diri</h3>
                <p className="text-muted-foreground font-serif text-center leading-relaxed">
                  Melalui puisi, kita belajar merenung, memahami diri, 
                  dan menemukan kedamaian dalam setiap kata.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Jelajahi Lebih Banyak
              </h2>
              <p className="text-lg text-muted-foreground font-serif mb-8 leading-relaxed">
                Temukan lebih banyak puisi yang menemani hari-hari Anda. 
                Nikmati keindahan kata yang dikumpulkan dengan penuh cinta.
              </p>
              <Link href="/kumpulan-puisi">
                <Button size="lg" className="group">
                  Lihat Semua Puisi
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}