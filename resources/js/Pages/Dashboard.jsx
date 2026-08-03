import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard(props) {
    const { role, stats, ultimosEmpleados, planillasRecientes } = props;
    const { empleado, antiguedadDetalle, boletas, asistenciaActual, porcentajeAsistencia, resumenAnual, diasVacacionesEstimados } = props;

    const isEmpleadoRole = role === 'empleado';
    const [selectedAnioFilter, setSelectedAnioFilter] = useState(new Date().getFullYear());

    const filteredBoletas = isEmpleadoRole && boletas
        ? boletas.filter((b) => Number(b.periodo_anio) === Number(selectedAnioFilter))
        : [];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {isEmpleadoRole ? 'Portal del Trabajador' : 'Panel de Control Principal'}
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {isEmpleadoRole
                            ? `Bienvenido(a), ${empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado'} — Tropiflor A.G.`
                            : 'Gestión integral de boletas de pago, asistencias y personal agrícola'}
                    </p>
                </div>
            }
        >
            <Head title={isEmpleadoRole ? 'Mi Portal - Tropiflor A.G.' : 'Dashboard - Tropiflor A.G.'} />

            {/* ========================================== */}
            {/* PORTAL DEL EMPLEADO (Self-Service View)   */}
            {/* ========================================== */}
            {isEmpleadoRole ? (
                <div className="space-y-8">
                    {/* Header Banner Employee Profile */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center space-x-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xl border-2 border-orange-400/40">
                                    {empleado ? empleado.nombres[0].toUpperCase() : 'E'}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <h2 className="text-xl sm:text-2xl font-black text-white">
                                            {empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado Tropiflor'}
                                        </h2>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                                            {empleado?.estado || 'ACTIVO'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 mt-1 font-medium">
                                        {empleado?.cargo?.nombre || 'General'} • <span className="text-orange-400">{empleado?.departamento?.nombre || 'General'}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                        CI/NIT: {empleado?.ci_nit || 'N/A'} • Ingreso: {empleado?.fecha_ingreso || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tiempo en Empresa</span>
                                    <span className="text-orange-400 font-bold font-mono">{antiguedadDetalle}</span>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo Contrato</span>
                                    <span className="text-emerald-400 font-bold">{empleado?.contrato_vigente?.tipo_contrato || 'INDEFINIDO'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Card 1: Salario Base */}
                        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Salario Base Vigente</span>
                            <span className="text-2xl font-black text-white font-mono mt-1 block">
                                Bs. {empleado?.contrato_vigente ? Number(empleado.contrato_vigente.salario_base).toFixed(2) : '0.00'}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1 block">Sueldo pactado en contrato</span>
                        </div>

                        {/* Card 2: Puntualidad y Asistencia */}
                        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Asistencia Mes Actual</span>
                            <div className="flex items-baseline space-x-2 mt-1">
                                <span className="text-2xl font-black text-emerald-400 font-mono">
                                    {asistenciaActual ? `${asistenciaActual.dias_trabajados} Días` : '30 Días'}
                                </span>
                                <span className="text-xs font-bold text-emerald-500">({porcentajeAsistencia}%)</span>
                            </div>
                            <span className="text-[11px] text-slate-500 mt-1 block">
                                {asistenciaActual && (Number(asistenciaActual.horas_extras_diurnas) > 0 || Number(asistenciaActual.horas_extras_nocturnas) > 0)
                                    ? `+${Number(asistenciaActual.horas_extras_diurnas) + Number(asistenciaActual.horas_extras_nocturnas)}h extras acumuladas`
                                    : 'Registro de asistencia normal'}
                            </span>
                        </div>

                        {/* Card 3: Vacaciones Estimadas */}
                        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Vacaciones Acumuladas</span>
                            <span className="text-2xl font-black text-orange-400 font-mono mt-1 block">
                                {diasVacacionesEstimados} Días
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1 block">Estimado según Ley del Trabajo</span>
                        </div>

                        {/* Card 4: Acumulado Año */}
                        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cobrado este Año ({new Date().getFullYear()})</span>
                            <span className="text-2xl font-black text-teal-400 font-mono mt-1 block">
                                Bs. {resumenAnual.liquido_pagable_acumulado}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1 block">Líquido pagable acumulado</span>
                        </div>
                    </div>

                    {/* TWO-COLUMN LAYOUT: Personal Details & Current Attendance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Section: Ficha Personal */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                                    <span>📇</span>
                                    <span>Mi Ficha Laboral</span>
                                </h3>
                                <span className="text-xs text-orange-400 font-mono font-semibold">Tropiflor A.G.</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Nombres y Apellidos</span>
                                    <span className="font-bold text-white block mt-0.5">{empleado?.nombres} {empleado?.apellidos}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Carnet de Identidad</span>
                                    <span className="font-mono font-bold text-slate-200 block mt-0.5">{empleado?.ci_nit}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Teléfono de Contacto</span>
                                    <span className="font-medium text-slate-300 block mt-0.5">{empleado?.telefono || 'No registrado'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Correo Personal</span>
                                    <span className="font-medium text-slate-300 block mt-0.5">{empleado?.email_personal || 'No registrado'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Dirección Registrada</span>
                                    <span className="font-medium text-slate-300 block mt-0.5">{empleado?.direccion || 'No registrada'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section: Asistencia Mensual Detalle */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                                    <span>⏱️</span>
                                    <span>Mi Asistencia & Horas Extras</span>
                                </h3>
                                <span className="text-xs text-emerald-400 font-mono font-semibold">
                                    Mes {String(new Date().getMonth() + 1).padStart(2, '0')}/{new Date().getFullYear()}
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-white block">Días Trabajados en el Mes</span>
                                        <span className="text-[11px] text-slate-400">Registrado por RRHH</span>
                                    </div>
                                    <span className="text-base font-black text-emerald-400 font-mono">
                                        {asistenciaActual ? asistenciaActual.dias_trabajados : 30} / 30 Días
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-white block">Horas Extras Diurnas</span>
                                        <span className="text-[11px] text-slate-400">Recargo del 100% sobre hora base</span>
                                    </div>
                                    <span className="text-sm font-bold text-orange-400 font-mono">
                                        {asistenciaActual ? Number(asistenciaActual.horas_extras_diurnas).toFixed(1) : '0.0'} Horas
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-white block">Horas Extras Nocturnas</span>
                                        <span className="text-[11px] text-slate-400">Recargo especial nocturno</span>
                                    </div>
                                    <span className="text-sm font-bold text-amber-400 font-mono">
                                        {asistenciaActual ? Number(asistenciaActual.horas_extras_nocturnas).toFixed(1) : '0.0'} Horas
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-white block">Faltas Registradas</span>
                                        <span className="text-[11px] text-slate-400">Días no justificados</span>
                                    </div>
                                    <span className={`text-sm font-bold font-mono ${asistenciaActual && asistenciaActual.faltas_dias > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                                        {asistenciaActual ? asistenciaActual.faltas_dias : 0} Días
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: MIS BOLETAS DE PAGO (Histórico de recibos) */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                                    <span>📄</span>
                                    <span>Mis Boletas de Pago (Histórico)</span>
                                </h3>
                                <p className="text-xs text-slate-400">Consulta e imprime tus recibos oficiales de pago en formato Carta</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-xs text-slate-400">Filtrar Gestión:</span>
                                <select
                                    value={selectedAnioFilter}
                                    onChange={(e) => setSelectedAnioFilter(e.target.value)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                                >
                                    {[2024, 2025, 2026, 2027].map((a) => (
                                        <option key={a} value={a}>Gestión {a}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4">Periodo</th>
                                        <th className="px-6 py-4">Salario Base</th>
                                        <th className="px-6 py-4">Total Ganado</th>
                                        <th className="px-6 py-4">Descuentos</th>
                                        <th className="px-6 py-4">Líquido Pagable</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium">
                                    {filteredBoletas.length > 0 ? (
                                        filteredBoletas.map((b) => (
                                            <tr key={b.id} className="hover:bg-slate-800/40 transition">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-white block">
                                                        Mes {String(b.periodo_mes).padStart(2, '0')} / {b.periodo_anio}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        Emisión: {b.fecha_emision ? new Date(b.fecha_emision).toLocaleDateString('es-BO') : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                                                    Bs. {Number(b.salario_base_snapshot).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                                                    Bs. {Number(b.total_ganado).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-mono font-semibold text-rose-400">
                                                    Bs. {Number(b.total_descuentos).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-mono font-black text-emerald-400 text-sm">
                                                    Bs. {Number(b.liquido_pagable).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        b.estado === 'PAGADO'
                                                            ? 'bg-emerald-500/20 text-emerald-300'
                                                            : b.estado === 'APROBADO'
                                                            ? 'bg-blue-500/20 text-blue-300'
                                                            : 'bg-amber-500/20 text-amber-300'
                                                    }`}>
                                                        {b.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route('admin.planillas.show', b.id)}
                                                        className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow transition inline-flex items-center space-x-1"
                                                    >
                                                        <span>👁️ Ver / Imprimir Boleta</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-12 text-slate-500">
                                                No tienes boletas registradas para la gestión {selectedAnioFilter}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* ========================================== */
                /* ADMIN & RRHH EXECUTIVE DASHBOARD           */
                /* ========================================== */
                <div className="space-y-8">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Empleados</span>
                                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-lg">👥</div>
                            </div>
                            <span className="text-3xl font-black text-white font-mono mt-3 block">{stats?.totalEmpleados || 0}</span>
                            <span className="text-xs text-emerald-400 font-semibold mt-2 block">
                                {stats?.empleadosActivos || 0} Personal Activo
                            </span>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nómina del Mes ({stats?.periodoActual})</span>
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">💰</div>
                            </div>
                            <span className="text-3xl font-black text-emerald-400 font-mono mt-3 block">Bs. {stats?.montoTotalNominaMes || '0.00'}</span>
                            <span className="text-xs text-slate-400 font-semibold mt-2 block">Líquido pagable procesado</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Boletas Generadas</span>
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">📄</div>
                            </div>
                            <span className="text-3xl font-black text-white font-mono mt-3 block">{stats?.totalPlanillasGeneradas || 0}</span>
                            <span className="text-xs text-slate-400 font-semibold mt-2 block">Boletas periodo actual</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estructura Organizacional</span>
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">🏢</div>
                            </div>
                            <span className="text-3xl font-black text-white font-mono mt-3 block">{stats?.totalDepartamentos || 0}</span>
                            <span className="text-xs text-slate-400 font-semibold mt-2 block">Departamentos y {stats?.totalCargos || 0} Cargos</span>
                        </div>
                    </div>

                    {/* Quick Action Navigation Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Link
                            href={route('admin.empleados.index')}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-center transition group"
                        >
                            <span className="text-2xl block mb-1 group-hover:scale-110 transition">👥</span>
                            <span className="text-xs font-bold text-white block">Gestión Empleados</span>
                        </Link>
                        <Link
                            href={route('admin.planillas.index')}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-center transition group"
                        >
                            <span className="text-2xl block mb-1 group-hover:scale-110 transition">🧮</span>
                            <span className="text-xs font-bold text-white block">Generar Planillas</span>
                        </Link>
                        <Link
                            href={route('admin.asistencias.index')}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-center transition group"
                        >
                            <span className="text-2xl block mb-1 group-hover:scale-110 transition">📅</span>
                            <span className="text-xs font-bold text-white block">Asistencia & Extras</span>
                        </Link>
                        <Link
                            href={route('admin.conceptos.index')}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-center transition group"
                        >
                            <span className="text-2xl block mb-1 group-hover:scale-110 transition">⚙️</span>
                            <span className="text-xs font-bold text-white block">Conceptos & Leyes</span>
                        </Link>
                    </div>

                    {/* Recent Employees Table */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">Últimos Empleados Registrados</h3>
                                <p className="text-xs text-slate-400">Personal recientemente incorporado a Tropiflor A.G.</p>
                            </div>
                            <Link href={route('admin.empleados.index')} className="text-xs font-bold text-orange-400 hover:underline">
                                Ver Todos →
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4">Empleado</th>
                                        <th className="px-6 py-4">CI / NIT</th>
                                        <th className="px-6 py-4">Departamento / Cargo</th>
                                        <th className="px-6 py-4">Ingreso</th>
                                        <th className="px-6 py-4 text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium">
                                    {ultimosEmpleados && ultimosEmpleados.length > 0 ? (
                                        ultimosEmpleados.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                                                <td className="px-6 py-4 flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                                                        {emp.nombres[0]}
                                                    </div>
                                                    <span className="font-bold text-white">{emp.nombres} {emp.apellidos}</span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-200">{emp.ci_nit}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-200 font-semibold block">{emp.departamento?.nombre || 'General'}</span>
                                                    <span className="text-slate-400 text-[11px]">{emp.cargo?.nombre || 'General'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-300">{emp.fecha_ingreso}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                                                        {emp.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6 text-slate-500">No hay empleados registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
