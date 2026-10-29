// Shared editorial content for the static pages and browser enhancements.
export const periods = [
  {
    year: 'Sebelum 1945', label: 'PERIODE 01', title: 'Akar kolonial, warisan simbolik',
    summary: 'Nama Bhayangkara mengingatkan pada sejarah Majapahit. Namun, akar organisasi kepolisian modern perlu dibaca melalui administrasi Hindia Belanda dan pendudukan Jepang, bukan dianggap sebagai satu garis kelembagaan yang tidak terputus.',
    facts: ['WARISAN NAMA', 'KEPOLISIAN KOLONIAL', 'PENDUDUKAN JEPANG'], stamp: 'AKAR',
    source: 'Bedakan arsip sezaman dari kajian sejarah sesudahnya. Buku Marieke Bloembergen (2011) adalah sumber sekunder; foto dan terbitan sezaman harus dibaca bersama konteks pembuatannya.',
    sourceHref: 'sources.html#history', sourceLinks: [{label: 'Catatan sejarah & arsip', href: 'sources.html#history'}]
  },
  {
    year: '1945—1960-an', label: 'PERIODE 02', title: 'Polisi dalam negara yang baru berdiri',
    summary: 'Pembentukan negara Indonesia juga mengubah kedudukan kepolisian. Catatan penyusun menempatkan proklamasi Pasukan Polisi Republik Indonesia di Surabaya pada 21 Agustus 1945 dan penetapan Djawatan Kepolisian Negara pada 1 Juli 1946 sebagai penanda awal. Perubahan menuju integrasi perlu dibaca sebagai proses bertahap.',
    facts: ['21 AGUSTUS 1945', '1 JULI 1946', 'UU 13/1961'], stamp: 'REVOLUSI',
    source: 'Penanda 1945 dan 1946 mengikuti catatan penyusun; salinan arsip primernya belum dicocokkan. UU 13/1961 ditautkan sebagai dokumen hukum periode ini. Batas 1960-an adalah rentang transisi kuratorial, bukan satu tanggal integrasi.',
    sourceHref: 'sources.html#history', sourceLinks: [{label: 'Dokumen & konteks periode', href: 'sources.html#history'}]
  },
  {
    year: '1960-an—1999', label: 'PERIODE 03', title: 'Integrasi dan hubungan kewenangan',
    summary: 'Selama integrasi dalam ABRI, kepolisian berada dalam tatanan keamanan yang berbeda dari kepolisian sipil saat ini. Membaca periode ini memerlukan perhatian pada jalur komando, pendidikan, tugas, dan hubungan institusi dengan masyarakat.',
    facts: ['INTEGRASI DALAM ABRI', 'PENDIDIKAN', 'JALUR KOMANDO'], stamp: 'INTEGRASI',
    source: 'Rentang 1960-an menandai transisi bertahap; batas ini tidak menyatakan bahwa integrasi dimulai pada satu tahun tertentu. Pameran tidak menempatkan integrasi sebagai satu-satunya penjelasan persoalan kepolisian. Periksa UU 13/1961 dan Inpres 2/1999 untuk konteks hukum.',
    sourceHref: 'sources.html#history', sourceLinks: [{label: 'Baca dasar periodisasi', href: 'sources.html#history'}]
  },
  {
    year: '1999—2024', label: 'PERIODE 04', title: 'Pemisahan dan kepolisian sipil',
    summary: 'Pemisahan Polri dari ABRI pada 1999 diikuti TAP MPR VI dan VII Tahun 2000 serta UU Nomor 2 Tahun 2002. Kerangka ini membedakan peran pertahanan dan keamanan, mengatur kedudukan Polri, dan menjadi dasar pemeriksaan kewenangannya.',
    facts: ['PEMISAHAN 1999', 'TAP MPR VI & VII', 'UU 2/2002'], stamp: 'REFORMASI',
    source: 'Baca UU 2/2002 Pasal 8 dan 11 tentang kedudukan serta pengangkatan Kapolri, Pasal 13 tentang tugas, Pasal 18 tentang diskresi, dan Pasal 28 tentang netralitas serta jabatan di luar kepolisian.',
    sourceHref: 'sources.html#law', sourceLinks: [{label: 'UU 2/2002', href: 'https://peraturan.go.id/id/uu-no-2-tahun-2002'}, {label: 'TAP MPR & catatan pasal', href: 'sources.html#law'}]
  },
  {
    year: '2025—2026', label: 'PERIODE 05', title: 'Mengukur perubahan yang dialami warga',
    summary: 'Perdebatan reformasi berlanjut dengan pertanyaan yang sama pentingnya: apakah warga memperoleh penjelasan, perlakuan adil, serta tindak lanjut? Pameran ini mengutamakan dokumen yang dapat diperiksa dan memisahkan usulan dari kebijakan yang telah berlaku.',
    facts: ['AKUNTABILITAS', 'PENGALAMAN WARGA', 'BUKTI PERUBAHAN'], stamp: 'UJI',
    source: 'Catatan awal memuat sejumlah angka survei dan peristiwa kontemporer yang belum disertai laporan primer. Angka tersebut tidak dipakai sebagai kesimpulan statistik dalam pameran ini; statusnya dicatat di perpustakaan sumber.',
    sourceHref: 'sources.html#verification', sourceLinks: [{label: 'Status klaim kontemporer', href: 'sources.html#verification'}]
  }
];

