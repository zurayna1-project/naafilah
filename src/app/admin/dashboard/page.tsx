'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
// [UBAH 1] Tambahkan Loader2 di sini
import { BookOpen, MessageSquare, Settings, LogOut, Plus, Edit, Trash2, Star, Check, MailOpen, Mail, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Poem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  isFeatured: boolean;
  published: boolean;
  createdAt: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Settings {
  id: string;
  siteTitle: string;
  siteSubtitle: string | null;
  headerImage: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // [UBAH 2] State baru untuk melacak loading tombol bintang
  const [featuredLoadingId, setFeaturedLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [poemsRes, messagesRes, settingsRes] = await Promise.all([
        fetch('/api/poems?all=true', { cache: 'no-store' }),
        fetch('/api/admin/messages', { cache: 'no-store' }),
        fetch('/api/settings', { cache: 'no-store' }),
      ]);

      const [poemsData, messagesData, settingsData] = await Promise.all([
        poemsRes.json(),
        messagesRes.json(),
        settingsRes.json(),
      ]);

      setPoems(poemsData);
      setMessages(messagesData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminUsername');
      
      toast({
        title: 'Logout Berhasil',
        description: 'Sampai jumpa lagi!',
      });

      router.push('/admin/login'); 
      router.refresh(); 
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // [UBAH 3] Fungsi Toggle Featured dengan Efek Loading
  const toggleFeatured = async (slug: string, currentStatus: boolean) => {
    // Jika sedang loading, hentikan (cegah klik ganda)
    if (featuredLoadingId === slug) return;

    // Nyalakan status loading untuk puisi ini
    setFeaturedLoadingId(slug);

    try {
      const response = await fetch(`/api/poems/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });
      
      if (!response.ok) throw new Error('Gagal update');
      
      await fetchData(); 
      toast({
        title: !currentStatus ? 'Ditambahkan ke Featured' : 'Dihapus dari Featured',
        description: 'Status featured berhasil diupdate',
      });
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      // Matikan status loading (selesai)
      setFeaturedLoadingId(null);
    }
  };

  const deletePoem = async (slug: string) => {
    if (!confirm('Yakin ingin menghapus puisi ini?')) return;
    try {
      const response = await fetch(`/api/poems/${slug}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal hapus');
      await fetchData();
      toast({ title: 'Berhasil', description: 'Puisi dihapus' });
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Hapus pesan ini permanen?')) return;
    try {
      const response = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal hapus');
      await fetchData();
      toast({ title: 'Pesan Dihapus', description: 'Pesan berhasil dihapus' });
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const markAsRead = async (id: string, currentReadStatus: boolean) => {
    if (currentReadStatus) return;

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) throw new Error('Gagal update status');

      await fetchData();
      toast({
        title: 'Pesan Dibaca',
        description: 'Status pesan diperbarui',
      });
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat dashboard...</div>
      </div>
    );
  }

  const stats = {
    totalPoems: poems.length,
    featuredPoems: poems.filter(p => p.isFeatured).length,
    unreadMessages: messages.filter(m => !m.read).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-serif">{settings?.siteTitle || 'Zurayna'} - Admin</h1>
            <p className="text-sm text-muted-foreground">Kelola konten website</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Puisi</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Puisi Featured</CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredPoems} / 2</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pesan Belum Dibaca</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.unreadMessages > 0 ? 'text-primary' : ''}`}>
                {stats.unreadMessages}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 font-serif">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/poems/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Puisi Baru
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan Website
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/submissions">
                <Mail className="mr-2 h-4 w-4" />
                Cek Kiriman Karya
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Poems List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 font-serif">Daftar Puisi</h2>
          <Card>
            <CardContent className="p-0">
              {poems.length > 0 ? (
                <div className="divide-y">
                  {poems.map((poem) => (
                    <div key={poem.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        {poem.coverImage ? (
                          <img src={poem.coverImage} alt={poem.title} className="w-16 h-16 object-cover rounded" />
                        ) : (
                           <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-muted-foreground/50" />
                           </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold font-serif text-lg">{poem.title}</h3>
                            {!poem.published && (
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full border border-gray-300">
                                    Draft
                                </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {poem.isFeatured && (
                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full font-medium">Featured</span>
                            )}
                            <span>{new Date(poem.createdAt).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/poems/${poem.slug}/edit`}><Edit className="h-4 w-4 text-blue-600" /></Link>
                        </Button>
                        
                        {/* [UBAH 4] Tombol Star dengan Loading */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleFeatured(poem.slug, poem.isFeatured)}
                          disabled={featuredLoadingId === poem.slug} // Matikan tombol saat loading
                        >
                          {featuredLoadingId === poem.slug ? (
                            // Tampilkan Icon Putar-Putar
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            // Tampilkan Bintang Normal
                            <Star className={`h-4 w-4 transition-all ${poem.isFeatured ? "fill-yellow-500 text-yellow-500 scale-110" : "text-muted-foreground hover:text-yellow-400"}`} />
                          )}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => deletePoem(poem.slug)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-8 text-center text-muted-foreground">Belum ada puisi</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4 font-serif">Pesan Masuk (Kritik & Saran)</h2>
          <Card>
            <CardContent className="p-0">
              {messages.length > 0 ? (
                <div className="divide-y">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-4 transition-all duration-300 ${msg.read ? 'bg-background opacity-70' : 'bg-primary/5 border-l-4 border-primary'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${msg.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {msg.name}
                            </h3>
                            {!msg.read && (
                              <span className="px-2 py-0.5 text-[10px] bg-primary text-primary-foreground rounded-full animate-pulse">
                                Baru
                              </span>
                            )}
                             {msg.read && (
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground border px-2 rounded-full">
                                <MailOpen className="h-3 w-3" /> Dibaca
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{msg.email}</p>
                          <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50">
                            "{msg.message}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(msg.createdAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex flex-col gap-2">
                          {!msg.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:bg-primary/10 hover:text-primary"
                              onClick={() => markAsRead(msg.id, msg.read)}
                              title="Tandai Sudah Dibaca"
                            >
                              <Check className="h-5 w-5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteMessage(msg.id)}
                            title="Hapus Pesan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                  <p>Belum ada pesan kritik atau saran</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}