'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal mengirim pesan');

      toast({
        title: 'Pesan Terkirim',
        description: 'Terima kasih atas pesan Anda.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengirim pesan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAVBAR (Sudah ada Kirim Karya) */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">Beranda</Link>
          <Link href="/kumpulan-puisi" className="text-foreground hover:text-primary transition-colors font-medium">Puisi</Link>
          {/* [INI TOMBOL BARUNYA] */}
          <Link href="/kirim-karya" className="text-foreground hover:text-primary transition-colors font-medium">Kirim Karya</Link>
          <Link href="/kontak" className="text-foreground hover:text-primary transition-colors font-medium">Kontak</Link>
        </div>
      </nav>

      <main className="flex-1 px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-muted-foreground text-lg font-serif">
              Punya kritik, saran, atau sekadar ingin menyapa? Kami siap mendengar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Info Kontak</CardTitle>
                  <CardDescription>Jalur lain untuk terhubung dengan Zurayna.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">zurayna1@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Tentang</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Wadah ekspresi rasa melalui kata-kata. 
                        Setiap pesan yang masuk sangat berarti bagi pengembangan ruang ini.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@contoh.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tulis pesan Anda di sini..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={sending}>
                      {sending ? 'Mengirim...' : 'Kirim Pesan'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}