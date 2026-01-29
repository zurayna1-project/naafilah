'use client';

import { useState, useRef } from 'react'; // [Edit] Tambah useRef
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function NewPoemPage() {
  const router = useRouter();
  
  // [Edit] Buat referensi ke input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: '',
    isFeatured: false,
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'poem-cover');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal upload');

      setCoverImage(data.path);
      toast({
        title: 'Upload Berhasil',
        description: 'Gambar cover berhasil diupload',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal upload gambar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // [Edit] Fungsi pemicu klik manual
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/poems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          coverImage,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal membuat puisi');

      toast({
        title: 'Berhasil',
        description: 'Puisi berhasil dibuat',
      });

      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal membuat puisi',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Tambah Puisi Baru</CardTitle>
              <CardDescription>Buat puisi baru dengan cover image</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex flex-col gap-4">
                    {coverImage ? (
                      <div className="relative aspect-video overflow-hidden rounded-lg border-2">
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
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
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload gambar cover untuk puisi
                        </p>
                        
                        {/* [Edit] Button Klik Langsung */}
                        <Button 
                          type="button" 
                          variant="outline" 
                          disabled={uploading}
                          onClick={triggerFileInput}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploading ? 'Mengupload...' : 'Pilih Gambar'}
                        </Button>
                        
                        {/* [Edit] Input File dengan Ref */}
                        <input
                          ref={fileInputRef}
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Puisi *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Masukkan judul puisi"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="slug-otomatis-dari-judul"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Slug akan otomatis dibuat dari judul, tapi bisa diedit
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Contoh: Refleksi, Cinta, Alam"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Isi Puisi *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Tulis isi puisi di sini..."
                    rows={12}
                    required
                    className="font-serif text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Gunakan enter untuk baris baru pada puisi
                  </p>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked })
                    }
                  />
                  <Label htmlFor="featured">Tampilkan di Papan Atas (Featured)</Label>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? 'Menyimpan...' : 'Simpan Puisi'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/dashboard')}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}