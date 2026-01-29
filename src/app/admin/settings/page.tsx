'use client';

import { useEffect, useState, useRef } from 'react'; // [Edit] Tambah useRef
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Settings {
  id: string;
  siteTitle: string;
  siteSubtitle: string | null;
  headerImage: string | null;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  
  // [Edit] Buat referensi ke input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    siteTitle: 'Zurayna',
    siteSubtitle: '',
  });
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      setFormData({
        siteTitle: data.siteTitle || 'Zurayna',
        siteSubtitle: data.siteSubtitle || '',
      });
      setHeaderImage(data.headerImage);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'header');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal upload');

      setHeaderImage(data.path);
      toast({
        title: 'Upload Berhasil',
        description: 'Header background berhasil diupload',
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

  // [Edit] Fungsi untuk memicu klik pada input file tersembunyi
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          headerImage,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal update settings');

      toast({
        title: 'Berhasil',
        description: 'Pengaturan berhasil disimpan',
      });

      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal update settings',
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

  const removeHeaderImage = () => {
    setHeaderImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat pengaturan...</div>
      </div>
    );
  }

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
              <CardTitle className="font-serif text-2xl">Pengaturan Website</CardTitle>
              <CardDescription>
                Atur judul dan background header website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Background Upload */}
                <div className="space-y-2">
                  <Label>Header Background (Gambar Latar Homepage)</Label>
                  <div className="flex flex-col gap-4">
                    {headerImage ? (
                      <div className="relative aspect-video overflow-hidden rounded-lg border-2">
                        <img
                          src={headerImage}
                          alt="Header preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeHeaderImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload gambar untuk background header homepage
                        </p>
                        
                        {/* [Edit] Button Klik Langsung (Tanpa Label Wrapper) */}
                        <Button 
                          type="button" 
                          variant="outline" 
                          disabled={uploading}
                          onClick={triggerFileInput} // Panggil fungsi trigger
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploading ? 'Mengupload...' : 'Pilih Gambar'}
                        </Button>

                        {/* [Edit] Input File dengan Ref */}
                        <input
                          ref={fileInputRef} // Sambungkan Ref
                          id="header-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Ukuran rekomendasi: 1440x720px (landscape)
                    </p>
                  </div>
                </div>

                {/* Site Title */}
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Judul Website *</Label>
                  <Input
                    id="siteTitle"
                    name="siteTitle"
                    value={formData.siteTitle}
                    onChange={handleChange}
                    placeholder="Zurayna"
                    required
                  />
                </div>

                {/* Site Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="siteSubtitle">Subtitle Website</Label>
                  <Textarea
                    id="siteSubtitle"
                    name="siteSubtitle"
                    value={formData.siteSubtitle}
                    onChange={handleChange}
                    placeholder="Ruang Pribadi untuk Kumpulan Puisi"
                    rows={2}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
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