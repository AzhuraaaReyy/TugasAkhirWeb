<?php

namespace App\Http\Controllers;

use App\Models\Posyandu;
use Illuminate\Http\Request;

class PosyanduController extends Controller
{
    public function index()
    {
        $posyandu = Posyandu::all();

        return response()->json([
            'data' => $posyandu
        ]);
    }
}
