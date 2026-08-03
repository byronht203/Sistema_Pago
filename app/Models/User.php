<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'active' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function empleado()
    {
        return $this->hasOne(Empleado::class);
    }

    public function hasRole(string $roleName): bool
    {
        return $this->role && strtolower($this->role->nombre) === strtolower($roleName);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isRrhh(): bool
    {
        return $this->hasRole('rrhh');
    }

    public function isEmpleado(): bool
    {
        return $this->hasRole('empleado');
    }

    public function isAdminOrRrhh(): bool
    {
        return $this->isAdmin() || $this->isRrhh();
    }
}
