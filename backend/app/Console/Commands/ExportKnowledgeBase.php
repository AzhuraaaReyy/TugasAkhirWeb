<?php

namespace App\Console\Commands;

use App\Services\KnowledgeBaseImporter;
use Illuminate\Console\Command;

class ExportKnowledgeBase extends Command
{
    protected $signature = 'kb:export {file=storage/data/knowledge_base_backup.json}';
    protected $description = 'Export knowledge base ke JSON';

    public function handle(KnowledgeBaseImporter $importer): int
    {
        $file = base_path($this->argument('file'));
        file_put_contents($file, $importer->exportToJson());
        $this->info("✅ Berhasil export ke: {$file}");
        return Command::SUCCESS;
    }
}
