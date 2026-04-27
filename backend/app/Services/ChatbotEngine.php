<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\Deteksi;
use App\Models\KnowledgeBase;
use App\Models\UnansweredQuestion;
use Carbon\Carbon;

class ChatbotEngine
{
    public function __construct(
        private IntentClassifier $classifier
    ) {}

    public function process(string $sessionId, int $deteksiId, string $text): array
    {
        $session = ChatSession::firstOrCreate(
            ['session_id' => $sessionId],
            ['deteksi_id' => $deteksiId, 'history' => [], 'context' => []]
        );

        $deteksi = Deteksi::with('balita')->find($deteksiId);
        if (!$deteksi) {
            return ['status' => 'error', 'message' => 'Data deteksi tidak ditemukan'];
        }

        $intentResult = $this->classifier->classify($text);
        $intent = $intentResult['intent'];
        $confidence = $intentResult['confidence'];

        $previousTopic = $session->current_topic;

        if ($intent === 'reset_chat') {
            return $this->handleResetChat($session);
        }

        $response = null;

        if ($confidence >= 0.70) {
            $response = match ($intent) {
                'tanya_kondisi'   => $this->handleKondisi($deteksi),
                'tanya_solusi'    => $this->handleSolusi($deteksi, $previousTopic),
                'tanya_makanan'   => $this->handleMakanan($deteksi),
                'tanya_susu'      => $this->handleSusu($deteksi),
                'tanya_sanitasi'  => $this->handleSanitasi($deteksi),
                'tanya_penyebab'  => $this->handlePenyebab($deteksi),
                'tanya_definisi'  => $this->handleDefinisi($text, $deteksi),
                'sapaan'          => $this->handleSapaan($text, $session),
                'grafik'          => $this->handleGrafik($deteksi),
                'grafik_analisis' => $this->handleGrafikAnalysis($deteksi),
                default => null,
            };
        }

        //search knowledge_base
        if (!$response) {
            $response = $this->handleKnowledgeSearch($text, $deteksi);
        }

        //fallback jika tidak sesuai
        if (!$response) {
            $response = $this->handleFallback($text, $session, $deteksi);
        }

        // session update
        $session->update([
            'current_intent' => $intent,
            'current_topic'  => $response['topic'] ?? $previousTopic,
            'fail_count'     => $intent === 'unknown' ? $session->fail_count + 1 : 0,
            'history'        => array_merge($session->history ?? [], [
                [
                    'user' => $text,
                    'intent' => $intent,
                    'confidence' => $confidence,
                    'bot' => $response['type'] ?? 'unknown',
                    'time' => now()->toIso8601String(),
                ]
            ]),
        ]);

        $response['_meta'] = [
            'intent' => $intent,
            'confidence' => $confidence,
        ];

        return $response;
    }


