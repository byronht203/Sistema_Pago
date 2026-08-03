<?php

namespace App\Http\Controllers;

use App\Models\AsistenciaMensual;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AsistenciaMensualController extends Controller
{
    public function index(Request $request): Response
    {
        $mes = (int) $request->input('mes', date('m'));
        $anio = (int) $request->input('anio', date('Y'));

        $empleados = Empleado::where('estado', 'ACTIVO')
            ->with(['departamento', 'cargo', 'asistencias' => function ($q) use ($mes, $anio) {
                $q->where('periodo_mes', $mes)->where('periodo_anio', $anio);
            }])
            ->get();

        return Inertia::render('Admin/Asistencias/Index', [
            'empleados' => $empleados,
            'selectedMes' => $mes,
            'selectedAnio' => $anio,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empleado_id' => 'required|exists:empleados,id',
            'periodo_mes' => 'required|integer|between:1,12',
            'periodo_anio' => 'required|integer|min:2020',
            'dias_trabajados' => 'required|integer|between:0,31',
            'horas_extras_diurnas' => 'required|numeric|min:0',
            'horas_extras_nocturnas' => 'required|numeric|min:0',
            'horas_feriado_domingo' => 'required|numeric|min:0',
            'faltas_dias' => 'required|integer|min:0',
            'atrasos_minutos' => 'required|integer|min:0',
        ]);

        AsistenciaMensual::updateOrCreate(
            [
                'empleado_id' => $validated['empleado_id'],
                'periodo_mes' => $validated['periodo_mes'],
                'periodo_anio' => $validated['periodo_anio'],
            ],
            $validated
        );

        return redirect()->back()->with('success', 'Asistencia registrada/actualizada correctamente.');
    }
}