export const artifacts = [
  {
    type: 'paper', date: '2002 · DOKUMEN HUKUM', title: 'Membaca mandat kepolisian',
    copy: 'Pasal 13 UU 2/2002 menyebut tiga tugas pokok: memelihara keamanan dan ketertiban masyarakat; menegakkan hukum; serta memberikan perlindungan, pengayoman, dan pelayanan kepada masyarakat. Mandat ini membantu pengunjung menguji hubungan antara aturan dan layanan yang dialami warga.',
    source: 'Visual sampul merupakan ilustrasi editorial. Teks pasal dirujuk ke UU Nomor 2 Tahun 2002, bukan ke dokumen gambar tersebut.',
    sourceHref: 'https://peraturan.go.id/id/uu-no-2-tahun-2002', sourceLinks: [{label: 'Buka naskah resmi UU 2/2002', href: 'https://peraturan.go.id/id/uu-no-2-tahun-2002'}]
  },
  {
    type: 'map', date: '1999—2002 · PERUBAHAN KEWENANGAN', title: 'Dari integrasi ke pemisahan',
    copy: 'Pemisahan TNI dan Polri membedakan fungsi pertahanan dari keamanan dan ketertiban masyarakat. Peta konseptual ini mengarahkan pembacaan kepada tiga hubungan: kedudukan institusi, mandat tugas, dan mekanisme pertanggungjawaban. Ia tidak menggantikan bagan organisasi resmi.',
    source: 'Diagram editorial. Periksa TAP MPR VI/MPR/2000, TAP MPR VII/MPR/2000, dan UU 2/2002 untuk bunyi ketentuan.',
    sourceHref: 'sources.html#law', sourceLinks: [{label: 'Baca dokumen pemisahan', href: 'sources.html#law'}]
  },
  {
    type: 'press', date: '2009 · HAK DALAM PELAYANAN', title: 'Apa yang berhak diketahui warga?',
    copy: 'Standar pelayanan membantu warga mengetahui persyaratan, prosedur, waktu penyelesaian, biaya, produk layanan, dan penanganan pengaduan. UU 25/2009 Pasal 21 menjadi dasar membaca komponen tersebut. Simulasi di ruang berikutnya mengubah prinsip ini menjadi satu kasus pembelajaran.',
    source: 'Ilustrasi editorial, bukan kliping pers. Komponen standar pelayanan mengacu pada Pasal 21 UU Nomor 25 Tahun 2009.',
    sourceHref: 'https://peraturan.go.id/id/uu-no-25-tahun-2009', sourceLinks: [{label: 'Buka UU Pelayanan Publik', href: 'https://peraturan.go.id/id/uu-no-25-tahun-2009'}]
  }
];