    private function handleKondisi($deteksi): array
    {
        $metode = $deteksi->metode ?? 'stunting';

        switch ($metode) {
            case 'stunting':
                $status = $deteksi->status_tb_u;
                $zscore = $deteksi->zscore_tb_u;
                $penjelasan = $this->keteranganTBU($status);
                $saran = $this->narasiTBU($status, $zscore);
                $keteranganWHO = $this->keteranganWHOByMetode($metode);
                break;

            case 'wasting':
                $status = $deteksi->status_tb_bb;
                $zscore = $deteksi->zscore_tb_bb;
                $penjelasan = $this->keteranganBBTB($status);
                $saran = $this->narasiBBTB($status, $zscore);
                $keteranganWHO = $this->keteranganWHOByMetode($metode);
                break;

            case 'underweight':
                $status = $deteksi->status_bb_u;
                $zscore = $deteksi->zscore_bb_u;
                $penjelasan = $this->keteranganBBU($status);
                $saran = $this->narasiBBU($status, $zscore);
                $keteranganWHO = $this->keteranganWHOByMetode($metode);
                break;

            default:
                $status = 'Tidak tersedia';
                $zscore = '-';
                $penjelasan = '-';
                $saran = "-";
                $keteranganWHO = "-";
                break;
        }

        $message = "Kondisi anak Bunda saat ini terdeteksi dalam kategori {$status}.\n\n";
        $message .= $keteranganWHO . "\n";
        if ($zscore && $zscore !== '-') {
            $message .= "Menurut keterangan tersebut, Z-Score anak bunda saat ini berada di angka {$zscore}. ";
        }

        if ($penjelasan && $penjelasan !== '-') {
            $message .= "Hal ini menunjukkan bahwa {$penjelasan}\n\n";
        }

        if ($saran && $saran !== '-') {
            $message .= "{$saran}";
        }
        return [
            'status' => 'success',
            'type'   => 'deteksi',
            'topic'  => 'kondisi',


            'message' => $message,


            'data'   => [
                'status'      => $status ?? 'Tidak tersedia',
                'penjelasan'  => $penjelasan ?? '-',
                'zscore'      => $zscore ?? '-',
                'saran' => $saran ?? '-',
                'keteranganWHO' => $keteranganWHO ?? '-',
            ],

            'suggested_questions' => [
                [
                    'label' => 'Apa penyebabnya?',
                    'type' => 'ask',
                    'question' => 'Apa penyebab stunting?',
                ],
                [
                    'label' => 'Apa penyebab anak bisa terkena ini?',
                    'type' => 'ask',
                    'question' => 'Kenapa anak bisa terkena hal ini?',
                ],
            ],
        ];
    }
    private function handlePenyebab($deteksi)
    {
        $metode = $deteksi->metode ?? 'stunting';

        switch ($metode) {

            case 'stunting':
                $message = "Stunting biasanya terjadi karena beberapa faktor berikut:

- Kekurangan asupan gizi dalam jangka panjang
- Kurangnya protein, zat besi, dan vitamin
- Sering mengalami infeksi (diare, ISPA)
- Pola asuh yang kurang tepat (misalnya pemberian makan tidak teratur)
- Kurangnya sanitasi dan kebersihan lingkungan

Selain itu, faktor keturunan bisa berpengaruh, tetapi bukan penyebab utama.

Artinya, kondisi ini lebih banyak dipengaruhi oleh pola makan dan lingkungan anak.";
                break;

            case 'wasting':
                $message = "Kondisi berat badan kurang (wasting) biasanya disebabkan oleh:

- Asupan makanan yang kurang dalam waktu dekat
- Anak sedang atau baru saja sakit (diare, demam, infeksi)
- Nafsu makan menurun
- Pola makan yang tidak mencukupi kebutuhan energi

Kondisi ini biasanya terjadi secara cepat dan perlu segera ditangani.";
                break;

            case 'underweight':
                $message = "Berat badan kurang (underweight) dapat disebabkan oleh:

- Asupan makanan yang tidak mencukupi dalam jangka waktu lama
- Pola makan tidak seimbang
- Kurangnya asupan energi dan protein
- Riwayat penyakit yang berulang

Kondisi ini bisa merupakan gabungan dari masalah gizi jangka pendek dan jangka panjang.";
                break;

            default:
                $message = "Penyebab kondisi anak belum dapat dijelaskan.";
                break;
        }

        return [
            'status' => 'success',
            'type'   => 'deteksi',
            'topic'  => 'penyebab',

            'message' => $message,

            'suggested_questions' => [
                [
                    'label' => 'Apa dampak dari kondisi ini?',
                    'type' => 'ask',
                    'question' => 'apa dampaknya',
                ],
                [
                    'label' => 'Apa yang harus saya lakukan?',
                    'type' => 'ask',
                    'question' => 'solusi',
                ],
            ],
        ];
    }
    private function handleSolusi($deteksi, $previousTopic): array
    {

        $metode = $deteksi->metode ?? 'stunting';

        switch ($metode) {
            case 'stunting':
                $status = $deteksi->status_tb_u;
                $rekomendasi = $this->rekomendasiTBU($status);
                break;

            case 'wasting':
                $status = $deteksi->status_tb_bb;
                $rekomendasi = $this->rekomendasiBBTB($status);
                break;

            case 'underweight':
                $status = $deteksi->status_bb_u;
                $rekomendasi = $this->rekomendasiBBU($status);
                break;

            default:
                $status = 'Tidak tersedia';
                $rekomendasi = [];
                break;
        }

        $message = "Baik Bunda, untuk membantu memperbaiki kondisi anak, ada beberapa langkah penting yang dapat dilakukan. Karena kondisi anak berada pada kategori {$status}. Solusi atau langkah-langkah yang bisa dilakukan yaitu:\n\n";
        foreach ($rekomendasi as $r) {
            $message .= "- {$r}\n";
        }

        if ($previousTopic === 'makanan') {
            $message = "Melanjutkan pembahasan soal makanan ananda...\n\n" . $message;
        }

        return [
            'status' => 'success',
            'type'   => 'deteksi',
            'topic'  => 'solusi',


            'message' => $message,

            'data' => [
                'status' => $status,
                'rekomendasi' => $rekomendasi,
            ],

            'suggested_questions' => [
                ['label' => 'Menu makanan', 'type' => 'ask', 'question' => 'Menu MPASI apa?'],
                ['label' => 'Rekomendasi susu', 'type' => 'ask', 'question' => 'Susu apa yang bagus?'],
                ['label' => 'Soal sanitasi', 'type' => 'ask', 'question' => 'Kenapa sanitasi penting?'],
            ],
        ];
    }

