<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContratoHistorico extends Model
{
    use HasFactory;

    protected $table = 'contratos_historico';
    public $timestamps = false;

    protected $fillable = [
        'empleado_id',
        'fecha_inicio',
        'fecha_fin',
        'salario_base',
        'tipo_contrato',
        'activo',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'salario_base' => 'decimal:2',
        'activo' => 'boolean',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }
}
