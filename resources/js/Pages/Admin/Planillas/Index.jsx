import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function PlanillasIndex({ planillas = [], selectedMes, selectedAnio, totales = {}, empleadosActivos, isEmpleado = false }) {
    const [mes, setMes] = useState(selectedMes || new Date().getMonth() + 1);
    const [anio, setAnio] = useState(selectedAnio || new Date().getFullYear());

    const { post, processing } = useForm({
        periodo_mes: mes,
        periodo_anio: anio,
    });

    const safePlanillasList = Array.isArray(planillas) ? planillas : (planillas?.data || []);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.planillas.index'), { mes, anio }, { preserveState: true });
    };

    const handleGenerarPlanilla = () => {
        if (confirm(`¿Desea calcular y generar automáticamente las boletas de pago para Tropiflor A.G. periodo ${String(mes).padStart(2, '0')}/${anio}?`)) {
            router.post(route('admin.planillas.generar'), { periodo_mes: mes, periodo_anio: anio });
        }
    };

    const handleExportExcel = () => {
        window.location.href = route('admin.planillas.exportar', { mes, anio });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {isEmpleado ? 'Mis Boletas de Pago' : 'Gestión y Generación de Planillas'}
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            {isEmpleado
                                ? 'Consulta e imprime tus recibos oficiales de pago en Tropiflor A.G.'
                                : 'Nómina salarial y emisión de recibos en Tropiflor A.G.'}
                        </p>
                    </div>
                    {!isEmpleado && (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleGenerarPlanilla}
                                disabled={processing}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-950/60 transition flex items-center space-x-2 disabled:opacity-50"
                            >
                                <span>⚡ Calcular & Generar Planilla</span>
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={isEmpleado ? 'Mis Boletas - Tropiflor A.G.' : 'Planillas & Boletas - Tropiflor A.G.'} />

            <div className="space-y-6">
                {/* Period & Filter bar (for Admin/RRHH) */}
                {!isEmpleado && (
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <form onSubmit={handleFilter} className="flex items-center space-x-3 w-full md:w-auto">
                            <span className="text-xs font-semibold text-slate-300">Periodo a consultar:</span>
                            <select
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>Mes {String(m).padStart(2, '0')}</option>
                                ))}
                            </select>
                            <select
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                            >
                                {[2024, 2025, 2026, 2027].map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                            <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs">
                                Filtrar
                            </button>
                        </form>

                        <div className="text-xs text-slate-400 font-mono">
                            Periodo Seleccionado: <span className="text-orange-400 font-bold">{String(mes).padStart(2, '0')}/{anio}</span>
                        </div>
                    </div>
                )}

                {/* Summary Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            {isEmpleado ? 'Mi Salario Ganado (Total)' : 'Total Ganado (Bruto)'}
                        </span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">
                            Bs. {totales.total_ganado || '0.00'}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                            {isEmpleado ? 'Suma de haberes en Tropiflor A.G.' : 'Suma de salarios + bonos Tropiflor A.G.'}
                        </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            {isEmpleado ? 'Mis Retenciones (Descuentos)' : 'Total Descuentos (Retenciones)'}
                        </span>
                        <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                            Bs. {totales.total_descuentos || '0.00'}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1 block">Aportes ley AFP + Deducciones</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            {isEmpleado ? 'Mi Líquido Pagable Neto' : 'Líquido Pagable Neto'}
                        </span>
                        <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                            Bs. {totales.liquido_pagable || '0.00'}
                        </span>
                        <span className="text-[11px] text-emerald-500/80 mt-1 block">
                            {totales.total_boletas || safePlanillasList.length} Recibos Emitidos
                        </span>
                    </div>
                </div>

                {/* Planillas Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {isEmpleado ? 'Historial de Mis Boletas de Pago' : `Boletas de Pago Emitidas (${String(mes).padStart(2, '0')}/${anio})`}
                            </h3>
                            <p className="text-xs text-slate-400">Tropiflor A.G. — Empresa Agrícola</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {!isEmpleado && (
                                <button
                                    onClick={handleExportExcel}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-800/40 text-xs font-semibold transition flex items-center space-x-1"
                                >
                                    <span>📊 Descargar Excel</span>
                                </button>
                            )}
                            <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold">
                                {safePlanillasList.length} Registros
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Periodo / Empleado</th>
                                    <th className="px-6 py-4">Departamento / Cargo</th>
                                    <th className="px-6 py-4">Total Ganado</th>
                                    <th className="px-6 py-4">Descuentos</th>
                                    <th className="px-6 py-4">Líquido Pagable</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                                {safePlanillasList.length > 0 ? (
                                    safePlanillasList.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-800/40 transition">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-white block">
                                                    Periodo {String(p.periodo_mes).padStart(2, '0')}/{p.periodo_anio}
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {p.empleado?.nombres} {p.empleado?.apellidos} (CI: {p.empleado?.ci_nit})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-200 font-semibold block">{p.empleado?.departamento?.nombre || 'General'}</span>
                                                <span className="text-slate-400 text-[11px]">{p.empleado?.cargo?.nombre || 'General'}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                                                Bs. {Number(p.total_ganado).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-semibold text-rose-400">
                                                Bs. {Number(p.total_descuentos).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-black text-emerald-400 text-sm">
                                                Bs. {Number(p.liquido_pagable).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    p.estado === 'PAGADO'
                                                        ? 'bg-emerald-500/20 text-emerald-300'
                                                        : p.estado === 'APROBADO'
                                                        ? 'bg-blue-500/20 text-blue-300'
                                                        : 'bg-amber-500/20 text-amber-300'
                                                }`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('admin.planillas.show', p.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition inline-flex items-center space-x-1 shadow"
                                                >
                                                    <span>👁️ Ver / Imprimir Boleta</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-slate-500">
                                            No se han encontrado boletas de pago registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
