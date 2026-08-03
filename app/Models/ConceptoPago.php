<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConceptoPago extends Model
{
    use HasFactory;

    protected $table = 'conceptos_pago';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'tipo',
        'es_ley',
        'es_fijo',
        'algoritmo_calculo',
        'activo',
    ];

    protected $casts = [
        'es_ley' => 'boolean',
        'es_fijo' => 'boolean',
        'activo' => 'boolean',
    ];
}
