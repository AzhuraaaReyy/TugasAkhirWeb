<?php

namespace App\Services;

class IntentClassifier
{
    private array $intents = [
        'tanya_kondisi' => [
            'patterns' => [
                'bagaimana kondisi' => 10,
                'gimana keadaan' => 10,
                'status anak' => 8,
                'hasil deteksi' => 8,
                'kondisi' => 4,
                'status' => 4,
                'hasil' => 3,
            ],
            'required_any' => ['kondisi', 'status', 'hasil', 'keadaan', 'stunting'],
        ],
        'tanya_solusi' => [
            'patterns' => [
                'apa yang harus' => 10,

                'solusi' => 8,
                'cara mengatasi' => 9,
                'rekomendasi' => 7,
                'tindakan' => 6,
                'lakukan' => 4,
            ],
            'required_any' => ['harus', 'solusi', 'cara', 'atasi', 'lakukan', 'tindakan', 'rekomendasi'],
        ],

        'tanya_makanan' => [
            'patterns' => [
                'menu mpasi' => 10,
                'makanan bergizi' => 9,
                'menu' => 5,
                'makanan' => 5,
                'mpasi' => 7,
                'gizi' => 4,
            ],
            'required_any' => ['makan', 'makanan', 'menu', 'mpasi', 'gizi'],
        ],
        'tanya_susu' => [
            'patterns' => [
                'susu formula' => 10,
                'asi' => 8,
                'susu' => 6,
                'minum' => 3,
            ],
            'required_any' => ['susu', 'asi', 'formula', 'minum'],
        ],
        'tanya_sanitasi' => [
            'patterns' => [
                'sanitasi' => 10,
                'kebersihan' => 8,
                'cuci tangan' => 8,
                'air bersih' => 7,
            ],
            'required_any' => ['sanitasi', 'kebersihan', 'cuci', 'bersih', 'sabun'],
        ],
        'sapaan' => [
            'patterns' => [
                'halo' => 10,
                'hai' => 10,
                'selamat pagi' => 9,
                'selamat siang' => 9,
                'selamat malam' => 9,
                'terima kasih' => 10,
                'makasih' => 9,
            ],
            'required_any' => ['halo', 'hai', 'selamat', 'terima', 'makasih'],
        ],
        'grafik' => [
            'patterns' => [
                'tampilkan grafik' => 10,
                'lihat grafik' => 10,
                'lihat perkembangan' => 9,
                'perkembangan anak saya' => 9,
                'grafik pertumbuhan' => 10,
                'chart anak' => 8,
                'data pertumbuhan' => 7,
                'riwayat pertumbuhan' => 8,
                'grafik' => 5,
            ],
            'required_any' => ['grafik', 'riwayat'],
        ],
        'grafik_analisis' => [
            'patterns' => [
                'jelaskan grafik' => 10,
                'analisis grafik' => 10,
                'arti grafik' => 9,
                'apa arti grafik' => 9,
                'penjelasan grafik' => 10,
                'interpretasi grafik' => 10,
                'bahasa grafik' => 8,
            ],
            'required_any' => ['analisis', 'jelaskan', 'arti', 'penjelasan'],
        ],
        'reset_chat' => [
            'patterns' => [
                'mulai dari awal' => 10,
                'reset chat' => 10,
                'hapus' => 9,
                'clear' => 9,
                'ulang dari awal' => 10,
                'reset percakapan' => 10,
            ],
            'required_any' => [
                'reset',
                'hapus',
                'awal',
                'ulang',
                'clear'
            ],
        ],
        'tanya_penyebab' => [
            'patterns' => [
                'kenapa anak bisa terkena hal ini' => 10,
                'kenapa anak saya' => 9,
                'penyebabnya apa' => 10,
                'faktor penyebab' => 9,
                'apa penyebabnya' => 10,
                'kenapa terjadi' => 9,
                'kenapa kondisi ini' => 9,
                'penyebab kondisi' => 9,
                'apakah karena makan' => 8,
                'apakah karena pola makan' => 9,
                'apakah keturunan' => 8,
                'faktor keturunan' => 8,
                'penyebab gizi buruk' => 10,
                'apa yang menyebabkan' => 10,
            ],

            'required_any' => [
                'penyebab',
                'kenapa',
                'kenapa anak',
                'menyebabkan',
                'bisa',
                'faktor',
                'penyebabnya',
                'kenapa anak bisa stunting',
            ],
        ],
        'tanya_hasil' => [
            'patterns' => [
                'pengukuran terakhir' => 10,
                'hasil pengukuran' => 9,
                'pengukuran anak terakhir' => 10,
                'hasil terakhir anak' => 10,
                'data terakhir anak' => 9,
                'hasil pemeriksaan terakhir' => 9,
            ],

            'required_any' => [
                'hasil',
                'pengukuran',
                'terakhir',
                'data terakhir',
            ],
        ],
        'tanya_riwayat' => [
            'patterns' => [
                'riwayat pertumbuhan anak saya' => 12,
                'riwayat pengukuran anak saya' => 12,
                'riwayat anak saya' => 10,
                'data pertumbuhan anak saya' => 11,
                'tampilkan riwayat anak saya' => 12,
                'histori pertumbuhan' => 10,
                'pengukuran dari waktu ke waktu' => 12,
                'data sebelumnya anak saya' => 10,
            ],
            'required_any' => [
                'riwayat',
                'data',
                'histori',
                'pengukuran',
            ],
        ],
        'tanya_perkembangan' => [
            'patterns' => [
                'bagaimana perkembangan anak saya' => 12,
                'perkembangan anak saya' => 11,
                'perkembangan anak' => 10,
                'apakah anak saya membaik' => 12,
                'apakah ada peningkatan' => 10,
                'tren pertumbuhan' => 9,
            ],
            'required_any' => [
                'perkembangan',
                'membaik',
                'peningkatan',
                'tren',
                'kondisi',
            ],
        ],
    ];

    public function classify(string $text): array
    {
        $text = strtolower(trim($text));
        $scores = [];

        foreach ($this->intents as $intentName => $config) {
            $score = 0;
            $matched = [];

            foreach ($config['patterns'] as $pattern => $weight) {
                if (str_contains($text, $pattern)) {
                    $score += $weight;
                    $matched[] = $pattern;
                }
            }

            $hasRequired = false;
            foreach ($config['required_any'] as $req) {
                if (str_contains($text, $req)) {
                    $hasRequired = true;
                    break;
                }
            }
            if (!$hasRequired) $score = 0;

            if ($score > 0) {
                $scores[$intentName] = ['score' => $score, 'matched' => $matched];
            }
        }

        uasort($scores, fn($a, $b) => $b['score'] <=> $a['score']);

        if (empty($scores)) {
            return ['intent' => 'unknown', 'confidence' => 0, 'all_scores' => []];
        }

        $top = array_key_first($scores);
        return [
            'intent'     => $top,
            'confidence' => $scores[$top]['score'],
            'matched'    => $scores[$top]['matched'],
            'all_scores' => $scores,
        ];
    }
}
