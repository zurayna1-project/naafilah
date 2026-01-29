'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Upload, ImageIcon, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SubmitPoemPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', title: '', content: '' });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'poem-cover'); // Folder penyimpanan

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal upload');

      setCoverImage(data.path);
      toast({ title: 'Upload Berhasil', description: 'Gambar cover siap dikirim' });
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal upload gambar', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverImage, // Kirim URL gambar juga
        }),
      });

      if (!res.ok) throw new Error('Gagal mengirim');
      
      setSuccess(true);
      toast({ title: 'Terkirim!', description: 'Karyamu akan direview oleh admin.' });
    } catch (error) {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan sistem.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-10 w-10" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold mb-4">Terima Kasih!</h1>
          <p className="text-muted-foreground mb-8">Karyamu sudah kami terima. Admin akan memeriksanya sebelum diterbitkan di galeri Zurayna.</p>
          <Link href="/"><Button>Kembali ke Beranda</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <span className="mx-auto font-serif font-bold text-xl">Kirim Karyamu</span>
          <div className="w-16"></div> 
        </div>
      </nav>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl font-bold mb-2">Mari Berkarya</h2>
                  <p className="text-muted-foreground">Bagikan perasaanmu melalui kata-kata. Sertakan gambar cover jika ada.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <Label>Cover Gambar (Opsional)</Label>
                    <div className="flex flex-col gap-4">
                        {coverImage ? (
                            <div className="relative aspect-video overflow-hidden rounded-lg border-2 bg-muted">
                                <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={removeCoverImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground mb-4">
                                    Upload gambar pendukung (JPG/PNG)
                                </div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    disabled={uploading}
                                    onClick={triggerFileInput}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {uploading ? 'Mengupload...' : 'Pilih Gambar'}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Penulis *</Label>
                      <Input 
                        required 
                        placeholder="Nama panggilanmu" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email (Opsional)</Label>
                      <Input 
                        type="email" 
                        placeholder="Untuk info update" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Judul Puisi *</Label>
                    <Input 
                      required 
                      placeholder="Berikan judul yang menarik" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Isi Puisi *</Label>
                    <Textarea 
                      required 
                      placeholder="Tuliskan bait-bait indahmu di sini..." 
                      className="min-h-[300px] font-serif text-lg leading-relaxed"
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? 'Mengirim...' : 'Kirim Karya'} <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}