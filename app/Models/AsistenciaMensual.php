<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsistenciaMensual extends Model
{
    use HasFactory;

    protected $table = 'asistencia_mensual';
    public $timestamps = false;

    protected $fillable = [
        'empleado_id',
        'periodo_mes',
        'periodo_anio',
        'dias_trabajados',
        'horas_extras_diurnas',
        'horas_extras_nocturnas',
        'horas_feriado_domingo',
        'faltas_dias',
        'atrasos_minutos',
    ];

    protected $casts = [
        'horas_extras_diurnas' => 'decimal:2',
        'horas_extras_nocturnas' => 'decimal:2',
        'horas_feriado_domingo' => 'decimal:2',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }
}
