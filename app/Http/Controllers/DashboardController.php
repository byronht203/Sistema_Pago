<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Empleado;
use App\Models\Departamento;
use App\Models\Cargo;
use App\Models\PlanillaIndividualCab;
use App\Models\AsistenciaMensual;
use App\Models\ConceptoPago;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // IF EMPLOYEE ROLE -> Return isolated Employee Self-Service Portal data
        if ($user->isEmpleado()) {
            $empleado = $user->empleado;
            $boletas = [];
            $asistenciaActual = null;
            $antiguedadDetalle = 'N/A';
            $resumenAnual = [
                'total_ganado_acumulado' => '0.00',
                'total_descuentos_acumulado' => '0.00',
                'liquido_pagable_acumulado' => '0.00',
            ];
            $diasVacacionesEstimados = 0;
            $porcentajeAsistencia = 100;

            if ($empleado) {
                // 1. Fetch boletas strictly for this employee
                $boletas = PlanillaIndividualCab::where('empleado_id', $empleado->id)
                    ->with('detalles.conceptoPago')
                    ->orderBy('periodo_anio', 'desc')
                    ->orderBy('periodo_mes', 'desc')
                    ->get();

                // 2. Current Month Attendance
                $currentMonth = (int) date('m');
                $currentYear = (int) date('Y');
                $asistenciaActual = AsistenciaMensual::where('empleado_id', $empleado->id)
                    ->where('periodo_mes', $currentMonth)
                    ->where('periodo_anio', $currentYear)
                    ->first();

                if ($asistenciaActual) {
                    $porcentajeAsistencia = min(100, round(($asistenciaActual->dias_trabajados / 30.0) * 100));
                }

                // 3. Time in company (Antigüedad)
                $fIngreso = Carbon::parse($empleado->fecha_ingreso);
                $diffYears = $fIngreso->diffInYears(Carbon::now());
                $diffMonths = $fIngreso->diffInMonths(Carbon::now()) % 12;

                if ($diffYears > 0) {
                    $antiguedadDetalle = "{$diffYears} año(s) y {$diffMonths} mes(es)";
                } else {
                    $antiguedadDetalle = "{$diffMonths} mes(es)";
                }

                // 4. Vacation calculation (Bolivian labor standard)
                if ($diffYears >= 10) {
                    $diasVacacionesEstimados = 30;
                } elseif ($diffYears >= 5) {
                    $diasVacacionesEstimados = 20;
                } elseif ($diffYears >= 1) {
                    $diasVacacionesEstimados = 15;
                } else {
                    $diasVacacionesEstimados = 0;
                }

                // 5. Annual Financial Accumulation
                $boletasAñoActual = $boletas->where('periodo_anio', $currentYear);
                $resumenAnual = [
                    'total_ganado_acumulado' => number_format($boletasAñoActual->sum('total_ganado'), 2, '.', ''),
                    'total_descuentos_acumulado' => number_format($boletasAñoActual->sum('total_descuentos'), 2, '.', ''),
                    'liquido_pagable_acumulado' => number_format($boletasAñoActual->sum('liquido_pagable'), 2, '.', ''),
                ];
            }

            return Inertia::render('Dashboard', [
                'role' => 'empleado',
                'empleado' => $empleado ? $empleado->load(['departamento', 'cargo', 'contratoVigente']) : null,
                'antiguedadDetalle' => $antiguedadDetalle,
                'boletas' => $boletas,
                'asistenciaActual' => $asistenciaActual,
                'porcentajeAsistencia' => $porcentajeAsistencia,
                'resumenAnual' => $resumenAnual,
                'diasVacacionesEstimados' => $diasVacacionesEstimados,
            ]);
        }

        // ADMIN & RRHH DASHBOARD METRICS
        $totalEmpleados = Empleado::count();
        $empleadosActivos = Empleado::where('estado', 'ACTIVO')->count();
        $totalDepartamentos = Departamento::count();
        $totalCargos = Cargo::count();
        $totalUsuarios = User::count();

        $currentMonth = (int) date('m');
        $currentYear = (int) date('Y');

        $planillasMesActual = PlanillaIndividualCab::where('periodo_mes', $currentMonth)
            ->where('periodo_anio', $currentYear)
            ->with('empleado')
            ->get();

        $totalPlanillasGeneradas = $planillasMesActual->count();
        $montoTotalNominaMes = $planillasMesActual->sum('liquido_pagable');

        $ultimosEmpleados = Empleado::with(['departamento', 'cargo'])
            ->orderBy('id', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'role' => $user->role ? strtolower($user->role->nombre) : 'admin',
            'stats' => [
                'totalEmpleados' => $totalEmpleados,
                'empleadosActivos' => $empleadosActivos,
                'totalDepartamentos' => $totalDepartamentos,
                'totalCargos' => $totalCargos,
                'totalUsuarios' => $totalUsuarios,
                'totalPlanillasGeneradas' => $totalPlanillasGeneradas,
                'montoTotalNominaMes' => number_format($montoTotalNominaMes, 2, '.', ''),
                'periodoActual' => sprintf('%02d/%d', $currentMonth, $currentYear),
            ],
            'ultimosEmpleados' => $ultimosEmpleados,
            'planillasRecientes' => $planillasMesActual->take(5),
        ]);
    }
}
