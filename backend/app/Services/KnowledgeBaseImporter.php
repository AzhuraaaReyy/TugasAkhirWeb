<?php

namespace App\Services;

use App\Models\KnowledgeBase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;

class KnowledgeBaseImporter
{
    public function importFromJson(string $jsonContent, string $mode = 'replace'): array
    {
        $data = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('JSON tidak valid: ' . json_last_error_msg());
        }
        if (!isset($data['items']) || !is_array($data['items'])) {
            throw new Exception('Format JSON salah. Harus ada key "items" berisi array.');
        }

        $errors = [];
        foreach ($data['items'] as $i => $item) {
            $v = $this->validateItem($item);
            if ($v !== true) $errors[] = "Item ke-" . ($i + 1) . ": " . $v;
        }
        if (!empty($errors)) throw new Exception(implode("\n", $errors));

        return DB::transaction(function () use ($data, $mode) {
            $stats = [
                'mode' => $mode,
                'total' => count($data['items']),
                'created' => 0,
                'updated' => 0,
                'deleted' => 0
            ];

            if ($mode === 'replace') {
                $stats['deleted'] = KnowledgeBase::count();
                KnowledgeBase::query()->delete();
                // 🔥 PASTIKAN TIDAK ADA ALTER TABLE / TRUNCATE / DDL DI SINI
            }

            foreach ($data['items'] as $item) {
                if ($mode === 'merge') {
                    $existing = KnowledgeBase::where('pertanyaan', $item['pertanyaan'])->first();
                    if ($existing) {
                        $existing->update($this->prepareItem($item));
                        $stats['updated']++;
                        continue;
                    }
                }
                KnowledgeBase::create($this->prepareItem($item));
                $stats['created']++;
            }
            return $stats;
        });
    }

    public function importFromFile(string $filePath, string $mode = 'replace'): array
    {
        if (!file_exists($filePath)) throw new Exception("File tidak ditemukan: {$filePath}");
        return $this->importFromJson(file_get_contents($filePath), $mode);
    }

    public function exportToJson(): string
    {
        $items = KnowledgeBase::all()->map(fn($kb) => [
            'kategori'          => $kb->kategori,
            'pertanyaan'        => $kb->pertanyaan,
            'jawaban'           => $kb->jawaban,
            'tags'              => $kb->tags,
            'aliases'           => $kb->aliases,
            'kondisi'           => $kb->kondisi,
            'relations'         => $kb->relations,
            'related_questions' => $kb->related_questions,
            'weight'            => $kb->weight,
        ]);

        return json_encode([
            'version'    => '1.0',
            'updated_at' => now()->toDateString(),
            'items'      => $items,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    private function validateItem(array $item)
    {
        $validator = Validator::make($item, [
            'kategori'   => 'required|string|max:100',
            'pertanyaan' => 'required|string',
            'jawaban'    => 'required|string',
            'tags'       => 'required|array|min:1',
            'aliases'    => 'nullable|array',
            'kondisi'    => 'required|in:normal,stunting,semua',
            'relations'  => 'nullable|array',
            'weight'     => 'nullable|integer|min:0',
        ]);
        return $validator->fails() ? $validator->errors()->first() : true;
    }

    private function prepareItem(array $item): array
    {
        return [
            'kategori'          => $item['kategori'],
            'pertanyaan'        => $item['pertanyaan'],
            'jawaban'           => $item['jawaban'],
            'tags'              => $item['tags'],
            'aliases'           => $item['aliases'] ?? [],
            'kondisi'           => $item['kondisi'],
            'relations'         => $item['relations'] ?? [],
            'related_questions' => $item['related_questions'] ?? [],
            'weight'            => $item['weight'] ?? 1,
        ];
    }
}
