import { db } from './src/lib/db';

async function seedData() {
  console.log('Seeding database...');

  // Create admin user
  const existingAdmin = await db.user.findUnique({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    const crypto = await import('crypto');
    const hashedPassword = crypto.createHash('sha256').update('admin123').digest('hex');
    
    await db.user.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });
    console.log('✓ Admin user created (username: admin, password: admin123)');
  }

  // Create site settings
  const existingSettings = await db.siteSettings.findFirst();
  
  if (!existingSettings) {
    await db.siteSettings.create({
      data: {
        siteTitle: 'Zurayna',
        siteSubtitle: 'Ruang Pribadi untuk Kumpulan Puisi',
        headerImage: '/uploads/hero-banner.jpg',
      }
    });
    console.log('✓ Site settings created');
  } else {
    await db.siteSettings.update({
      where: { id: existingSettings.id },
      data: {
        headerImage: '/uploads/hero-banner.jpg'
      }
    });
    console.log('✓ Site settings updated');
  }

  // Create sample poems with cover images
  const poems = [
    {
      title: 'Senja di Pelataran',
      slug: 'senja-di-pelataran',
      excerpt: 'Ketika matahari pergi meninggalkan jejak emas di langit, aku duduk menunggu sebait kata yang belum sampai...',
      content: `Ketika matahari pergi
meninggalkan jejak emas di langit,
aku duduk menunggu
sebait kata yang belum sampai

Di pelataran yang sunyi
langit berubah warna
dari jingga ke ungu
seolah menyimpan cerita
yang tak pernah terucap

Aku menulis di atas angin
membentuk rindu yang tak berbentuk
sembari menanti malam
yang membawa bintang-bintang
untuk menerangi hari esok

Mungkin puisi ini
tak akan pernah selesai
seperti rasa yang terus mengalir
mengisi ruang-ruang kosong
di antara senja dan malam`,
      coverImage: '/uploads/poem-cover-1.jpg',
      category: 'Refleksi',
      isFeatured: true,
      published: true
    },
    {
      title: 'Jejak Kaki di Pasir',
      slug: 'jejak-kaki-di-pasir',
      excerpt: 'Di sepanjang pantai, aku menulis namamu di pasir. Ombak datang menyapu, membawa namaku ke laut yang tak bertepi...',
      content: `Di sepanjang pantai
aku menulis namamu di pasir
setiap huruf
setiap garis
adalah doa yang tak bersuara

Ombak datang menyapu
membawa namaku ke laut
ke tempat di mana
semua rasa bisa berlabuh
tanpa harus diucapkan

Aku ikuti jejakmu
meski bayangannya samar
di antara riak air
dan sinar matahari
yang perlahan tenggelam

Mungkin di sana
di ujung laut yang tak terlihat
kau juga menunggu
sambil memegang kerikil
yang sama kita pegang dulu`,
      coverImage: '/uploads/poem-cover-2.jpg',
      category: 'Spiritual',
      isFeatured: true,
      published: true
    },
    {
      title: 'Pagar Rumah Tua',
      slug: 'pagar-rumah-tua',
      excerpt: 'Pagar kayu yang sudah rapuh, menyimpan cerita-cerita dari masa lalu. Di sana aku belajar arti kesabaran...',
      content: `Pagar kayu yang sudah rapuh
menyimpan cerita-cerita
dari masa lalu
yang tak pernah tertulis

Di antara celah-celahnya
tumbuh rumput hijau
kehidupan yang tetap tumbuh
meski ditinggalkan waktu

Aku duduk di depannya
menatap jalan yang menembus
ke arah tempat yang belum pernah
ku jejak sebelumnya

Mungkin rumah ini bukan milikku
tapi kenangan yang tinggal
adalah harta yang tak ternilai
untuk dibawa ke mana saja`,
      coverImage: '/uploads/poem-cover-3.jpg',
      category: 'Nostalgia',
      isFeatured: false,
      published: true
    },
    {
      title: 'Malam yang Berbisik',
      slug: 'malam-yang-berbisik',
      excerpt: 'Dalam keheningan malam, aku mendengar bisikan-bisikan lembut. Mereka membawa pesan dari tempat yang jauh...',
      content: `Dalam keheningan malam
aku mendengar bisikan-bisikan lembut
membawa pesan
dari tempat yang jauh

Mereka berbisik tentang rasa
yang tersimpan di balik dada
tentang harapan yang belum pupus
tentang cinta yang tak pernah mati

Aku menyalakan lampu kecil
di pojok kamar
menjadi saksi bisu
dari percakapan antara hati
dan bintang di langit

Esok mungkin akan datang
tapi malam ini
aku biarkan diri tenggelam
dalam kelembutan yang tak bertepi`,
      coverImage: '/uploads/poem-cover-4.jpg',
      category: 'Refleksi',
      isFeatured: false,
      published: true
    }
  ];

  for (const poem of poems) {
    const existing = await db.poem.findUnique({
      where: { slug: poem.slug }
    });

    if (!existing) {
      await db.poem.create({ data: poem });
      console.log(`✓ Created poem: ${poem.title}`);
    }
  }

  console.log('Database seeding complete!');
}

seedData().catch(console.error);
