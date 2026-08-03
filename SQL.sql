-- SCRIPT COMPLETO DE BASE DE DATOS: SISTEMAPAGOS_DB
-- Automatización de Boletas de Pago e Integración de Usuarios
-- Compatible con MySQL / MariaDB (Soporte UTF-8 Completo para caracteres como 'ñ', tildes y símbolos)

CREATE DATABASE IF NOT EXISTS sistema_pagos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_pagos_db;

-- ==========================================================
-- MODULO 0: SEGURIDAD Y ACCESO
-- ==========================================================

-- Tabla para definir los roles del sistema
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- Ej: 'admin', 'rrhh', 'empleado'
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de usuarios (estándar de Laravel + personalización)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Nombre a mostrar
    email VARCHAR(255) NOT NULL UNIQUE, -- Correo para login
    email_verified_at TIMESTAMP NULL, -- Verificación de email estándar de Laravel
    password VARCHAR(255) NOT NULL, -- Hash de la contraseña
    role_id INT NOT NULL, -- Rol asignado
    active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100), -- Para la opción "Recuérdame" de Laravel
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- MODULO 1: MAESTROS Y ORGANIZACION
-- ==========================================================

CREATE TABLE IF NOT EXISTS departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cargos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nivel_salarial VARCHAR(50) -- Nivel o categoría salarial interna
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vinculamos la tabla de empleados con la de usuarios y maestros.
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ci_nit VARCHAR(20) NOT NULL UNIQUE, -- Documento de identidad
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('M', 'F', 'O') DEFAULT 'M',
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email_personal VARCHAR(100),
    email_corporativo VARCHAR(100),
    departamento_id INT,
    cargo_id INT,
    user_id INT UNIQUE, -- Vinculación directa con usuario de acceso
    estado ENUM('ACTIVO', 'INACTIVO', 'VACACIONES', 'LICENCIA') DEFAULT 'ACTIVO',
    fecha_ingreso DATE NOT NULL, -- Para calcular antigüedad automáticamente
    fecha_retiro DATE NULL, -- Fecha de desvinculación/retiro (NULL si activo)
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL,
    FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- MODULO 2: CONFIGURACION HISTORICA Y LABORAL
-- ==========================================================

