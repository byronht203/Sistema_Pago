<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NovedadMensual extends Model
{
    use HasFactory;

    protected $table = 'novedades_mensuales';
    public $timestamps = false;

    protected $fillable = [
        'empleado_id',
        'concepto_pago_id',
        'periodo_mes',
        'periodo_anio',
        'monto',
        'observacion',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    public function conceptoPago()
    {
        return $this->belongsTo(ConceptoPago::class);
    }
}
