<?php

namespace App\Services;

use App\Models\KnowledgeBase;

class KnowledgeGraphService
{
    public function findNode(string $keyword): ?KnowledgeBase
    {
        $kw = strtolower($keyword);

        $node = KnowledgeBase::whereJsonContains('tags', $kw)->first();
        if ($node) return $node;

        return KnowledgeBase::whereJsonContains('aliases', $kw)->first();
    }

    public function getRelated(string $keyword, int $depth = 1): array
    {
        $node = $this->findNode($keyword);
        if (!$node) return [];
        return $node->getRelatedNodes($depth);
    }

    public function generateInsight(string $keyword): ?string
    {
        $related = $this->getRelated($keyword, 1);
        if (empty($related)) return null;

        $groups = [];
        foreach ($related as $r) {
            $groups[$r['relation']][] = $this->extractShort($r['target']['pertanyaan']);
        }

        $text = "**Wawasan terkait:**\n\n";
        foreach ($groups as $relation => $items) {
            $relText = $this->humanize($relation);
            $unique = array_slice(array_unique($items), 0, 3);
            $text .= "• {$relText}: " . implode(', ', $unique) . "\n";
        }
        return $text;
    }

    private function extractShort(string $pertanyaan): string
    {
        $words = explode(' ', $pertanyaan);
        return implode(' ', array_slice($words, 0, 5)) . '...';
    }

    private function humanize(string $relation): string
    {
        return match ($relation) {
            'dicegah_oleh'      => '🛡️ Dicegah dengan',
            'diatasi_dengan'    => '💊 Diatasi dengan',
            'dipantau_via'      => '📊 Dipantau melalui',
            'mengandung'        => '🥚 Mengandung',
            'terkandung_di'     => '🍽️ Terkandung di',
            'mencegah'          => '✋ Mencegah',
            'mengatasi'         => '🎯 Mengatasi',
            'cocok_untuk'       => '👶 Cocok untuk',
            'memantau'          => '📊 Memantau',
            default             => ucfirst(str_replace('_', ' ', $relation)),
        };
    }
}
