'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, BookOpen, X } from 'lucide-react'; // [UPDATE] Tambah icon X

interface Poem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: string;
  category: string | null;
  author: string;
}

export default function CollectionPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/poems')
      .then(r => r.json())
      .then(data => {
        // [FIX] Pastikan data adalah Array biar tidak crash
        if (Array.isArray(data)) {
          setPoems(data);
        } else {
          console.error("Format data salah:", data);
          setPoems([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading poems:', err);
        setLoading(false);
      });
  }, []);

  // [FIX] Logika Filter Lebih Aman (Tahan Spasi & Huruf Besar/Kecil)
  const filteredPoems = useMemo(() => {
    return poems.filter(poem => {
      // 1. Filter Pencarian
      const searchLower = searchTerm.toLowerCase();
      const matchTitle = poem.title.toLowerCase().includes(searchLower);
      const matchExcerpt = poem.excerpt && poem.excerpt.toLowerCase().includes(searchLower);
      
      if (!matchTitle && !matchExcerpt) return false;

      // 2. Filter Kategori
      if (!selectedCategory) return true;
      
      // Bersihkan spasi depan/belakang biar akurat
      const cleanPoemCategory = (poem.category || '').trim();
      return cleanPoemCategory === selectedCategory;
    });
  }, [searchTerm, poems, selectedCategory]);

  // [FIX] Ambil Kategori Unik dengan Bersih
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    poems.forEach(poem => {
      if (poem.category && poem.category.trim() !== '') {
        categorySet.add(poem.category.trim());
      }
    });
    return Array.from(categorySet).sort();
  }, [poems]);

  // [FITUR BARU] Toggle Category (Klik lagi untuk matikan filter)
  const toggleCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Matikan jika sudah aktif
    } else {
      setSelectedCategory(category); // Aktifkan baru
    }
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Tambahan Import Loader2 manual jika belum ada (opsional, pakai div biasa juga ok)
  function Loader2(props: any) {
     return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-8 text-sm md:text-base">
          <Link href="/" className="hover:text-primary transition-colors font-medium">Beranda</Link>
          <Link href="/kumpulan-puisi" className="text-primary font-bold transition-colors">Puisi</Link>
          <Link href="/kirim-karya" className="hover:text-primary transition-colors font-medium">Kirim Karya</Link>
          <Link href="/kontak" className="hover:text-primary transition-colors font-medium">Kontak</Link>
        </div>
      </nav>

      <main className="flex-1 px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Galeri Puisi
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Telusuri setiap bait rasa yang tersimpan dalam kata.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-md mx-auto relative group"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Cari judul atau kutipan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full border-muted-foreground/20 focus:border-primary shadow-sm"
            />
            {searchTerm && (
               <button 
                 onClick={() => setSearchTerm('')}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
               >
                 <X className="h-4 w-4" />
               </button>
            )}
          </motion.div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  Semua
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Grid Puisi */}
          <AnimatePresence mode='wait'>
            {filteredPoems.length > 0 ? (
              <motion.div
                key={selectedCategory || 'all'} // Reset animasi saat kategori berubah
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredPoems.map((poem) => (
                  <motion.div key={poem.id} variants={itemVariants}>
                    <Link href={`/puisi/${poem.slug}`}>
                      <Card className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border hover:border-primary/50 flex flex-row h-[160px] md:h-[180px]">
                        
                        {/* Image Section */}
                        <div className="w-[130px] md:w-[180px] relative shrink-0 overflow-hidden">
                            {poem.coverImage ? (
                              <Image
                                src={poem.coverImage}
                                alt={poem.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 30vw, 20vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground/30 group-hover:bg-primary/5 transition-colors">
                                  <BookOpen className="h-8 w-8" />
                              </div>
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Content Section */}
                        <CardContent className="flex-1 p-4 md:p-5 flex flex-col justify-center min-w-0 bg-card">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-serif text-lg md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                              {poem.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                             <span className="flex items-center gap-1">
                               <User className="h-3 w-3" />
                               {poem.author || 'Admin'}
                             </span>
                             {poem.category && (
                                <span className="px-2 py-0.5 bg-secondary rounded-full font-medium text-secondary-foreground">
                                  {poem.category}
                                </span>
                             )}
                          </div>

                          {poem.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 font-serif leading-relaxed group-hover:text-foreground/80 transition-colors">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-muted/20 rounded-xl border border-dashed"
              >
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Tidak ditemukan</h3>
                <p className="text-muted-foreground">
                  Maaf, belum ada puisi untuk kategori atau pencarian ini.
                </p>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 text-primary hover:underline text-sm font-medium"
                  >
                    Hapus Filter
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}