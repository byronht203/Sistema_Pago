<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(Request $request): Response
    {
        // Enforce Admin role check
        if (!$request->user()->isAdmin()) {
            abort(403, 'Acceso denegado. Este módulo es exclusivo para Administradores.');
        }

        $search = $request->input('search');
        $roleId = $request->input('role_id');

        $query = User::with(['role', 'empleado.departamento', 'empleado.cargo']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleId) {
            $query->where('role_id', $roleId);
        }

        $usuarios = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();
        $roles = Role::all();

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios,
            'roles' => $roles,
            'filters' => [
                'search' => $search,
                'role_id' => $roleId,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'active' => 'boolean',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'active' => $request->boolean('active', true),
        ]);

        return redirect()->back()->with('success', 'Usuario creado exitosamente.');
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'active' => 'boolean',
            'password' => 'nullable|string|min:6',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'active' => $request->boolean('active'),
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'Información del usuario actualizada.');
    }

    public function toggleState(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Acceso denegado.');
        }

        $user = User::findOrFail($id);

        // Don't deactivate self
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'No puedes desactivar tu propio usuario en sesión.');
        }

        $user->update(['active' => !$user->active]);

        $estadoTexto = $user->active ? 'activada' : 'desactivada';
        return redirect()->back()->with('success', "Cuenta de usuario {$user->name} {$estadoTexto}.");
    }
}
