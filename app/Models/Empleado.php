<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'ci_nit',
        'nombres',
        'apellidos',
        'fecha_nacimiento',
        'genero',
        'direccion',
        'telefono',
        'email_personal',
        'email_corporativo',
        'departamento_id',
        'cargo_id',
        'user_id',
        'estado',
        'fecha_ingreso',
        'fecha_retiro',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_ingreso' => 'date',
        'fecha_retiro' => 'date',
    ];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    public function cargo()
    {
        return $this->belongsTo(Cargo::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contratos()
    {
        return $this->hasMany(ContratoHistorico::class);
    }

    public function contratoVigente()
    {
        return $this->hasOne(ContratoHistorico::class)->where('activo', true);
    }

    public function asistencias()
    {
        return $this->hasMany(AsistenciaMensual::class);
    }

    public function novedades()
    {
        return $this->hasMany(NovedadMensual::class);
    }

    public function planillas()
    {
        return $this->hasMany(PlanillaIndividualCab::class);
    }

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombres} {$this->apellidos}";
    }
}
