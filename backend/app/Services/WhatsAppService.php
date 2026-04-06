<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    public function send($target, $message)
    {
        $response = Http::withHeaders([
            'Authorization' => config('services.fonnte.token')
        ])->timeout(config('services.fonnte.timeout'))
            ->asForm()
            ->post(config('services.fonnte.url'), [
                'target' => $target,
                'message' => $message,
            ]);

        if (!$response->successful()) {
            Log::error('Fonnte WA Error', $response->json());
            throw new \Exception('Gagal kirim WhatsApp');
        }

        return $response->json();
    }
}