export const reformLenses = [
  {title: 'Dasar hukum', copy: 'Periksa kewenangan yang diberikan, pembatasannya, dan hak warga dalam teks yang berlaku. Perubahan aturan memberi dasar pengujian; hasilnya perlu dibuktikan dalam praktik.', evidence: 'UU 2/2002; TAP MPR VI dan VII Tahun 2000; UU 25/2009; UU 14/2008. Baca pasal bersama penjelasan serta status perubahannya.'},
  {title: 'Struktur & pengawasan', copy: 'Telusuri siapa mengambil keputusan, siapa memeriksa pelanggaran, dan bagaimana warga memperoleh tindak lanjut. Pisahkan pengawasan internal, pengawasan eksternal, dan pengawasan politik.', evidence: 'Aturan kewenangan, alur pengaduan, laporan pemeriksaan, publikasi tindak lanjut, dan alokasi program yang dapat ditelusuri.'},
  {title: 'Praktik layanan', copy: 'Baca apa yang benar-benar terjadi saat warga mencari bantuan: penjelasan prosedur, ketepatan waktu, perlakuan petugas, serta alasan sebuah keputusan. Bandingkan dengan standar layanan yang dipublikasikan.', evidence: 'Standar unit layanan, waktu respons yang didefinisikan, bukti penerimaan laporan, alasan penyelesaian, dan audit keluhan berulang.'},
  {title: 'Pengalaman warga', copy: 'Dengarkan pengalaman orang yang menggunakan layanan. Kepercayaan kepada sebuah lembaga, kepuasan terhadap layanan, dan pengalaman perlakuan adil merupakan pertanyaan yang berbeda.', evidence: 'Survei dengan kuesioner dan metode yang terbuka, wawancara berizin, serta penjelasan tentang kelompok yang belum terwakili.'}
];

export const evidence = [
  {date: 'DASAR HUKUM', title: 'Apa mandatnya?', copy: 'Tugas dan kewenangan dapat dibaca melalui dokumen hukum. Sumber tertulis tersedia; penilaian kepatuhan tetap membutuhkan bukti pelaksanaan.', status: 'Dokumen tersedia', indicator: 'Kesesuaian tindakan dengan tugas, batas kewenangan, dan hak warga.', needs: 'Teks pasal, status peraturan, dan alasan tindakan.', sourceHref: 'sources.html#law'},
  {date: 'LAYANAN', title: 'Apa yang dijanjikan kepada warga?', copy: 'Persyaratan, waktu, biaya, keluaran, dan kanal pengaduan perlu dinyatakan pada setiap jenis layanan. Belum ada dataset standar per unit dalam pameran.', status: 'Kerangka tersedia', indicator: 'Cakupan layanan dengan standar yang dipublikasikan.', needs: 'Standar unit, tanggal berlaku, tarif resmi, serta bukti penerimaan.', sourceHref: 'sources.html#service'},
  {date: 'PENGAWASAN', title: 'Apa arti sebuah aduan selesai?', copy: 'Jawaban, pemeriksaan, pemulihan, dan sanksi adalah keluaran berbeda. Jumlah aduan perlu disertai definisi penyelesaian dan periode pencatatan.', status: 'Data belum tersedia', indicator: 'Waktu tindak lanjut, jenis penyelesaian, dan keluhan berulang.', needs: 'Laporan teragregasi, definisi status, dan hasil audit.', sourceHref: 'sources.html#verification'},
  {date: 'PENGALAMAN', title: 'Siapa yang sudah didengar?', copy: 'Survei kepercayaan tidak otomatis menggambarkan pengalaman pengguna layanan. Angka dari catatan awal belum disertai laporan asli sehingga tidak ditampilkan sebagai ukuran capaian.', status: 'Laporan perlu ditelusuri', indicator: 'Kejelasan informasi, perlakuan hormat, kesempatan didengar.', needs: 'Kuesioner, populasi, sampel, waktu lapangan, dan pembobotan.', sourceHref: 'sources.html#surveys'},
  {date: 'PERUBAHAN', title: 'Apakah hasilnya bertahan?', copy: 'Peta jalan di bawah adalah usulan pembelajaran. Ukuran perubahan memerlukan data awal, penilaian berkala, dan catatan koreksi kebijakan yang terbuka.', status: 'Usulan kuratorial', indicator: 'Perubahan hasil layanan dan tindak lanjut antarperiode.', needs: 'Baseline, target tahunan, penanggung jawab, dan evaluasi independen.', sourceHref: 'sources.html#roadmap'}
];

