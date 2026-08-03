<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParametroGlobal extends Model
{
    use HasFactory;

    protected $table = 'parametros_globales';
    protected $primaryKey = 'clave';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'clave',
        'valor',
        'descripcion',
        'fecha_actualizacion',
    ];

    protected $casts = [
        'valor' => 'decimal:4',
        'fecha_actualizacion' => 'datetime',
    ];
}
