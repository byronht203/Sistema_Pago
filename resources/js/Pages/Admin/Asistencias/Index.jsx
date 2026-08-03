import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function AsistenciasIndex({ empleados, selectedMes, selectedAnio }) {
    const [mes, setMes] = useState(selectedMes);
    const [anio, setAnio] = useState(selectedAnio);
    const [selectedEmp, setSelectedEmp] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        empleado_id: '',
        periodo_mes: selectedMes,
        periodo_anio: selectedAnio,
        dias_trabajados: 30,
        horas_extras_diurnas: 0,
        horas_extras_nocturnas: 0,
        horas_feriado_domingo: 0,
        faltas_dias: 0,
        atrasos_minutos: 0,
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.asistencias.index'), { mes, anio }, { preserveState: true });
    };

    const openFormForEmp = (emp) => {
        setSelectedEmp(emp);
        const asis = emp.asistencias && emp.asistencias.length > 0 ? emp.asistencias[0] : null;

        setData({
            empleado_id: emp.id,
            periodo_mes: mes,
            periodo_anio: anio,
            dias_trabajados: asis ? asis.dias_trabajados : 30,
            horas_extras_diurnas: asis ? asis.horas_extras_diurnas : 0,
            horas_extras_nocturnas: asis ? asis.horas_extras_nocturnas : 0,
            horas_feriado_domingo: asis ? asis.horas_feriado_domingo : 0,
            faltas_dias: asis ? asis.faltas_dias : 0,
            atrasos_minutos: asis ? asis.atrasos_minutos : 0,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.asistencias.store'), {
            onSuccess: () => setSelectedEmp(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Registro de Asistencia Mensual & Horas Extras</h1>
                        <p className="text-sm text-slate-400 mt-1">Variables de tiempo laborado para el cálculo de planilla</p>
                    </div>
                </div>
            }
        >
            <Head title="Asistencia Mensual - AgroEcoPay" />

            <div className="space-y-6">
                {/* Period Selector Bar */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleFilter} className="flex items-center space-x-3 w-full md:w-auto">
                        <span className="text-xs font-semibold text-slate-300">Periodo:</span>
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
                        <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                            Cargar Periodo
                        </button>
                    </form>
                    <span className="text-xs text-slate-400 font-mono">Mostrando asistencia para {String(mes).padStart(2, '0')}/{anio}</span>
                </div>

                {/* Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Empleado</th>
                                    <th className="px-6 py-4">Departamento</th>
                                    <th className="px-6 py-4">Días Trab.</th>
                                    <th className="px-6 py-4">Hs. Extras Diurnas</th>
                                    <th className="px-6 py-4">Hs. Extras Noct.</th>
                                    <th className="px-6 py-4">Faltas (Días)</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                                {empleados.map((emp) => {
                                    const asis = emp.asistencias && emp.asistencias.length > 0 ? emp.asistencias[0] : null;
                                    return (
                                        <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-white block">{emp.nombres} {emp.apellidos}</span>
                                                <span className="text-[11px] text-slate-400 font-mono">CI: {emp.ci_nit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-semibold">{emp.departamento?.nombre || 'General'}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                                                {asis ? asis.dias_trabajados : 30} días
                                            </td>
                                            <td className="px-6 py-4 font-mono">{asis ? asis.horas_extras_diurnas : 0} hrs</td>
                                            <td className="px-6 py-4 font-mono">{asis ? asis.horas_extras_nocturnas : 0} hrs</td>
                                            <td className="px-6 py-4 font-mono text-rose-400">{asis ? asis.faltas_dias : 0} días</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openFormForEmp(emp)}
                                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-300 text-xs font-bold transition"
                                                >
                                                    📝 Cargar / Editar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form for Attendance */}
            {selectedEmp && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Registro de Asistencia</h3>
                                <p className="text-xs text-emerald-400 font-medium">{selectedEmp.nombres} {selectedEmp.apellidos} ({String(mes).padStart(2, '0')}/{anio})</p>
                            </div>
                            <button onClick={() => setSelectedEmp(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Días Trabajados *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="31"
                                        value={data.dias_trabajados}
                                        onChange={(e) => setData('dias_trabajados', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Faltas (Días) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.faltas_dias}
                                        onChange={(e) => setData('faltas_dias', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-bold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Horas Extras Diurnas</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={data.horas_extras_diurnas}
                                        onChange={(e) => setData('horas_extras_diurnas', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Horas Extras Nocturnas</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={data.horas_extras_nocturnas}
                                        onChange={(e) => setData('horas_extras_nocturnas', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setSelectedEmp(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg"
                                >
                                    Guardar Asistencia
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