export const roadmap = [
  {year: '2026—2029', title: 'Bangun jejak layanan', target: 'Seluruh layanan pada unit percontohan memiliki standar dan nomor jejak.', baseline: 'Pendataan awal unit dan standar harus dilakukan sebelum target dihitung.', measure: 'Cakupan standar terbit; kelengkapan log; median waktu respons; alasan penutupan aduan.', owner: 'Usulan koordinator: unit layanan Polri, bersama pengawas internal dan mitra pengawas eksternal.', milestone: '2026: pemetaan awal. 2027: uji unit percontohan. 2028: evaluasi. 2029: keputusan perluasan.', budget: 'Usulan kebutuhan: perancangan layanan, pelatihan, sistem pencatatan, dan evaluasi. Nominal menunggu perhitungan biaya; bukan alokasi APBN.', items: []},
  {year: '2030—2035', title: 'Uji hasilnya bersama', target: 'Unit yang diperluas menerbitkan evaluasi tahunan dengan pemeriksaan independen.', baseline: 'Hasil pilot 2026–2029 dan perbedaan kondisi antarunit.', measure: 'Keluhan berulang; kepatuhan waktu; tindak lanjut pemeriksaan; kesenjangan pengalaman antarwilayah.', owner: 'Usulan koordinator: Polri dan lembaga pengawas sesuai kewenangan, dengan mitra riset independen.', milestone: '2030: tetapkan cakupan. 2031–2034: audit dan koreksi tahunan. 2035: evaluasi menyeluruh.', budget: 'Usulan kebutuhan: audit, penelitian pengguna, integrasi data, dan perbaikan akses. Biaya ditetapkan setelah cakupan diketahui.', items: []},
  {year: '2036—2045', title: 'Rawat akuntabilitas', target: 'Catatan lintas periode tetap dapat diperiksa dan hasil evaluasi memengaruhi perbaikan kebijakan.', baseline: 'Mutu dan kesinambungan data serta hasil evaluasi sampai 2035.', measure: 'Kelengkapan seri data; waktu koreksi; keterlibatan warga; tindak lanjut pengawasan.', owner: 'Usulan koordinator: pemilik layanan dan lembaga pengawas, dengan partisipasi publik.', milestone: 'Evaluasi tahunan; peninjauan antartahap pada 2040; evaluasi akhir 2045.', budget: 'Usulan kebutuhan: pemeliharaan, pengarsipan, aksesibilitas, dan partisipasi warga. Pendanaan harus dinilai berkala.', items: []}
];
for (const item of roadmap) item.items = [`Target: ${item.target}`, `Indikator: ${item.measure}`, `Tahapan: ${item.milestone}`, `Penanggung jawab: ${item.owner}`, `Anggaran: ${item.budget}`];

export const frameStories = [
  {meta: 'ARSIP / 01 · ILUSTRASI EDITORIAL', title: 'Ruang asal-usul', copy: 'Dari mana kita menelusuri sebuah institusi? Nama, simbol, dan organisasi memiliki sejarah yang berbeda. Ilustrasi ini membuka pembacaan tentang masa kolonial dan pendudukan Jepang; tidak menggambarkan bangunan atau peristiwa tertentu.', className: 'image-origin', credit: 'Ilustrasi editorial The Living Archive · tidak memiliki nomor arsip sejarah.', sourceHref: 'sources.html#visuals'},
  {meta: 'ARSIP / 02 · ILUSTRASI EDITORIAL', title: 'Barisan revolusi', copy: 'Pada masa revolusi, kepolisian ikut mencari bentuknya di tengah negara yang baru berdiri. Ilustrasi ini mengajak pembaca menelusuri dokumen pembentukan, tokoh, dan keputusan kelembagaan pada periode 1945–1960-an.', className: 'image-revolution', credit: 'Ilustrasi editorial The Living Archive · bukan dokumentasi peristiwa revolusi.', sourceHref: 'sources.html#visuals'},
  {meta: 'ARSIP / 03 · PETA KONSEPTUAL', title: 'Mandat & pengawasan', copy: 'Mandat dijalankan oleh Polri, diatur melalui hukum, dan diperiksa melalui mekanisme pengawasan internal serta eksternal. Diagram ini membedakan hubungan mandat, pelaksanaan layanan, dan pertanggungjawaban; bukan bagan komando resmi.', className: 'image-command', credit: 'Diagram editorial · baca bersama UU 2/2002 dan aturan lembaga pengawas.', sourceHref: 'sources.html#law'},
  {meta: 'ARSIP / 04 · ILUSTRASI EDITORIAL', title: 'Dari sudut pandang warga', copy: 'Perubahan kelembagaan juga hadir dalam pengalaman sehari-hari: menerima penjelasan, menyampaikan persoalan, mengetahui alasan keputusan, dan memperoleh tindak lanjut. Warga berhak memahami proses yang mereka jalani.', className: 'image-public', credit: 'Ilustrasi editorial The Living Archive · konteks hak pelayanan mengacu pada UU 25/2009.', sourceHref: 'sources.html#service'},
  {meta: 'ARSIP / 05 · CATATAN KURATORIAL', title: 'Bagaimana perubahan dibuktikan?', copy: 'Perubahan perlu dapat diperiksa melalui dokumen, data pelaksanaan, dan pengalaman warga. Mulailah dengan satu pertanyaan sederhana: bukti apa yang diperlukan untuk menilai sebuah janji layanan?', className: 'image-reform', credit: 'Ilustrasi editorial The Living Archive · usulan pembelajaran akuntabilitas.', sourceHref: 'sources.html#verification'}
];