    private function handleMakanan($deteksi): array
    {
        $kb = KnowledgeBase::whereJsonContains('tags', 'makanan')
            ->orWhereJsonContains('tags', 'mpasi')
            ->first();

        if (!$kb) return $this->handleFallback('makanan', null, $deteksi);

        return [
            'status' => 'success',
            'type'   => 'knowledge_base',
            'topic'  => 'makanan',
            'data'   => ['jawaban' => $kb->jawaban, 'kategori' => $kb->kategori],
            'suggested_questions' => [
                ['label' => 'Lanjut ke soal susu', 'type' => 'ask', 'question' => 'Susu apa yang bagus?'],
                ['label' => 'Apa yang harus dilakukan?', 'type' => 'ask', 'question' => 'Apa yang harus saya lakukan?'],
            ],
        ];
    }

    private function handleSusu($deteksi): array
    {
        $kb = KnowledgeBase::whereJsonContains('tags', 'susu')->first();
        if (!$kb) return $this->handleFallback('susu', null, $deteksi);

        return [
            'status' => 'success',
            'type'   => 'knowledge_base',
            'topic'  => 'susu',
            'data'   => ['jawaban' => $kb->jawaban],
            'suggested_questions' => [
                ['label' => 'Soal makanan padat', 'type' => 'ask', 'question' => 'Menu MPASI apa?'],
                ['label' => 'Topik lain', 'type' => 'ask', 'question' => 'Apa yang harus saya lakukan?'],
            ],
        ];
    }

    private function handleSanitasi($deteksi): array
    {
        $kb = KnowledgeBase::whereJsonContains('tags', 'sanitasi')->first();
        if (!$kb) return $this->handleFallback('sanitasi', null, $deteksi);

        return [
            'status' => 'success',
            'type'   => 'knowledge_base',
            'topic'  => 'sanitasi',
            'data'   => ['jawaban' => $kb->jawaban],
            'suggested_questions' => [
                ['label' => 'Soal gizi & makanan', 'type' => 'ask', 'question' => 'Menu MPASI apa?'],
                ['label' => 'Lihat rekomendasi lain', 'type' => 'ask', 'question' => 'Apa yang harus saya lakukan?'],
            ],
        ];
    }

    private function handleDefinisi(string $text, $deteksi): array
    {
        $text = strtolower($text);

        // hapus kata tidak penting (stopwords sederhana)
        $stopwords = ['apa', 'itu', 'yang', 'dan', 'di', 'ke', 'dari'];
        $words = array_diff(explode(' ', $text), $stopwords);

        $kbs = KnowledgeBase::all();

        $bestScore = 0;
        $bestKb = null;

        foreach ($kbs as $kb) {
            $score = 0;

            // cocokkan tags
            foreach ($kb->tags as $tag) {
                if (str_contains($text, $tag)) {
                    $score += 2;
                }
            }

            // cocokkan aliases (lebih kuat)
            foreach ($kb->aliases as $alias) {
                if (str_contains($text, strtolower($alias))) {
                    $score += 5;
                }
            }

            // cocokkan kata per kata
            foreach ($words as $word) {
                if (str_contains($kb->pertanyaan, $word)) {
                    $score += 1;
                }
            }

            // tambahkan weight dari JSON
            $score += $kb->weight;

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestKb = $kb;
            }
        }

        // threshold supaya tidak asal jawab
        if ($bestKb && $bestScore >= 12) {

            return [
                'status' => 'success',
                'type'   => 'knowledge_base',
                'topic'  => 'definisi_' . strtolower($bestKb->kategori),

                'data'   => [
                    'jawaban' => $bestKb->jawaban,
                    'kategori' => $bestKb->kategori,
                ],

                'suggested_questions' => collect($bestKb->related_questions ?? [])
                    ->map(fn($q) => [
                        'label' => '' . $q,
                        'type' => 'ask',
                        'question' => $q,
                    ])->toArray(),
            ];
        }

