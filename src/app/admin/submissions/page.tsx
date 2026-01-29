'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, User, Mail, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  name: string;
  email: string;
  title: string;
  content: string;
  coverImage: string | null; // [BARU]
  createdAt: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    if(!confirm("Setujui karya ini? Karya akan masuk ke daftar Draft Puisi.")) return;
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'POST' });
      if(!res.ok) throw new Error("Gagal");
      toast({ title: "Berhasil", description: "Karya disetujui & dipindahkan ke Draft" });
      setSubmissions(s => s.filter(i => i.id !== id));
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    if(!confirm("Hapus kiriman ini?")) return;
    try {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      toast({ title: "Dihapus", description: "Kiriman dihapus" });
      setSubmissions(s => s.filter(i => i.id !== id));
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild><Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4"/> Dashboard</Link></Button>
        <h1 className="text-3xl font-bold font-serif">Kiriman Karya Masuk</h1>
      </div>

      <div className="grid gap-6">
        {submissions.length === 0 && !loading && <p className="text-center text-muted-foreground">Tidak ada kiriman baru.</p>}
        {submissions.map((sub) => (
          <Card key={sub.id} className="overflow-hidden">
            <CardHeader className="bg-muted/20 pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="font-serif text-xl mb-2">{sub.title}</CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3"/> {sub.name}</span>
                    {sub.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3"/> {sub.email}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(sub.id)} className="bg-green-600 hover:bg-green-700"><Check className="mr-1 h-4 w-4"/> Terima</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(sub.id)}><X className="mr-1 h-4 w-4"/> Tolak</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex gap-6 flex-col md:flex-row">
              {/* Preview Gambar jika ada */}
              {sub.coverImage && (
                <div className="w-full md:w-48 shrink-0">
                    <div className="aspect-video rounded-md overflow-hidden border">
                        <img src={sub.coverImage} alt={sub.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center flex items-center justify-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Ada Cover
                    </p>
                </div>
              )}
              
              <div className="flex-1">
                <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed">{sub.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}