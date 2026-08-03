<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Departamento;
use App\Models\Cargo;
use App\Models\Role;
use App\Models\User;
use App\Models\ContratoHistorico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EmpleadoController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $departamentoId = $request->input('departamento_id');
        $estado = $request->input('estado');

        $query = Empleado::with(['departamento', 'cargo', 'user', 'contratoVigente']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombres', 'like', "%{$search}%")
                  ->orWhere('apellidos', 'like', "%{$search}%")
                  ->orWhere('ci_nit', 'like', "%{$search}%")
                  ->orWhere('email_corporativo', 'like', "%{$search}%")
                  ->orWhere('telefono', 'like', "%{$search}%");
            });
        }

        if ($departamentoId) {
            $query->where('departamento_id', $departamentoId);
        }

        if ($estado) {
            $query->where('estado', $estado);
        }

        $empleados = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Empleados/Index', [
            'empleados' => $empleados,
            'departamentos' => Departamento::all(),
            'cargos' => Cargo::all(),
            'filters' => [
                'search' => $search,
                'departamento_id' => $departamentoId,
                'estado' => $estado,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ci_nit' => 'required|string|max:20|unique:empleados,ci_nit',
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'fecha_nacimiento' => 'required|date',
            'genero' => 'required|in:M,F,O',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email_personal' => 'nullable|email|max:100',
            'email_corporativo' => 'required|email|max:100|unique:users,email',
            'departamento_id' => 'required|exists:departamentos,id',
            'cargo_id' => 'required|exists:cargos,id',
            'fecha_ingreso' => 'required|date',
            'fecha_retiro' => 'nullable|date|after_or_equal:fecha_ingreso',
            'salario_base' => 'required|numeric|min:0',
            'tipo_contrato' => 'required|in:INDEFINIDO,FIJO,EVENTUAL,CONSULTORIA',
            'password' => 'required|string|min:6',
        ]);

        DB::transaction(function () use ($validated) {
            // Get employee role
            $roleEmpleado = Role::where('nombre', 'empleado')->first();
            $roleId = $roleEmpleado ? $roleEmpleado->id : 3;

            // 1. Create User
            $user = User::create([
                'name' => "{$validated['nombres']} {$validated['apellidos']}",
                'email' => $validated['email_corporativo'],
                'password' => Hash::make($validated['password']),
                'role_id' => $roleId,
                'active' => true,
            ]);

            // 2. Create Empleado
            $empleado = Empleado::create([
                'ci_nit' => $validated['ci_nit'],
                'nombres' => $validated['nombres'],
                'apellidos' => $validated['apellidos'],
                'fecha_nacimiento' => $validated['fecha_nacimiento'],
                'genero' => $validated['genero'],
                'direccion' => $validated['direccion'] ?? null,
                'telefono' => $validated['telefono'] ?? null,
                'email_personal' => $validated['email_personal'] ?? null,
                'email_corporativo' => $validated['email_corporativo'],
                'departamento_id' => $validated['departamento_id'],
                'cargo_id' => $validated['cargo_id'],
                'user_id' => $user->id,
                'estado' => 'ACTIVO',
                'fecha_ingreso' => $validated['fecha_ingreso'],
                'fecha_retiro' => $validated['fecha_retiro'] ?? null,
            ]);

            // 3. Create ContratoHistorico
            ContratoHistorico::create([
                'empleado_id' => $empleado->id,
                'fecha_inicio' => $validated['fecha_ingreso'],
                'fecha_fin' => $validated['fecha_retiro'] ?? null,
                'salario_base' => $validated['salario_base'],
                'tipo_contrato' => $validated['tipo_contrato'],
                'activo' => empty($validated['fecha_retiro']),
            ]);
        });

        return redirect()->back()->with('success', 'Empleado y contrato registrados correctamente.');
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);

        $validated = $request->validate([
            'ci_nit' => 'required|string|max:20|unique:empleados,ci_nit,' . $empleado->id,
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'fecha_nacimiento' => 'required|date',
            'genero' => 'required|in:M,F,O',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email_personal' => 'nullable|email|max:100',
            'departamento_id' => 'required|exists:departamentos,id',
            'cargo_id' => 'required|exists:cargos,id',
            'estado' => 'required|in:ACTIVO,INACTIVO,VACACIONES,LICENCIA',
            'fecha_ingreso' => 'required|date',
            'fecha_retiro' => 'nullable|date',
            'salario_base' => 'required|numeric|min:0',
            'tipo_contrato' => 'required|in:INDEFINIDO,FIJO,EVENTUAL,CONSULTORIA',
        ]);

        DB::transaction(function () use ($empleado, $validated) {
            $empleado->update([
                'ci_nit' => $validated['ci_nit'],
                'nombres' => $validated['nombres'],
                'apellidos' => $validated['apellidos'],
                'fecha_nacimiento' => $validated['fecha_nacimiento'],
                'genero' => $validated['genero'],
                'direccion' => $validated['direccion'] ?? null,
                'telefono' => $validated['telefono'] ?? null,
                'email_personal' => $validated['email_personal'] ?? null,
                'departamento_id' => $validated['departamento_id'],
                'cargo_id' => $validated['cargo_id'],
                'estado' => $validated['estado'],
                'fecha_ingreso' => $validated['fecha_ingreso'],
                'fecha_retiro' => $validated['fecha_retiro'] ?? null,
            ]);

            // Update user name and active state
            if ($empleado->user) {
                $empleado->user->update([
                    'name' => "{$validated['nombres']} {$validated['apellidos']}",
                    'active' => $validated['estado'] === 'ACTIVO',
                ]);
            }

            // Check if salary or contract type changed
            $contratoVigente = $empleado->contratoVigente;
            if (!$contratoVigente || (float)$contratoVigente->salario_base !== (float)$validated['salario_base'] || $contratoVigente->tipo_contrato !== $validated['tipo_contrato']) {
                if ($contratoVigente) {
                    $contratoVigente->update([
                        'fecha_fin' => date('Y-m-d'),
                        'activo' => false,
                    ]);
                }

                ContratoHistorico::create([
                    'empleado_id' => $empleado->id,
                    'fecha_inicio' => date('Y-m-d'),
                    'fecha_fin' => $validated['fecha_retiro'] ?? null,
                    'salario_base' => $validated['salario_base'],
                    'tipo_contrato' => $validated['tipo_contrato'],
                    'activo' => $validated['estado'] === 'ACTIVO',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Información del empleado y contrato actualizada correctamente.');
    }
}
