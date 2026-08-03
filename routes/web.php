<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\CargoController;
use App\Http\Controllers\ConceptoPagoController;
use App\Http\Controllers\ParametroGlobalController;
use App\Http\Controllers\AsistenciaMensualController;
use App\Http\Controllers\PlanillaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - Tropiflor A.G. AgroEcoPay
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin & RRHH Modules
    Route::prefix('admin')->name('admin.')->group(function () {
        // Gestión de Usuarios (Exclusivo Admin)
        Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::post('/usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update'])->name('usuarios.update');
        Route::patch('/usuarios/{id}/toggle', [UsuarioController::class, 'toggleState'])->name('usuarios.toggle');

        // Empleados
        Route::get('/empleados', [EmpleadoController::class, 'index'])->name('empleados.index');
        Route::post('/empleados', [EmpleadoController::class, 'store'])->name('empleados.store');
        Route::put('/empleados/{id}', [EmpleadoController::class, 'update'])->name('empleados.update');

        // Departamentos
        Route::get('/departamentos', [DepartamentoController::class, 'index'])->name('departamentos.index');
        Route::post('/departamentos', [DepartamentoController::class, 'store'])->name('departamentos.store');
        Route::put('/departamentos/{id}', [DepartamentoController::class, 'update'])->name('departamentos.update');
        Route::delete('/departamentos/{id}', [DepartamentoController::class, 'destroy'])->name('departamentos.destroy');

        // Cargos
        Route::get('/cargos', [CargoController::class, 'index'])->name('cargos.index');
        Route::post('/cargos', [CargoController::class, 'store'])->name('cargos.store');
        Route::put('/cargos/{id}', [CargoController::class, 'update'])->name('cargos.update');
        Route::delete('/cargos/{id}', [CargoController::class, 'destroy'])->name('cargos.destroy');

        // Conceptos de Pago & Parámetros
        Route::get('/conceptos', [ConceptoPagoController::class, 'index'])->name('conceptos.index');
        Route::post('/conceptos', [ConceptoPagoController::class, 'store'])->name('conceptos.store');
        Route::put('/conceptos/{id}', [ConceptoPagoController::class, 'update'])->name('conceptos.update');
        Route::put('/parametros/{clave}', [ParametroGlobalController::class, 'update'])->name('parametros.update');

        // Asistencia Mensual
        Route::get('/asistencias', [AsistenciaMensualController::class, 'index'])->name('asistencias.index');
        Route::post('/asistencias', [AsistenciaMensualController::class, 'store'])->name('asistencias.store');

        // Planillas y Boletas de Pago
        Route::get('/planillas', [PlanillaController::class, 'index'])->name('planillas.index');
        Route::get('/planillas/exportar', [PlanillaController::class, 'exportar'])->name('planillas.exportar');
        Route::post('/planillas/generar', [PlanillaController::class, 'generar'])->name('planillas.generar');
        Route::get('/planillas/{id}', [PlanillaController::class, 'show'])->name('planillas.show');
        Route::patch('/planillas/{id}/estado', [PlanillaController::class, 'cambiarEstado'])->name('planillas.estado');
    });

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