// Archival photographs retain their original dates and contexts.
Object.assign(frameStories[0], {
  meta: 'ARSIP / 01 · SEKITAR 1930', title: 'Kantor polisi pada masa kolonial',
  image: 'assets/photos/police-office-c1930.jpg', alt: 'Foto kantor polisi di Hindia Belanda, sekitar 1930; kota tidak tercatat dalam katalog.',
  copy: 'Foto ini memperlihatkan kantor polisi di Hindia Belanda sekitar 1930. Kota dan tanggal tepatnya tidak tercatat dalam katalog. Sebagai arsip kolonial, gambar ini membantu membaca konteks kelembagaan pada zamannya; bukan bukti satu garis organisasi yang tidak terputus hingga Polri.',
  credit: 'Fotografer anonim · KITLV 141960, Leiden University Libraries · CC BY 4.0. Pindai diperkecil; tepi gambar dapat terpotong pada bingkai.',
  sourceHref: 'sources.html#photo-colonial-office'
});
Object.assign(frameStories[1], {
  meta: 'ARSIP / 02 · TERBIT 15 FEBRUARI 1943', title: 'Pelajaran bahasa Jepang bagi polisi',
  image: 'assets/photos/police-lessons-1943.jpg', alt: 'Polisi mengikuti pelajaran bahasa Jepang dalam foto majalah Djawa Baroe, terbit 15 Februari 1943, halaman 10.',
  copy: 'Dimuat dalam Djawa Baroe, volume 1 nomor 4, halaman 10, foto ini merekam pelajaran bahasa Jepang bagi polisi pada masa pendudukan. Tanggal 15 Februari 1943 adalah tanggal terbit majalah, bukan tanggal pemotretan yang dapat dipastikan. Media pendudukan perlu dibaca bersama kepentingan penerbitnya.',
  credit: 'Fotografer tidak diketahui · Djawa Baroe, 15 Februari 1943, hlm. 10 · domain publik menurut katalog Wikimedia Commons. Pindai diperkecil.',
  sourceHref: 'sources.html#photo-police-education'
});
Object.assign(frameStories[3], {
  meta: 'ARSIP / 04 · JAKARTA, 11 SEPTEMBER 2016', title: 'Polisi di ruang jalan Jakarta',
  image: 'assets/photos/jakarta-traffic-2016.jpg', alt: 'Dokumentasi polisi dan lalu lintas di Jakarta, 11 September 2016, oleh BxHxTxCx.',
  copy: 'Ruang jalan adalah salah satu tempat warga bertemu dengan layanan kepolisian. Foto Jakarta pada 11 September 2016 ini menjadi pengantar untuk membicarakan interaksi tersebut. Sebuah foto tunggal tidak dapat menyimpulkan mutu layanan secara keseluruhan ataupun membuktikan peristiwa reformasi 2025–2026.',
  credit: 'BxHxTxCx (using album) · Flickr / Wikimedia Commons · CC BY-SA 2.0. Foto diperkecil; tepi gambar dapat terpotong pada bingkai. Adaptasi mengikuti lisensi yang sama.',
  sourceHref: 'sources.html#photo-public-service'
});
Object.assign(periods[0], {image: frameStories[0].image, alt: frameStories[0].alt});
Object.assign(periods[3], {image: frameStories[3].image, alt: frameStories[3].alt});
