<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanillaIndividualDet extends Model
{
    use HasFactory;

    protected $table = 'planilla_individual_det';
    public $timestamps = false;

    protected $fillable = [
        'planilla_cab_id',
        'concepto_pago_id',
        'monto_calculado',
        'observacion',
    ];

    protected $casts = [
        'monto_calculado' => 'decimal:2',
    ];

    public function cabecera()
    {
        return $this->belongsTo(PlanillaIndividualCab::class, 'planilla_cab_id');
    }

    public function conceptoPago()
    {
        return $this->belongsTo(ConceptoPago::class);
    }
}
