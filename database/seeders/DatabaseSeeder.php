<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;
use App\Models\Departamento;
use App\Models\Cargo;
use App\Models\Empleado;
use App\Models\ContratoHistorico;
use App\Models\ConceptoPago;
use App\Models\ParametroGlobal;
use App\Models\AsistenciaMensual;
use App\Models\PlanillaIndividualCab;
use App\Models\PlanillaIndividualDet;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database for Tropiflor A.G.
     */
    public function run(): void
    {
        $sqlPath = base_path('SQL.sql');

        if (file_exists($sqlPath)) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            $tables = [
                'planilla_individual_det',
                'planilla_individual_cab',
                'novedades_mensuales',
                'asistencia_mensual',
                'parametros_globales',
                'conceptos_pago',
                'contratos_historico',
                'empleados',
                'cargos',
                'departamentos',
                'users',
                'roles',
            ];

            foreach ($tables as $t) {
                DB::statement("DROP TABLE IF EXISTS {$t};");
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            $sql = file_get_contents($sqlPath);
            $sql = preg_replace('/CREATE DATABASE IF NOT EXISTS sistema_pagos_db;/i', '', $sql);
            $sql = preg_replace('/USE sistema_pagos_db;/i', '', $sql);

            DB::unprepared($sql);
        }

        // 1. Departamentos Tropiflor A.G.
        $deptosData = [
            ['nombre' => 'Producción de Flores & Plantas Tropicales', 'descripcion' => 'Cultivo, corte y cosecha de flores exóticas y orquídeas'],
            ['nombre' => 'Invernaderos & Cultivos Protegidos', 'descripcion' => 'Control de ambiente, humedad y fertirriego automatizado'],
            ['nombre' => 'Gestión Bio-Orgánica & Compostaje', 'descripcion' => 'Tratamiento y valorización de residuos vegetales y sustratos'],
            ['nombre' => 'Control de Calidad & Exportación', 'descripcion' => 'Clasificación, empaque en frío y despacho internacional'],
            ['nombre' => 'Administración & Recursos Humanos', 'descripcion' => 'Gestión financiera, nómina y administración general'],
            ['nombre' => 'Mantenimiento & Maquinaria Agrícola', 'descripcion' => 'Mantenimiento de flota vehicular, bombas de riego y tractores']
        ];

        $deptos = [];
        foreach ($deptosData as $d) {
            $deptos[] = Departamento::create($d);
        }

        // 2. Cargos Tropiflor A.G.
        $cargosData = [
            ['nombre' => 'Gerente de Operaciones Agrícolas', 'nivel_salarial' => 'Nivel 1 - Ejecutivo'],
            ['nombre' => 'Ingeniero Agrónomo Floricultor', 'nivel_salarial' => 'Nivel 2 - Profesional'],
            ['nombre' => 'Supervisor de Invernadero', 'nivel_salarial' => 'Nivel 2 - Supervisor'],
            ['nombre' => 'Especialista en Control de Plagas', 'nivel_salarial' => 'Nivel 2 - Técnico'],
            ['nombre' => 'Operador de Planta Bio-Orgánica', 'nivel_salarial' => 'Nivel 3 - Operativo'],
            ['nombre' => 'Clasificador y Empacador de Flor', 'nivel_salarial' => 'Nivel 3 - Operativo'],
            ['nombre' => 'Conductor de Carga Refrigerada', 'nivel_salarial' => 'Nivel 3 - Operativo'],
            ['nombre' => 'Analista de Nómina & RRHH', 'nivel_salarial' => 'Nivel 2 - Administrativo']
        ];

        $cargos = [];
        foreach ($cargosData as $c) {
            $cargos[] = Cargo::create($c);
        }

        // 3. Roles
        $adminRole = Role::where('nombre', 'admin')->first() ?: Role::create(['nombre' => 'admin', 'descripcion' => 'Administrador Total']);
        $rrhhRole = Role::where('nombre', 'rrhh')->first() ?: Role::create(['nombre' => 'rrhh', 'descripcion' => 'Gestor RRHH']);
        $empRole = Role::where('nombre', 'empleado')->first() ?: Role::create(['nombre' => 'empleado', 'descripcion' => 'Empleado Final']);

        // 4. Default System Users
        User::create([
            'name' => 'Admin Tropiflor A.G.',
            'email' => 'admin@sistema.com',
            'password' => Hash::make('password123'),
            'role_id' => $adminRole->id,
            'active' => true,
        ]);

        User::create([
            'name' => 'Gestor RRHH Tropiflor',
            'email' => 'rrhh@sistema.com',
            'password' => Hash::make('password123'),
            'role_id' => $rrhhRole->id,
            'active' => true,
        ]);

        // 5. Rich Test Employees list for Tropiflor A.G.
        $empleadosSeeders = [
            [
                'ci_nit' => '4829103',
                'nombres' => 'Carlos Alberto',
                'apellidos' => 'Mendoza Silva',
                'fecha_nacimiento' => '1988-04-12',
                'genero' => 'M',
                'direccion' => 'Av. Las Palmas #240, Santa Cruz',
                'telefono' => '76543210',
                'email_personal' => 'carlos.mendoza@gmail.com',
                'email_corporativo' => 'empleado@sistema.com',
                'depto_idx' => 1, // Invernaderos
                'cargo_idx' => 2, // Supervisor de Invernadero
                'salario_base' => 4500.00,
                'fecha_ingreso' => '2019-03-15',
                'tipo_contrato' => 'INDEFINIDO',
            ],
            [
                'ci_nit' => '5910293',
                'nombres' => 'María Fernanda',
                'apellidos' => 'Rojas Ortiz',
                'fecha_nacimiento' => '1992-08-25',
                'genero' => 'F',
                'direccion' => 'Calle Los Claveles #88, Cotoca',
                'telefono' => '71234567',
                'email_personal' => 'mafe.rojas@outlook.com',
                'email_corporativo' => 'mrojas@tropiflor.com',
                'depto_idx' => 0, // Produccion Flores
                'cargo_idx' => 1, // Ing Agronomo
                'salario_base' => 6200.00,
                'fecha_ingreso' => '2017-06-01',
                'tipo_contrato' => 'INDEFINIDO',
            ],
            [
                'ci_nit' => '6781204',
                'nombres' => 'Jorge Luis',
                'apellidos' => 'Vargas Machicado',
                'fecha_nacimiento' => '1995-11-03',
                'genero' => 'M',
                'direccion' => 'Barrio Primavera #12',
                'telefono' => '78901234',
                'email_personal' => 'jorge.vargas@hotmail.com',
                'email_corporativo' => 'jvargas@tropiflor.com',
                'depto_idx' => 2, // Bio-organica
                'cargo_idx' => 4, // Operador Bio
                'salario_base' => 3200.00,
                'fecha_ingreso' => '2021-01-10',
                'tipo_contrato' => 'INDEFINIDO',
            ],
            [
                'ci_nit' => '7128930',
                'nombres' => 'Lucía Jimena',
                'apellidos' => 'Flores Benítez',
                'fecha_nacimiento' => '1996-02-18',
                'genero' => 'F',
                'direccion' => 'Av. San Aurelio #510',
                'telefono' => '73456789',
                'email_personal' => 'lucia.flores@gmail.com',
                'email_corporativo' => 'lflores@tropiflor.com',
                'depto_idx' => 3, // Control Calidad
                'cargo_idx' => 5, // Clasificador Empacador
                'salario_base' => 2800.00,
                'fecha_ingreso' => '2022-05-20',
                'tipo_contrato' => 'FIJO',
            ],
            [
                'ci_nit' => '3920194',
                'nombres' => 'Roberto Carlos',
                'apellidos' => 'Gutiérrez Suárez',
                'fecha_nacimiento' => '1984-09-30',
                'genero' => 'M',
                'direccion' => 'Km 14 Doble Vía La Guardia',
                'telefono' => '75678901',
                'email_personal' => 'roberto.gutierrez@gmail.com',
                'email_corporativo' => 'rgutierrez@tropiflor.com',
                'depto_idx' => 5, // Mantenimiento
                'cargo_idx' => 6, // Conductor
                'salario_base' => 3800.00,
                'fecha_ingreso' => '2016-11-01',
                'tipo_contrato' => 'INDEFINIDO',
            ],
            [
                'ci_nit' => '8291023',
                'nombres' => 'Patricia Andrea',
                'apellidos' => 'Campos Medina',
                'fecha_nacimiento' => '1991-07-14',
                'genero' => 'F',
                'direccion' => 'Urb. El Remanso #34',
                'telefono' => '77890123',
                'email_personal' => 'patty.campos@gmail.com',
                'email_corporativo' => 'pcampos@tropiflor.com',
                'depto_idx' => 4, // RRHH
                'cargo_idx' => 7, // Analista RRHH
                'salario_base' => 4800.00,
                'fecha_ingreso' => '2020-09-15',
                'tipo_contrato' => 'INDEFINIDO',
            ]
        ];

        $currentMes = (int) date('m');
        $currentAnio = (int) date('Y');

        // Conceptos de pago
        $cpSalario = ConceptoPago::where('nombre', 'like', '%Salario Base%')->first() ?: ConceptoPago::create(['nombre' => 'Salario Base mensual', 'tipo' => 'INGRESO', 'es_ley' => true, 'es_fijo' => true]);
        $cpAntiguedad = ConceptoPago::where('nombre', 'like', '%Antigüedad%')->first() ?: ConceptoPago::create(['nombre' => 'Bono de Antigüedad', 'tipo' => 'INGRESO', 'es_ley' => true, 'es_fijo' => true]);
        $cpExtras = ConceptoPago::where('nombre', 'like', '%Horas Extras%')->first() ?: ConceptoPago::create(['nombre' => 'Horas Extras Diurnas', 'tipo' => 'INGRESO', 'es_ley' => false, 'es_fijo' => false]);
        $cpAFP = ConceptoPago::where('nombre', 'like', '%AFP%')->first() ?: ConceptoPago::create(['nombre' => 'Aporte Laboral AFP', 'tipo' => 'EGRESO', 'es_ley' => true, 'es_fijo' => true]);
        $cpFaltas = ConceptoPago::where('nombre', 'like', '%Faltas%')->first() ?: ConceptoPago::create(['nombre' => 'Descuento por Faltas', 'tipo' => 'EGRESO', 'es_ley' => false, 'es_fijo' => false]);

        $salarioMinimo = 2500.00;
        $afpPct = 0.1271;

        foreach ($empleadosSeeders as $idx => $empData) {
            $u = User::create([
                'name' => "{$empData['nombres']} {$empData['apellidos']}",
                'email' => $empData['email_corporativo'],
                'password' => Hash::make('password123'),
                'role_id' => $empRole->id,
                'active' => true,
            ]);

            $emp = Empleado::create([
                'ci_nit' => $empData['ci_nit'],
                'nombres' => $empData['nombres'],
                'apellidos' => $empData['apellidos'],
                'fecha_nacimiento' => $empData['fecha_nacimiento'],
                'genero' => $empData['genero'],
                'direccion' => $empData['direccion'],
                'telefono' => $empData['telefono'],
                'email_personal' => $empData['email_personal'],
                'email_corporativo' => $empData['email_corporativo'],
                'departamento_id' => $deptos[$empData['depto_idx']]->id,
                'cargo_id' => $cargos[$empData['cargo_idx']]->id,
                'user_id' => $u->id,
                'estado' => 'ACTIVO',
                'fecha_ingreso' => $empData['fecha_ingreso'],
            ]);

            ContratoHistorico::create([
                'empleado_id' => $emp->id,
                'fecha_inicio' => $empData['fecha_ingreso'],
                'salario_base' => $empData['salario_base'],
                'tipo_contrato' => $empData['tipo_contrato'],
                'activo' => true,
            ]);

            // 6. Attendance for current month
            $diasTrab = $idx === 3 ? 28 : 30; // 1 employee with 28 days
            $faltas = $idx === 3 ? 2 : 0;
            $hExtrasDiurnas = ($idx % 2 === 0) ? 6.0 : 0.0;

            $asis = AsistenciaMensual::create([
                'empleado_id' => $emp->id,
                'periodo_mes' => $currentMes,
                'periodo_anio' => $currentAnio,
                'dias_trabajados' => $diasTrab,
                'horas_extras_diurnas' => $hExtrasDiurnas,
                'horas_extras_nocturnas' => 0,
                'horas_feriado_domingo' => 0,
                'faltas_dias' => $faltas,
                'atrasos_minutos' => 0,
            ]);

            // 7. Pre-generate sample boletas for current month
            $salarioBase = $empData['salario_base'];
            $salarioDiario = $salarioBase / 30.0;
            $salarioGanado = round($salarioDiario * $diasTrab, 2);

            // Antigüedad
            $fIngreso = Carbon::parse($empData['fecha_ingreso']);
            $antiguedadAnios = $fIngreso->diffInYears(Carbon::now());
            $pctAntiguedad = 0;
            if ($antiguedadAnios >= 20) $pctAntiguedad = 0.42;
            elseif ($antiguedadAnios >= 15) $pctAntiguedad = 0.34;
            elseif ($antiguedadAnios >= 11) $pctAntiguedad = 0.26;
            elseif ($antiguedadAnios >= 8) $pctAntiguedad = 0.18;
            elseif ($antiguedadAnios >= 5) $pctAntiguedad = 0.11;
            elseif ($antiguedadAnios >= 2) $pctAntiguedad = 0.05;

            $montoAntiguedad = round(($salarioMinimo * 3) * $pctAntiguedad, 2);
            $montoExtras = round(($hExtrasDiurnas * ($salarioBase / 240.0) * 2.0), 2);

            $totalGanado = $salarioGanado + $montoAntiguedad + $montoExtras;
            $montoAFP = round($totalGanado * $afpPct, 2);
            $montoFaltas = round($salarioDiario * $faltas, 2);
            $totalDescuentos = $montoAFP + $montoFaltas;
            $liquidoPagable = max(0, $totalGanado - $totalDescuentos);

            $cab = PlanillaIndividualCab::create([
                'empleado_id' => $emp->id,
                'periodo_mes' => $currentMes,
                'periodo_anio' => $currentAnio,
                'fecha_emision' => now()->toDateString(),
                'total_ganado' => $totalGanado,
                'total_descuentos' => $totalDescuentos,
                'liquido_pagable' => $liquidoPagable,
                'salario_base_snapshot' => $salarioBase,
                'asistencia_id' => $asis->id,
                'estado' => 'GENERADO',
            ]);

            PlanillaIndividualDet::create([
                'planilla_cab_id' => $cab->id,
                'concepto_pago_id' => $cpSalario->id,
                'monto_calculado' => $salarioGanado,
                'observacion' => "Calculado sobre {$diasTrab} días laborados en Tropiflor A.G.",
            ]);

            if ($montoAntiguedad > 0) {
                PlanillaIndividualDet::create([
                    'planilla_cab_id' => $cab->id,
                    'concepto_pago_id' => $cpAntiguedad->id,
                    'monto_calculado' => $montoAntiguedad,
                    'observacion' => "Bono antigüedad ({$antiguedadAnios} años de servicio)",
                ]);
            }

            if ($montoExtras > 0) {
                PlanillaIndividualDet::create([
                    'planilla_cab_id' => $cab->id,
                    'concepto_pago_id' => $cpExtras->id,
                    'monto_calculado' => $montoExtras,
                    'observacion' => "{$hExtrasDiurnas} horas extras diurnas",
                ]);
            }

            PlanillaIndividualDet::create([
                'planilla_cab_id' => $cab->id,
                'concepto_pago_id' => $cpAFP->id,
                'monto_calculado' => $montoAFP,
                'observacion' => "Aporte laboral obligatorio Ley AFP (12.71%)",
            ]);

            if ($montoFaltas > 0) {
                PlanillaIndividualDet::create([
                    'planilla_cab_id' => $cab->id,
                    'concepto_pago_id' => $cpFaltas->id,
                    'monto_calculado' => $montoFaltas,
                    'observacion' => "Descuento por {$faltas} día(s) de falta",
                ]);
            }
        }
    }
}
