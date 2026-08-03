<?php

namespace App\Http\Controllers;

use App\Models\ParametroGlobal;
use Illuminate\Http\Request;

class ParametroGlobalController extends Controller
{
    public function update(Request $request, $clave)
    {
        $parametro = ParametroGlobal::findOrFail($clave);

        $validated = $request->validate([
            'valor' => 'required|numeric',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $parametro->update([
            'valor' => $validated['valor'],
            'descripcion' => $validated['descripcion'] ?? $parametro->descripcion,
            'fecha_actualizacion' => now(),
        ]);

        return redirect()->back()->with('success', 'Parámetro global actualizado correctamente.');
    }
}
