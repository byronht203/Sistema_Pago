<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanillaIndividualCab extends Model
{
    use HasFactory;

    protected $table = 'planilla_individual_cab';
    public $timestamps = false;

    protected $fillable = [
        'empleado_id',
        'periodo_mes',
        'periodo_anio',
        'fecha_emision',
        'total_ganado',
        'total_descuentos',
        'liquido_pagable',
        'salario_base_snapshot',
        'asistencia_id',
        'estado',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'total_ganado' => 'decimal:2',
        'total_descuentos' => 'decimal:2',
        'liquido_pagable' => 'decimal:2',
        'salario_base_snapshot' => 'decimal:2',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    public function asistencia()
    {
        return $this->belongsTo(AsistenciaMensual::class, 'asistencia_id');
    }

    public function detalles()
    {
        return $this->hasMany(PlanillaIndividualDet::class, 'planilla_cab_id');
    }
}
