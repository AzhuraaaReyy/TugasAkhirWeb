<?php

namespace App\Console\Commands;

use App\Services\KnowledgeBaseImporter;
use Illuminate\Console\Command;

class ImportKnowledgeBase extends Command
{
    protected $signature = 'kb:import 
                            {file=database/data/knowledge_base.json}
                            {--mode=replace : replace, merge, atau append}';
    protected $description = 'Import knowledge base dari file JSON';

    public function handle(KnowledgeBaseImporter $importer): int
    {
        $file = $this->argument('file');
        $mode = $this->option('mode');

        $this->info("📂 Import dari: {$file}");
        $this->info("⚙️  Mode: {$mode}");

        try {
            $stats = $importer->importFromFile(base_path($file), $mode);
            $this->info('✅ Import berhasil!');
            $this->table(['Metric', 'Jumlah'], [
                ['Total di JSON', $stats['total']],
                ['Dihapus',       $stats['deleted']],
                ['Dibuat baru',   $stats['created']],
                ['Di-update',     $stats['updated']],
            ]);
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Gagal: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
