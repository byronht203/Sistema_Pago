<?php

namespace App\Http\Controllers;

use App\Models\Cargo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CargoController extends Controller
{
    public function index(): Response
    {
        $cargos = Cargo::withCount('empleados')->orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Cargos/Index', [
            'cargos' => $cargos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:cargos,nombre',
            'nivel_salarial' => 'nullable|string|max:50',
        ]);

        Cargo::create($validated);

        return redirect()->back()->with('success', 'Cargo creado exitosamente.');
    }

    public function update(Request $request, $id)
    {
        $cargo = Cargo::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:cargos,nombre,' . $cargo->id,
            'nivel_salarial' => 'nullable|string|max:50',
        ]);

        $cargo->update($validated);

        return redirect()->back()->with('success', 'Cargo actualizado correctamente.');
    }

    public function destroy($id)
    {
        $cargo = Cargo::findOrFail($id);
        if ($cargo->empleados()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar un cargo asignado a empleados.');
        }

        $cargo->delete();

        return redirect()->back()->with('success', 'Cargo eliminado.');
    }
}
