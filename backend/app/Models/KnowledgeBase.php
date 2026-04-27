<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KnowledgeBase extends Model
{
    protected $table = 'knowledge_base';
    protected $fillable = [
        'kategori',
        'pertanyaan',
        'jawaban',
        'tags',
        'aliases',
        'kondisi',
        'relations',
        'related_questions',
        'weight',
        'view_count'

    ];

    protected $casts = [
        'tags'              => 'array',
        'aliases'           => 'array',
        'relations'         => 'array',
        'related_questions' => 'array',
    ];

    /**
     * Graph traversal — ambil node terkait
     */
    public function getRelatedNodes(int $depth = 1): array
    {
        if (empty($this->relations)) return [];

        $results = [];
        $visited = [$this->id];
        $this->traverseRelations($this->relations, $depth, $visited, $results);
        return $results;
    }

    private function traverseRelations(array $relations, int $depth, array &$visited, array &$results): void
    {
        if ($depth < 0) return;
        foreach ($relations as $rel) {
            $target = self::whereJsonContains('tags', $rel['target'])->first();
            if (!$target || in_array($target->id, $visited)) continue;
            $visited[] = $target->id;
            $results[] = [
                'relation' => $rel['type'],
                'weight'   => $rel['weight'] ?? 1.0,
                'target'   => [
                    'id'         => $target->id,
                    'pertanyaan' => $target->pertanyaan,
                    'kategori'   => $target->kategori,
                ],
            ];
            if ($depth > 0 && !empty($target->relations)) {
                $this->traverseRelations($target->relations, $depth - 1, $visited, $results);
            }
        }
    }
}
