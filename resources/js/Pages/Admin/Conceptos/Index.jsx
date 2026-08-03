import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConceptosIndex({ conceptos, parametros }) {
    const [showConceptoModal, setShowConceptoModal] = useState(false);
    const [editingConcepto, setEditingConcepto] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        tipo: 'INGRESO',
        es_ley: false,
        es_fijo: false,
        algoritmo_calculo: '',
        activo: true,
    });

    const openCreateModal = () => {
        setEditingConcepto(null);
        reset();
        setShowConceptoModal(true);
    };

    const openEditModal = (c) => {
        setEditingConcepto(c);
        setData({
            nombre: c.nombre,
            tipo: c.tipo,
            es_ley: c.es_ley,
            es_fijo: c.es_fijo,
            algoritmo_calculo: c.algoritmo_calculo || '',
            activo: c.activo,
        });
        setShowConceptoModal(true);
    };

    const submitConcepto = (e) => {
        e.preventDefault();
        if (editingConcepto) {
            put(route('admin.conceptos.update', editingConcepto.id), {
                onSuccess: () => setShowConceptoModal(false)
            });
        } else {
            post(route('admin.conceptos.store'), {
                onSuccess: () => setShowConceptoModal(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Conceptos de Pago & Parámetros Globales</h1>
                        <p className="text-sm text-slate-400 mt-1">Configuración de ingresos, egresos, retenciones de ley y salario mínimo</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center space-x-2 w-fit"
                    >
                        <span>⚙️ Nuevo Concepto</span>
                    </button>
                </div>
            }
        >
            <Head title="Conceptos & Leyes - AgroEcoPay" />

            <div className="space-y-8">
                {/* Global Parameters Section */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Parámetros Globales de Nómina</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Valores oficiales de ley para el cálculo automático</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {parametros.map((p) => (
                            <ParametroItem key={p.clave} parametro={p} />
                        ))}
                    </div>
                </div>

                {/* Conceptos Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl space-y-6 p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Catálogo de Conceptos Salariales</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Rubros que forman parte de la boleta de pago</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Concepto</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">De Ley</th>
                                    <th className="px-6 py-4">Modo</th>
                                    <th className="px-6 py-4">Algoritmo / Regla</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                                {conceptos.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                                        <td className="px-6 py-4 font-bold text-white text-sm">{c.nombre}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                c.tipo === 'INGRESO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                            }`}>
                                                {c.tipo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.es_ley ? (
                                                <span className="text-emerald-400 font-semibold">Si (Ley)</span>
                                            ) : (
                                                <span className="text-slate-500">No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {c.es_fijo ? 'Fijo Mensual' : 'Variable'}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                                            {c.algoritmo_calculo || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEditModal(c)}
                                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-300 text-xs font-bold transition"
                                            >
                                                ✏️ Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Concepto */}
            {showConceptoModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-bold text-white">
                                {editingConcepto ? 'Editar Concepto de Pago' : 'Nuevo Concepto de Pago'}
                            </h3>
                            <button onClick={() => setShowConceptoModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submitConcepto} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Nombre del Concepto *</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Bono de Producción Agrícola"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Tipo de Movimiento *</label>
                                <select
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                >
                                    <option value="INGRESO">INGRESO (Suma al Ganado)</option>
                                    <option value="EGRESO">EGRESO (Resta al Ganado / Descuento)</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-4 pt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.es_ley}
                                        onChange={(e) => setData('es_ley', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-950 text-emerald-500"
                                    />
                                    <span className="text-slate-300">Es de Ley</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.es_fijo}
                                        onChange={(e) => setData('es_fijo', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-950 text-emerald-500"
                                    />
                                    <span className="text-slate-300">Es Fijo Mensual</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Algoritmo / Nota de Cálculo</label>
                                <input
                                    type="text"
                                    value={data.algoritmo_calculo}
                                    onChange={(e) => setData('algoritmo_calculo', e.target.value)}
                                    placeholder="Ej: TotalGanado * 0.1271"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowConceptoModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function ParametroItem({ parametro }) {
    const { data, setData, put, processing } = useForm({
        valor: parametro.valor,
        descripcion: parametro.descripcion || '',
    });

    const submitParam = (e) => {
        e.preventDefault();
        put(route('admin.parametros.update', parametro.clave));
    };

    return (
        <form onSubmit={submitParam} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                {parametro.clave}
            </span>
            <div>
                <input
                    type="number"
                    step="0.0001"
                    value={data.valor}
                    onChange={(e) => setData('valor', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold font-mono focus:border-emerald-500 text-sm"
                />
            </div>
            <p className="text-[11px] text-slate-400">{parametro.descripcion}</p>
            <button
                type="submit"
                disabled={processing}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-300 text-xs font-bold transition"
            >
                Actualizar Valor
            </button>
        </form>
    );
}