-- Histórico de salarios y contratos de empleados
CREATE TABLE IF NOT EXISTS contratos_historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL, -- NULL si está vigente
    salario_base DECIMAL(12, 2) NOT NULL, -- El salario básico mensual pactado
    tipo_contrato ENUM('INDEFINIDO', 'FIJO', 'EVENTUAL', 'CONSULTORIA') DEFAULT 'INDEFINIDO',
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo de conceptos de pago (Bonos, Descuentos, Leyes)
CREATE TABLE IF NOT EXISTS conceptos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Ej: AFP Laboral, Bono Antigüedad, Horas Extras, RC-IVA
    tipo ENUM('INGRESO', 'EGRESO') NOT NULL, -- Si suma o resta al haber
    es_ley BOOLEAN DEFAULT FALSE, -- Si es un descuento/bono automático por ley
    es_fijo BOOLEAN DEFAULT FALSE, -- Si se calcula igual todos los meses o varía
    algoritmo_calculo VARCHAR(255), -- Fórmula o nota de cálculo
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Parámetros Globales (ej: Salario Mínimo, % AFP Laboral)
CREATE TABLE IF NOT EXISTS parametros_globales (
    clave VARCHAR(50) PRIMARY KEY, -- Ej: 'salario_minimo', 'afp_laboral_pct'
    valor DECIMAL(12, 4) NOT NULL,
    descripcion VARCHAR(255),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- MODULO 3: MOVIMIENTOS MENSUALES (Asistencia & Novedades)
-- ==========================================================

-- Variables de tiempo trabajadas por periodo
CREATE TABLE IF NOT EXISTS asistencia_mensual (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    periodo_mes INT NOT NULL, -- Ej: 1 para Enero
    periodo_anio INT NOT NULL, -- Ej: 2026
    dias_trabajados INT DEFAULT 30, -- Estándar 30 días comerciales
    horas_extras_diurnas DECIMAL(5, 2) DEFAULT 0,
    horas_extras_nocturnas DECIMAL(5, 2) DEFAULT 0,
    horas_feriado_domingo DECIMAL(5, 2) DEFAULT 0,
    faltas_dias INT DEFAULT 0,
    atrasos_minutos INT DEFAULT 0,
    UNIQUE KEY uq_asistencia (empleado_id, periodo_mes, periodo_anio),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bonos o descuentos únicos aplicados SOLO en un mes específico
CREATE TABLE IF NOT EXISTS novedades_mensuales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    concepto_pago_id INT NOT NULL,
    periodo_mes INT NOT NULL,
    periodo_anio INT NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    observacion VARCHAR(255),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (concepto_pago_id) REFERENCES conceptos_pago(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- MODULO 4: RESULTADO - BOLETAS Y PLANILLAS DE PAGO
-- ==========================================================

-- Cabecera: Resumen mensual de boleta
CREATE TABLE IF NOT EXISTS planilla_individual_cab (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    periodo_mes INT NOT NULL,
    periodo_anio INT NOT NULL,
    fecha_emision DATE NOT NULL,
    total_ganado DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Suma total de ingresos
    total_descuentos DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Suma total de egresos
    liquido_pagable DECIMAL(12, 2) NOT NULL DEFAULT 0, -- Ganado - Descuentos
    salario_base_snapshot DECIMAL(12, 2) NOT NULL, -- Salario base pactado en ese periodo
    asistencia_id INT NULL,
    estado ENUM('GENERADO', 'APROBADO', 'PAGADO', 'ANULADO') DEFAULT 'GENERADO',
    UNIQUE KEY uq_planilla_cab (empleado_id, periodo_mes, periodo_anio),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (asistencia_id) REFERENCES asistencia_mensual(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detalle: Desglose fila por fila de cada boleta
CREATE TABLE IF NOT EXISTS planilla_individual_det (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planilla_cab_id INT NOT NULL,
    concepto_pago_id INT NOT NULL,
    monto_calculado DECIMAL(12, 2) NOT NULL,
    observacion VARCHAR(255),
    FOREIGN KEY (planilla_cab_id) REFERENCES planilla_individual_cab(id) ON DELETE CASCADE,
    FOREIGN KEY (concepto_pago_id) REFERENCES conceptos_pago(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- DATOS INICIALES (SEEDERS)
-- ==========================================================

INSERT INTO roles (nombre, descripcion) VALUES 
('admin', 'Administrador Total del Sistema'),
('rrhh', 'Gestor de Recursos Humanos y Planillas'),
('empleado', 'Usuario final para consulta de boletas')
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

INSERT INTO conceptos_pago (nombre, tipo, es_ley, es_fijo, algoritmo_calculo) VALUES 
('Salario Base mensual', 'INGRESO', TRUE, TRUE, 'Tomar de contratos_historico'),
('Bono de Antigüedad', 'INGRESO', TRUE, TRUE, 'Cálculo sobre años de servicio y salario mínimo'),
('Horas Extras Diurnas', 'INGRESO', FALSE, FALSE, 'AsistenciaMensual.horas_extras * (SalarioHora * 2)'),
('Aporte Laboral AFP', 'EGRESO', TRUE, TRUE, 'TotalGanado * parametro.afp_laboral_pct'),
('Descuento por Faltas', 'EGRESO', FALSE, FALSE, 'Días de falta * Salario Diario')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

INSERT INTO parametros_globales (clave, valor, descripcion) VALUES 
('salario_minimo', 2500.00, 'Salario Mínimo Nacional vigente (Bs.)'),
('afp_laboral_pct', 0.1271, 'Aporte laboral obligatorio AFP (12.71%)'),
('dias_mes_laboral', 30.00, 'Días comerciales estándar para cálculo mensual')
ON DUPLICATE KEY UPDATE valor=VALUES(valor);