<?php

namespace App\Http\Controllers;

use App\Models\ConceptoPago;
use App\Models\ParametroGlobal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConceptoPagoController extends Controller
{
    public function index(): Response
    {
        $conceptos = ConceptoPago::orderBy('tipo', 'asc')->orderBy('id', 'asc')->get();
        $parametros = ParametroGlobal::all();

        return Inertia::render('Admin/Conceptos/Index', [
            'conceptos' => $conceptos,
            'parametros' => $parametros,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'tipo' => 'required|in:INGRESO,EGRESO',
            'es_ley' => 'boolean',
            'es_fijo' => 'boolean',
            'algoritmo_calculo' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        ConceptoPago::create($validated);

        return redirect()->back()->with('success', 'Concepto de pago creado.');
    }

    public function update(Request $request, $id)
    {
        $concepto = ConceptoPago::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'tipo' => 'required|in:INGRESO,EGRESO',
            'es_ley' => 'boolean',
            'es_fijo' => 'boolean',
            'algoritmo_calculo' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        $concepto->update($validated);

        return redirect()->back()->with('success', 'Concepto de pago actualizado.');
    }
}
