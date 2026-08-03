<?php

namespace App\Http\Controllers;

use App\Models\PlanillaIndividualCab;
use App\Models\PlanillaIndividualDet;
use App\Models\Empleado;
use App\Models\AsistenciaMensual;
use App\Models\NovedadMensual;
use App\Models\ConceptoPago;
use App\Models\ParametroGlobal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class PlanillaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // If employee, return only their own planillas securely
        if ($user->isEmpleado()) {
            $empleado = $user->empleado;
            $planillas = $empleado
                ? PlanillaIndividualCab::where('empleado_id', $empleado->id)
                    ->with(['empleado.departamento', 'empleado.cargo', 'detalles.conceptoPago'])
                    ->orderBy('periodo_anio', 'desc')
                    ->orderBy('periodo_mes', 'desc')
                    ->get()
                : collect([]);

            return Inertia::render('Admin/Planillas/Index', [
                'planillas' => $planillas,
                'selectedMes' => (int) date('m'),
                'selectedAnio' => (int) date('Y'),
                'totales' => [
                    'total_ganado' => number_format($planillas->sum('total_ganado'), 2, '.', ''),
                    'total_descuentos' => number_format($planillas->sum('total_descuentos'), 2, '.', ''),
                    'liquido_pagable' => number_format($planillas->sum('liquido_pagable'), 2, '.', ''),
                    'total_boletas' => $planillas->count(),
                ],
                'empleadosActivos' => 1,
                'isEmpleado' => true,
            ]);
        }

        $mes = (int) $request->input('mes', date('m'));
        $anio = (int) $request->input('anio', date('Y'));

        $planillas = PlanillaIndividualCab::where('periodo_mes', $mes)
            ->where('periodo_anio', $anio)
            ->with(['empleado.departamento', 'empleado.cargo', 'detalles.conceptoPago'])
            ->get();

        $totales = [
            'total_ganado' => number_format($planillas->sum('total_ganado'), 2, '.', ''),
            'total_descuentos' => number_format($planillas->sum('total_descuentos'), 2, '.', ''),
            'liquido_pagable' => number_format($planillas->sum('liquido_pagable'), 2, '.', ''),
            'total_boletas' => $planillas->count(),
        ];

        return Inertia::render('Admin/Planillas/Index', [
            'planillas' => $planillas,
            'selectedMes' => $mes,
            'selectedAnio' => $anio,
            'totales' => $totales,
            'empleadosActivos' => Empleado::where('estado', 'ACTIVO')->count(),
            'isEmpleado' => false,
        ]);
    }

    public function generar(Request $request)
    {
        if ($request->user()->isEmpleado()) {
            abort(403, 'Acceso denegado.');
        }

        $validated = $request->validate([
            'periodo_mes' => 'required|integer|between:1,12',
            'periodo_anio' => 'required|integer|min:2020',
        ]);

        $mes = $validated['periodo_mes'];
        $anio = $validated['periodo_anio'];

        // Retrieve global parameters
        $salarioMinimoParam = ParametroGlobal::find('salario_minimo');
        $salarioMinimo = $salarioMinimoParam ? (float)$salarioMinimoParam->valor : 2500.00;

        $afpParam = ParametroGlobal::find('afp_laboral_pct');
        $afpPct = $afpParam ? (float)$afpParam->valor : 0.1271;

        // Retrieve Conceptos de Pago
        $conceptoSalario = ConceptoPago::where('nombre', 'like', '%Salario Base%')->first();
        $conceptoAntiguedad = ConceptoPago::where('nombre', 'like', '%Antigüedad%')->first();
        $conceptoHorasExtras = ConceptoPago::where('nombre', 'like', '%Horas Extras%')->first();
        $conceptoAFP = ConceptoPago::where('nombre', 'like', '%AFP%')->first();
        $conceptoFaltas = ConceptoPago::where('nombre', 'like', '%Faltas%')->first();

        if (!$conceptoSalario) {
            $conceptoSalario = ConceptoPago::create(['nombre' => 'Salario Base Ganado', 'tipo' => 'INGRESO', 'es_ley' => true, 'es_fijo' => true]);
        }
        if (!$conceptoAFP) {
            $conceptoAFP = ConceptoPago::create(['nombre' => 'Aporte Laboral AFP', 'tipo' => 'EGRESO', 'es_ley' => true, 'es_fijo' => true]);
        }

        $empleados = Empleado::where('estado', 'ACTIVO')
            ->with(['contratoVigente'])
            ->get();

        $generadasCount = 0;

        DB::transaction(function () use ($empleados, $mes, $anio, $salarioMinimo, $afpPct, $conceptoSalario, $conceptoAntiguedad, $conceptoHorasExtras, $conceptoAFP, $conceptoFaltas, &$generadasCount) {
            foreach ($empleados as $empleado) {
                $contrato = $empleado->contratoVigente;
                $salarioBase = $contrato ? (float)$contrato->salario_base : 2500.00;

                // Attendance
                $asistencia = AsistenciaMensual::where('empleado_id', $empleado->id)
                    ->where('periodo_mes', $mes)
                    ->where('periodo_anio', $anio)
                    ->first();

                $diasTrabajados = $asistencia ? $asistencia->dias_trabajados : 30;
                $horasExtrasDiurnas = $asistencia ? (float)$asistencia->horas_extras_diurnas : 0;
                $horasExtrasNocturnas = $asistencia ? (float)$asistencia->horas_extras_nocturnas : 0;
                $faltasDias = $asistencia ? (int)$asistencia->faltas_dias : 0;

                // 1. Calculate Ingresos
                $detalles = [];

                // Salario ganado por días trabajados
                $salarioDiario = $salarioBase / 30.0;
                $montoSalarioGanado = round($salarioDiario * $diasTrabajados, 2);
                $detalles[] = [
                    'concepto_pago_id' => $conceptoSalario->id,
                    'monto_calculado' => $montoSalarioGanado,
                    'observacion' => "Calculado sobre {$diasTrabajados} días trabajados en Tropiflor A.G. (Base: Bs. " . number_format($salarioBase, 2) . ")",
                ];

                // Bono de Antigüedad
                $fechaIngreso = Carbon::parse($empleado->fecha_ingreso);
                $fechaPeriodo = Carbon::createFromDate($anio, $mes, 28);
                $antiguedadAnios = $fechaIngreso->diffInYears($fechaPeriodo);

                $pctAntiguedad = 0;
                if ($antiguedadAnios >= 25) $pctAntiguedad = 0.50;
                elseif ($antiguedadAnios >= 20) $pctAntiguedad = 0.42;
                elseif ($antiguedadAnios >= 15) $pctAntiguedad = 0.34;
                elseif ($antiguedadAnios >= 11) $pctAntiguedad = 0.26;
                elseif ($antiguedadAnios >= 8) $pctAntiguedad = 0.18;
                elseif ($antiguedadAnios >= 5) $pctAntiguedad = 0.11;
                elseif ($antiguedadAnios >= 2) $pctAntiguedad = 0.05;

                $montoAntiguedad = round(($salarioMinimo * 3) * $pctAntiguedad, 2);
                if ($montoAntiguedad > 0 && $conceptoAntiguedad) {
                    $detalles[] = [
                        'concepto_pago_id' => $conceptoAntiguedad->id,
                        'monto_calculado' => $montoAntiguedad,
                        'observacion' => "Antigüedad {$antiguedadAnios} años (" . ($pctAntiguedad * 100) . "% de 3 Salarios Mínimos)",
                    ];
                }

                // Horas Extras
                $montoHoraSimple = $salarioBase / 240.0;
                $montoHorasExtras = round(($horasExtrasDiurnas * $montoHoraSimple * 2.0) + ($horasExtrasNocturnas * $montoHoraSimple * 2.5), 2);
                if ($montoHorasExtras > 0 && $conceptoHorasExtras) {
                    $detalles[] = [
                        'concepto_pago_id' => $conceptoHorasExtras->id,
                        'monto_calculado' => $montoHorasExtras,
                        'observacion' => "{$horasExtrasDiurnas}h diurnas + {$horasExtrasNocturnas}h nocturnas",
                    ];
                }

                // Additional Ingresos from Novedades
                $novedades = NovedadMensual::where('empleado_id', $empleado->id)
                    ->where('periodo_mes', $mes)
                    ->where('periodo_anio', $anio)
                    ->with('conceptoPago')
                    ->get();

                foreach ($novedades as $nov) {
                    if ($nov->conceptoPago && $nov->conceptoPago->tipo === 'INGRESO') {
                        $detalles[] = [
                            'concepto_pago_id' => $nov->concepto_pago_id,
                            'monto_calculado' => (float)$nov->monto,
                            'observacion' => $nov->observacion ?? 'Novedad del mes',
                        ];
                    }
                }

                // Calculate Total Ganado
                $totalGanado = array_reduce($detalles, function ($carry, $item) {
                    return $carry + $item['monto_calculado'];
                }, 0);

                // 2. Calculate Egresos (Descuentos)
                $descuentoAFP = round($totalGanado * $afpPct, 2);
                $detalles[] = [
                    'concepto_pago_id' => $conceptoAFP->id,
                    'monto_calculado' => $descuentoAFP,
                    'observacion' => "Retención ley AFP (" . ($afpPct * 100) . "% sobre Total Ganado)",
                ];

                // Descuento por Faltas
                if ($faltasDias > 0) {
                    $montoFaltas = round($salarioDiario * $faltasDias, 2);
                    if ($conceptoFaltas) {
                        $detalles[] = [
                            'concepto_pago_id' => $conceptoFaltas->id,
                            'monto_calculado' => $montoFaltas,
                            'observacion' => "Descuento por {$faltasDias} día(s) de falta no justificada",
                        ];
                    }
                }

                // Additional Egresos from Novedades
                foreach ($novedades as $nov) {
                    if ($nov->conceptoPago && $nov->conceptoPago->tipo === 'EGRESO') {
                        $detalles[] = [
                            'concepto_pago_id' => $nov->concepto_pago_id,
                            'monto_calculado' => (float)$nov->monto,
                            'observacion' => $nov->observacion ?? 'Descuento mensual',
                        ];
                    }
                }

                // Calculate Totals
                $totalIngresos = 0;
                $totalEgresos = 0;

                foreach ($detalles as $det) {
                    $cp = ConceptoPago::find($det['concepto_pago_id']);
                    if ($cp && $cp->tipo === 'EGRESO') {
                        $totalEgresos += $det['monto_calculado'];
                    } else {
                        $totalIngresos += $det['monto_calculado'];
                    }
                }

                $liquidoPagable = max(0, $totalIngresos - $totalEgresos);

                // Delete existing cabecera if updating
                PlanillaIndividualCab::where('empleado_id', $empleado->id)
                    ->where('periodo_mes', $mes)
                    ->where('periodo_anio', $anio)
                    ->delete();

                // Create Planilla Cabecera
                $cabecera = PlanillaIndividualCab::create([
                    'empleado_id' => $empleado->id,
                    'periodo_mes' => $mes,
                    'periodo_anio' => $anio,
                    'fecha_emision' => now(),
                    'total_ganado' => $totalIngresos,
                    'total_descuentos' => $totalEgresos,
                    'liquido_pagable' => $liquidoPagable,
                    'salario_base_snapshot' => $salarioBase,
                    'asistencia_id' => $asistencia ? $asistencia->id : null,
                    'estado' => 'GENERADO',
                ]);

                // Insert Detalles
                foreach ($detalles as $det) {
                    PlanillaIndividualDet::create([
                        'planilla_cab_id' => $cabecera->id,
                        'concepto_pago_id' => $det['concepto_pago_id'],
                        'monto_calculado' => $det['monto_calculado'],
                        'observacion' => $det['observacion'],
                    ]);
                }

                $generadasCount++;
            }
        });

        return redirect()->back()->with('success', "Se han generado exitosamente {$generadasCount} boletas de pago para Tropiflor A.G. correspondiente a {$mes}/{$anio}.");
    }

    public function exportar(Request $request)
    {
        if ($request->user()->isEmpleado()) {
            abort(403, 'Acceso denegado.');
        }

        $mes = (int) $request->input('mes', date('m'));
        $anio = (int) $request->input('anio', date('Y'));

        $planillas = PlanillaIndividualCab::where('periodo_mes', $mes)
            ->where('periodo_anio', $anio)
            ->with(['empleado.departamento', 'empleado.cargo', 'detalles.conceptoPago'])
            ->get();

        $filename = sprintf("Planilla_Tropiflor_AG_%02d_%d.csv", $mes, $anio);

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($planillas, $mes, $anio) {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM for Microsoft Excel auto-detecting encoding
            fwrite($file, "\xEF\xBB\xBF");

            // Header info rows
            fputcsv($file, ["TROPIFLOR A.G. - SISTEMA DE BOLETAS Y PLANILLAS DE PAGO"]);
            fputcsv($file, ["Resumen General de Nómina Salarial - Periodo: " . sprintf("%02d/%d", $mes, $anio)]);
            fputcsv($file, ["Fecha de Exportación: " . date('d/m/Y H:i:s')]);
            fputcsv($file, []);

            // Column Headers
            fputcsv($file, [
                'N°',
                'CI / NIT',
                'Empleado',
                'Departamento',
                'Cargo',
                'Fecha Ingreso',
                'Salario Base (Bs)',
                'Total Ganado (Bs)',
                'Aporte AFP (Bs)',
                'Otros Descuentos (Bs)',
                'Total Descuentos (Bs)',
                'Líquido Pagable (Bs)',
                'Estado'
            ]);

            $totalGanadoSum = 0;
            $totalDescuentosSum = 0;
            $liquidoPagableSum = 0;

            foreach ($planillas as $index => $p) {
                $emp = $p->empleado;
                $afpDet = $p->detalles->first(function($d) {
                    return str_contains(strtolower($d->conceptoPago->nombre ?? ''), 'afp');
                });
                $montoAFP = $afpDet ? (float)$afpDet->monto_calculado : 0.00;
                $otrosDescuentos = (float)$p->total_descuentos - $montoAFP;

                $totalGanadoSum += (float)$p->total_ganado;
                $totalDescuentosSum += (float)$p->total_descuentos;
                $liquidoPagableSum += (float)$p->liquido_pagable;

                fputcsv($file, [
                    $index + 1,
                    $emp ? $emp->ci_nit : 'N/A',
                    $emp ? "{$emp->nombres} {$emp->apellidos}" : 'N/A',
                    $emp && $emp->departamento ? $emp->departamento->nombre : 'General',
                    $emp && $emp->cargo ? $emp->cargo->nombre : 'General',
                    $emp ? $emp->fecha_ingreso : 'N/A',
                    number_format($p->salario_base_snapshot, 2, '.', ''),
                    number_format($p->total_ganado, 2, '.', ''),
                    number_format($montoAFP, 2, '.', ''),
                    number_format($otrosDescuentos, 2, '.', ''),
                    number_format($p->total_descuentos, 2, '.', ''),
                    number_format($p->liquido_pagable, 2, '.', ''),
                    $p->estado,
                ]);
            }

            // Summary Totals row
            fputcsv($file, []);
            fputcsv($file, [
                'TOTALES GENERALES',
                '',
                '',
                '',
                '',
                '',
                '',
                number_format($totalGanadoSum, 2, '.', ''),
                '',
                '',
                number_format($totalDescuentosSum, 2, '.', ''),
                number_format($liquidoPagableSum, 2, '.', ''),
                ''
            ]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $planilla = PlanillaIndividualCab::with([
            'empleado.departamento',
            'empleado.cargo',
            'asistencia',
            'detalles.conceptoPago'
        ])->findOrFail($id);

        // Security check: If employee role, ensure boleta belongs strictly to logged in employee
        if ($user->isEmpleado()) {
            if (!$user->empleado || $planilla->empleado_id !== $user->empleado->id) {
                abort(403, 'Acceso denegado. No tienes permiso para ver esta boleta de pago.');
            }
        }

        return Inertia::render('Admin/Planillas/Show', [
            'planilla' => $planilla,
        ]);
    }

    public function cambiarEstado(Request $request, $id)
    {
        if ($request->user()->isEmpleado()) {
            abort(403, 'Acceso denegado.');
        }

        $planilla = PlanillaIndividualCab::findOrFail($id);
        $validated = $request->validate([
            'estado' => 'required|in:GENERADO,APROBADO,PAGADO,ANULADO',
        ]);

        $planilla->update(['estado' => $validated['estado']]);

        return redirect()->back()->with('success', "Estado de la boleta de Tropiflor A.G. actualizado a {$validated['estado']}.");
    }
}
