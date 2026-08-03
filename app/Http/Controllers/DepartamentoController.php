<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartamentoController extends Controller
{
    public function index(): Response
    {
        $departamentos = Departamento::withCount('empleados')->orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Departamentos/Index', [
            'departamentos' => $departamentos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:departamentos,nombre',
            'descripcion' => 'nullable|string|max:255',
        ]);

        Departamento::create($validated);

        return redirect()->back()->with('success', 'Departamento creado exitosamente.');
    }

    public function update(Request $request, $id)
    {
        $departamento = Departamento::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:departamentos,nombre,' . $departamento->id,
            'descripcion' => 'nullable|string|max:255',
        ]);

        $departamento->update($validated);

        return redirect()->back()->with('success', 'Departamento actualizado correctamente.');
    }

    public function destroy($id)
    {
        $departamento = Departamento::findOrFail($id);
        if ($departamento->empleados()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar un departamento con empleados asignados.');
        }

        $departamento->delete();

        return redirect()->back()->with('success', 'Departamento eliminado.');
    }
}