        return $this->handleFallback($text, null, $deteksi);
    }

    private function handleSapaan(string $text, ChatSession $session): array
    {
        $text = strtolower($text);
        $reply = match (true) {
            str_contains($text, 'terima kasih') || str_contains($text, 'makasih')
            => 'Sama-sama, Bunda! Senang bisa membantu :)',
            str_contains($text, 'selamat pagi')   => 'Selamat pagi, Bunda! Ada yang bisa saya bantu?',
            str_contains($text, 'selamat siang')  => 'Selamat siang, Bunda! Ada yang bisa saya bantu?',
            str_contains($text, 'selamat malam')  => 'Selamat malam, Bunda! Ada yang bisa saya bantu?',
            default                                => 'Halo, Bunda! Saya siap membantu. Mau tanya apa?',
        };

        return [
            'status' => 'success',
            'type'   => 'greeting',
            'topic'  => 'sapaan',
            'data'   => ['jawaban' => $reply],
            'suggested_questions' => [
                ['label' => 'Bagaimana kondisi anak saya?', 'type' => 'ask', 'question' => 'Bagaimana kondisi anak saya?'],
                ['label' => 'Apa yang harus dilakukan?', 'type' => 'ask', 'question' => 'Apa yang harus saya lakukan?'],
            ],
        ];
    }

    private function handleFallback(string $text, ?ChatSession $session, $deteksi): array
    {
        UnansweredQuestion::create(['pertanyaan' => $text]);

        $failCount = $session?->fail_count ?? 0;
        $isHard = $failCount >= 1;

        $waUrl = "https://wa.me/6283162253730?text=" . urlencode(
            "Halo, saya ingin konsultasi kondisi anak saya."
        );

        return [
            'status'  => 'fallback',
            'type'    => 'fallback',
            'topic'   => 'fallback',
            'message' => $isHard
                ? "Sepertinya pertanyaan Bunda di luar topik yang saya kuasai 🙏 Yuk langsung tanya pakar:"
                : "Hmm, saya belum punya jawaban untuk itu. Coba pilih topik di bawah ya, Bunda:",
            'suggested_questions' => $isHard
                ? [
                    ['label' => 'Mulai dari awal', 'type' => 'ask', 'question' => 'Bagaimana kondisi anak saya?'],
                    ['label' => '📞 Konsultasi Pakar', 'type' => 'whatsapp', 'url' => $waUrl],
                ]
                : [
                    ['label' => 'Soal makanan', 'type' => 'ask', 'question' => 'Menu MPASI apa?'],
                    ['label' => 'Soal susu', 'type' => 'ask', 'question' => 'Susu apa yang bagus?'],
                    ['label' => 'Soal sanitasi', 'type' => 'ask', 'question' => 'Kenapa sanitasi penting?'],
                ],
        ];
    }

    private function handleGrafik($deteksi): array
    {
        $grafik = $deteksi->balita->deteksis
            ->sortBy('tgl_deteksi')
            ->values()
            ->map(function ($item) {
                return [
                    'tgl_format' => Carbon::parse($item->tgl_deteksi)->format('Y-m-d'),
                    'tinggi' => (float) $item->tinggi,
                    'berat' => (float) $item->berat,
                ];
            });
        $message =  "Berikut adalah grafik perkembangan tinggi dan berat badan anak berdasarkan data yang tersedia.";
        return [
            'status' => 'success',
            'type'   => 'grafik',
            'topic'  => 'grafik',

            'data' => [
                'grafik' => $grafik,
            ],

            'message' => $message,

            'suggested_questions' => [
                [
                    'label' => 'Jelaskan grafik',
                    'type' => 'ask',
                    'question' => 'jelaskan grafik',
                ],
                [
                    'label' => 'Apa yang harus dilakukan?',
                    'type' => 'ask',
                    'question' => 'Apa yang harus saya lakukan?',
                ],
            ],
        ];
    }


    private function handleGrafikAnalysis($deteksi): array
    {
        $grafik = $deteksi->balita->deteksis
            ->sortBy('tgl_deteksi')
            ->values()
            ->map(function ($item) {
                return [
                    'tgl_format' => Carbon::parse($item->tgl_deteksi)->format('Y-m-d'),
                    'tinggi' => (float) $item->tinggi,
                    'berat' => (float) $item->berat,
                ];
            })
            ->toArray();

        $analisis = $this->analisisEWSGrafik($grafik);

        return [
            'status' => 'success',
            'type'   => 'grafik_analisis',
            'topic'  => 'grafik_analisis',

            'data' => [
                'grafik' => $grafik,
                'ews'    => $analisis,
            ],

            'message' => $analisis['message'],

            'suggested_questions' => [
                [
                    'label' => 'Lihat grafik lagi',
                    'type' => 'ask',
                    'question' => 'Tampilkan grafik',
                ],
                [
                    'label' => 'Apa artinya ini?',
                    'type' => 'ask',
                    'question' => 'Jelaskan kondisi anak saya',
                ],
            ],
        ];
    }




    private function analisisEWSGrafik($grafik)
    {
        $warning = [];

        $count = count($grafik);

        // =========================
        // 1. JIKA DATA HANYA 1
        // =========================
        if ($count == 1) {

            $data = $grafik[0];

            $message  = "-) Hasil pengukuran terakhir:\n";
            $message .= "• Tinggi badan: {$data['tinggi']} cm\n";
            $message .= "• Berat badan: {$data['berat']} kg\n\n";

            $message .= "Data pertumbuhan anak baru tersedia 1 kali, jadi kita belum bisa melihat perkembangannya.\n\n";

            $message .= "Yuk, ajak si Kecil ke posyandu setiap bulan ya, Bu/Pak. Dengan pengukuran rutin, kita bisa tahu apakah anak tumbuh sehat sesuai usianya. 💕\n\n";

            $message .= "-) Tips: Catat tanggal posyandu berikutnya supaya tidak terlewat.";

            return [
                'level' => 'info',
                'message' => $message,
                'warning' => []
            ];
        }

        // =========================
        // 2. AMBIL DATA TERAKHIR
        // =========================
        $last = $grafik[$count - 1];
        $prev = $grafik[$count - 2];

        $selisihTinggi = $last['tinggi'] - $prev['tinggi'];
        $selisihBerat  = $last['berat'] - $prev['berat'];

        // =========================
        // 3. DETEKSI TINGGI
        // =========================
        if (abs($selisihTinggi) <= 0.1) {
            $warning[] = "Tinggi badan anak belum banyak bertambah dibanding bulan lalu.";
        } elseif ($selisihTinggi < 0) {
            $warning[] = "Tinggi badan anak tercatat lebih rendah dari pengukuran sebelumnya. Mungkin perlu diukur ulang untuk memastikan.";
        }

        // =========================
        // 4. DETEKSI BERAT
        // =========================
        if ($selisihBerat < 0) {
            $warning[] = "Berat badan anak turun dibanding bulan lalu.";
        } elseif ($selisihBerat == 0) {
            $warning[] = "Berat badan anak belum naik sejak pengukuran terakhir.";
        }

        // =========================
        // 5. TREND ANALISIS (>=3 DATA)
        // =========================
        if ($count >= 3) {

            $last3 = collect($grafik)->slice(-3)->values();

            $trendTinggi = $this->cekTrend($last3, 'tinggi');
            $trendBerat  = $this->cekTrend($last3, 'berat');

            if ($trendTinggi == 'menurun') {
                $warning[] = "Dalam 3 bulan terakhir, tinggi badan anak cenderung tidak naik. Sebaiknya konsultasi ke bidan atau puskesmas.";
            }

            if ($trendBerat == 'menurun') {
                $warning[] = "Dalam 3 bulan terakhir, berat badan anak cenderung turun. Sebaiknya konsultasi ke bidan atau puskesmas.";
            }

            if ($trendTinggi == 'stagnan') {
                $warning[] = "Pertumbuhan tinggi badan anak terlihat lambat dalam 3 bulan terakhir.";
            }

            if ($trendBerat == 'stagnan') {
                $warning[] = "Berat badan anak terlihat tidak banyak berubah dalam 3 bulan terakhir.";
            }
        }

        // =========================
        // 6. LEVEL RISIKO
        // =========================
        $level = 'normal';

        if (count($warning) >= 3) {
            $level = 'danger';
        } elseif (count($warning) >= 1) {
            $level = 'warning';
        }

        // =========================
        // 7. MESSAGE HUMAN FRIENDLY
        // =========================

        // Pembuka — disesuaikan dengan level, tidak bikin panik
        $baseMessage = match ($level) {
            'danger'  => "Pertumbuhan si Kecil perlu perhatian khusus, Bu/Pak.\n\nBeberapa hal pada hasil pengukuran terakhir menunjukkan anak butuh pemeriksaan lebih lanjut. Jangan khawatir berlebihan ya, ini langkah awal supaya anak bisa segera dibantu.",
            'warning' => "Ada beberapa hal yang perlu diperhatikan pada pertumbuhan si Kecil.\n\nBelum termasuk masalah serius, tapi sebaiknya dipantau lebih dekat di bulan-bulan berikutnya.",
            default   => "Kabar baik! Pertumbuhan si Kecil terlihat sehat dan berjalan dengan baik.\n\nTerus pertahankan ya, Bu/Pak. ",
        };

        // Ringkasan pengukuran terakhir
        $ringkasan  = "-) Hasil pengukuran terakhir:\n";
        $ringkasan .= "• Tinggi: {$last['tinggi']} cm";
        if ($selisihTinggi > 0) {
            $ringkasan .= " (naik " . number_format(abs($selisihTinggi), 1) . " cm)";
        } elseif ($selisihTinggi < 0) {
            $ringkasan .= " (turun " . number_format(abs($selisihTinggi), 1) . " cm)";
        } else {
            $ringkasan .= " (tetap)";
        }
        $ringkasan .= "\n• Berat: {$last['berat']} kg";
        if ($selisihBerat > 0) {
            $ringkasan .= " (naik " . number_format(abs($selisihBerat), 1) . " kg)";
        } elseif ($selisihBerat < 0) {
            $ringkasan .= " (turun " . number_format(abs($selisihBerat), 1) . " kg)";
        } else {
            $ringkasan .= " (tetap)";
        }

        // Penjelasan ringan tentang tinggi & berat
        $detail = "";

        if ($selisihTinggi > 0 && $selisihBerat > 0) {
            $detail = "Tinggi dan berat badan anak sama-sama bertambah. Ini pertanda baik.";
        } elseif ($selisihTinggi > 0 && $selisihBerat <= 0) {
            $detail = "Tinggi badan anak bertambah, tapi berat badannya belum ikut naik. Coba perhatikan asupan makan anak ya.";
        } elseif ($selisihTinggi <= 0 && $selisihBerat > 0) {
            $detail = "Berat badan anak naik, tapi tinggi badannya belum banyak bertambah. Tetap pantau di bulan berikutnya.";
        } else {
            $detail = "Tinggi dan berat badan anak belum menunjukkan kenaikan. Sebaiknya cek pola makan, istirahat, dan kesehatan anak.";
        }

        // Saran disesuaikan dengan level
        $saran = match ($level) {
            'danger'  => "Saran:\n• Segera bawa anak ke puskesmas atau bidan terdekat untuk pemeriksaan lebih lengkap.\n• Tanyakan ke kader atau tenaga kesehatan tentang pemberian makan tambahan (PMT).\n• Jangan lewatkan jadwal posyandu bulan depan.",
            'warning' => "Saran:\n• Berikan makanan bergizi seimbang: nasi, lauk, sayur, buah, dan susu.\n• Pastikan anak cukup istirahat dan tidak sedang sakit.\n• Tetap rutin ke posyandu setiap bulan untuk pemantauan.",
            default   => "Saran:\n• Lanjutkan pola makan dan pengasuhan yang sudah baik.\n• Tetap rutin ke posyandu setiap bulan.\n• Berikan ASI/MPASI atau makanan bergizi sesuai usia anak.",
        };

        // Gabungkan semuanya
        $message  = $baseMessage . "\n\n";
        $message .= $ringkasan . "\n\n";
        $message .= $detail;

        if (!empty($warning)) {
            $message .= "\n\n-) Yang perlu diperhatikan:\n";
            foreach ($warning as $w) {
                $message .= "• " . $w . "\n";
            }
            $message = rtrim($message);
        }

        $message .= "\n\n" . $saran;

        return [
            'level'   => $level,
            'message' => $message,
            'warning' => $warning,
        ];
    }

    private function cekTrend($data, $field)
    {
        $naik = 0;
        $turun = 0;
        $stagnan = 0;

        for ($i = 1; $i < count($data); $i++) {

            $prev = $data[$i - 1][$field];
            $curr = $data[$i][$field];

            if ($curr > $prev) {
                $naik++;
            } elseif ($curr < $prev) {
                $turun++;
            } else {
                $stagnan++;
            }
        }

        if ($turun >= 1) return "menurun";
        if ($stagnan >= 2) return "stagnan";
        return "naik";
    }

    private function handleResetChat(ChatSession $session): array
    {
        // reset session
        $session->update([
            'history' => [],
            'context' => [],
            'current_topic' => null,
            'current_intent' => null,
            'fail_count' => 0,
        ]);

        return [
            'status' => 'success',
            'type' => 'system',
            'topic' => 'reset_chat',
            'message' => "Percakapan berhasil direset, Bunda! \n\nSilakan mulai dari awal lagi. Misalnya:\n• Bagaimana kondisi anak saya?\n• Tampilkan grafik pertumbuhan",
            'suggested_questions' => [
                [
                    'label' => 'Cek kondisi anak',
                    'type' => 'ask',
                    'question' => 'Bagaimana kondisi anak saya?'
                ],
                [
                    'label' => 'Lihat grafik anak',
                    'type' => 'ask',
                    'question' => 'Tampilkan grafik'
                ],
            ],
        ];
    }
    //rekomendasi 
    private function rekomendasiBBTB($status)
    {
        $rekomendasi = include base_path('storage/data/rekomendasi.php');
        return $rekomendasi['bbtb'][$status] ?? ["-"];
    }

    private function rekomendasiTBU($status)
    {
        $rekomendasi = include base_path('storage/data/rekomendasi.php');
        return $rekomendasi['tbu'][$status] ?? ["-"];
    }

    private function rekomendasiBBU($status)
    {
        $rekomendasi = include base_path('storage/data/rekomendasi.php');
        return $rekomendasi['bbu'][$status] ?? ["-"];
    }

    private function keteranganBBU($status)
    {
        return match ($status) {
            "Berat badan sangat kurang (severely underweight)" =>
            "berat badan anak sangat rendah dibandingkan standar usianya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan kemungkinan kekurangan gizi berat dan perlu penanganan segera.",

            "Berat badan kurang (underweight)" =>
            "berat badan anak berada di bawah standar usianya (z-score antara -3 SD hingga -2 SD). Hal ini mengindikasikan adanya masalah gizi yang perlu diperhatikan.",

            "Berat badan normal" =>
            "berat badan anak berada dalam rentang normal sesuai standar WHO (z-score antara -2 SD hingga +1 SD), menunjukkan kondisi gizi yang baik.",

            "Risiko berat badan lebih" =>
            "berat badan anak berada di atas standar usianya (z-score > +1 SD), sehingga berisiko mengalami kelebihan berat badan jika tidak dikontrol.",

            default => "-",
        };
    }

    private function keteranganTBU($status)
    {
        return match ($status) {
            "Sangat pendek (severely stunted)" =>
            "tinggi badan anak sangat rendah dibandingkan standar usianya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan stunting berat akibat kekurangan gizi kronis dalam jangka panjang.",

            "Pendek (stunted)" =>
            "tinggi badan anak berada di bawah standar usianya (z-score antara -3 SD hingga -2 SD). Anak terindikasi stunting yang menandakan adanya gangguan pertumbuhan kronis.",

            "Normal" =>
            "tinggi badan anak berada dalam rentang normal sesuai standar WHO (z-score antara -2 SD hingga +3 SD), menunjukkan pertumbuhan yang baik.",

            "Tinggi" =>
            "tinggi badan anak berada di atas rata-rata usianya (z-score > +3 SD), namun masih perlu dipantau agar tetap proporsional.",

            default => "-",
        };
    }

    private function keteranganBBTB($status)
    {
        return match ($status) {
            "Gizi buruk (severely wasted)" =>
            "berat badan anak sangat rendah dibandingkan tinggi badannya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan gizi buruk akut yang memerlukan penanganan segera.",

            "Gizi kurang (wasted)" =>
            "berat badan anak berada di bawah standar tinggi badannya (z-score antara -3 SD hingga -2 SD), menandakan adanya kekurangan gizi akut.",

            "Gizi baik (normal)" =>
            "berat badan anak proporsional dengan tinggi badannya (z-score antara -2 SD hingga +1 SD), menunjukkan kondisi gizi yang baik.",

            "Berisiko gizi lebih (possible risk of overweight)" =>
            " berat badan anak mulai melebihi proporsi ideal terhadap tinggi badan (z-score > +1 SD), sehingga berisiko mengalami kelebihan berat badan.",

            "Gizi lebih (overweight)" =>
            "berat badan anak lebih tinggi dibandingkan standar tinggi badannya (z-score > +2 SD), menunjukkan kondisi gizi lebih.",

            "Obesitas (obese)" =>
            "berat badan anak sangat berlebih dibandingkan tinggi badannya (z-score > +3 SD), termasuk dalam kategori obesitas dan perlu perhatian khusus.",

            default => "-",
        };
    }

    private function narasiTBU($status)
    {
        return match ($status) {

            "Sangat pendek (severely stunted)" =>
            "Kondisi ini perlu segera mendapatkan perhatian khusus melalui perbaikan asupan gizi dan pendampingan tenaga kesehatan secara intensif.",

            "Pendek (stunted)" =>
            "Kondisi ini perlu diperhatikan dengan meningkatkan kualitas gizi dan melakukan pemantauan pertumbuhan secara rutin.",

            "Normal" =>
            "Kondisi ini perlu dipertahankan dengan pemberian gizi seimbang dan pemantauan secara berkala.",

            "Tinggi" =>
            "Kondisi ini umumnya tidak menjadi masalah, namun tetap perlu dipantau agar pertumbuhan tetap proporsional.",

            default => "-",
        };
    }
    private function narasiBBU($status, $zscore)
    {
        return match ($status) {

            "Berat badan sangat kurang (severely underweight)" =>
            "Kondisi ini perlu segera ditangani dengan peningkatan asupan gizi dan pemeriksaan oleh tenaga kesehatan.",

            "Berat badan kurang (underweight)" =>
            "Kondisi ini perlu diperhatikan dengan memperbaiki pola makan dan pemantauan secara rutin.",

            "Berat badan normal" =>
            "Kondisi ini perlu dipertahankan dengan pola makan bergizi seimbang dan pemantauan pertumbuhan secara berkala.",

            "Risiko berat badan lebih" =>
            "Kondisi ini perlu dikontrol dengan menjaga pola makan sehat dan aktivitas fisik yang cukup.",

            default => "-",
        };
    }
    private function narasiBBTB($status, $zscore)
    {
        return match ($status) {

            "Gizi buruk (severely wasted)" =>
            "Kondisi ini memerlukan penanganan segera melalui perbaikan gizi intensif dan pendampingan tenaga kesehatan.",

            "Gizi kurang (wasted)" =>
            "Kondisi ini perlu diperbaiki dengan peningkatan asupan gizi dan pemantauan rutin.",

            "Gizi baik (normal)" =>
            "Kondisi ini perlu dipertahankan dengan pola makan sehat dan seimbang.",

            "Berisiko gizi lebih (possible risk of overweight)" =>
            "Kondisi ini perlu dikontrol dengan menjaga pola makan dan aktivitas fisik.",

            "Gizi lebih (overweight)" =>
            "Kondisi ini perlu dikendalikan agar tidak berkembang menjadi obesitas.",

            "Obesitas (obese)" =>
            "Kondisi ini memerlukan perhatian khusus dengan pengaturan pola makan dan konsultasi tenaga kesehatan.",

            default => "-",
        };
    }

    private function keteranganWHOByMetode($metode)
    {
        switch ($metode) {

            case 'stunting': // TB/U
                return
                    "Menurut standar WHO, kondisi anak berdasarkan indikator Tinggi Badan menurut Umur (TB/U) dapat dijelaskan sebagai berikut:

- Sangat pendek (severely stunted)  : Z-Score < -3 SD (jauh di bawah rata-rata anak seusianya)
- Pendek (stunted)                  : -3 SD sampai < -2 SD (di bawah rata-rata anak seusianya)
- Normal                            : -2 SD sampai +2 SD (sesuai rata-rata anak seusianya)
- Tinggi                            : > +2 SD (di atas rata-rata anak seusianya)
";

            case 'wasting': // BB/TB
                return
                    "Menurut standar WHO, kondisi anak berdasarkan indikator Berat Badan menurut Tinggi Badan (BB/TB) dapat dijelaskan sebagai berikut:

- Gizi buruk (severely wasted) : Z-Score < -3 SD (jauh di bawah rata-rata, kekurangan gizi berat)
- Gizi kurang (wasted)         : -3 SD sampai < -2 SD (di bawah rata-rata, kekurangan gizi)
- Gizi baik (normal)           : -2 SD sampai +2 SD (sesuai rata-rata anak seusianya)
- Berisiko gizi lebih          : > +1 SD sampai +2 SD (mulai di atas rata-rata, perlu perhatian)
- Gizi lebih (overweight)      : > +2 SD sampai +3 SD (di atas rata-rata anak seusianya)
- Obesitas (obese)             : > +3 SD (jauh di atas rata-rata anak seusianya)
";

            case 'underweight': // BB/U
                return
                    "Menurut standar WHO, kondisi anak berdasarkan indikator Berat Badan menurut Umur (BB/U) dapat dijelaskan sebagai berikut:

- Berat badan sangat kurang (severely underweight)  : Z-Score < -3 SD (jauh di bawah rata-rata berat badan anak seusianya)
- Berat badan kurang (underweight)                  : -3 SD sampai < -2 SD (di bawah rata-rata berat badan anak seusianya)
- Berat badan normal                                : -2 SD sampai +2 SD (sesuai rata-rata berat badan anak seusianya)
- Risiko berat badan lebih                          : > +2 SD (di atas rata-rata berat badan anak seusianya)
";

            default:
                return "Keterangan standar WHO tidak tersedia untuk metode ini.";
        }
    }

    private function handleKnowledgeSearch(string $text, $deteksi): ?array
    {
        $text = strtolower($text);

        $stopwords = ['apa', 'itu', 'yang', 'dan', 'di', 'ke', 'dari', 'kenapa', 'bagaimana'];
        $words = array_diff(explode(' ', $text), $stopwords);

        $kbs = KnowledgeBase::all();

        $bestScore = 0;
        $bestKb = null;

        foreach ($kbs as $kb) {
            $score = 0;

            foreach ($kb->tags as $tag) {
                if (str_contains($text, strtolower($tag))) {
                    $score += 2;
                }
            }

            foreach ($kb->aliases as $alias) {
                if (str_contains($text, strtolower($alias))) {
                    $score += 5;
                }
            }

            foreach ($words as $word) {
                if (str_contains(strtolower($kb->pertanyaan), $word)) {
                    $score += 1;
                }
            }

            $score += ($kb->weight ?? 0);

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestKb = $kb;
            }
        }


        if ($bestKb && $bestScore >= 18) {
            return [
                'status' => 'success',
                'type' => 'knowledge_base',
                'topic' => strtolower($bestKb->kategori),
                'data' => [
                    'jawaban' => $bestKb->jawaban,
                    'kategori' => $bestKb->kategori,
                ],
                'suggested_questions' => collect($bestKb->related_questions ?? [])
                    ->map(fn($q) => [
                        'label' => '👉 ' . $q,
                        'type' => 'ask',
                        'question' => $q,
                    ])->toArray(),
            ];
        }

        return null;
    }
}
