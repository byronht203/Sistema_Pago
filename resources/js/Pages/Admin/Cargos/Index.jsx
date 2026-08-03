import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CargosIndex({ cargos }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCargo, setEditingCargo] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombre: '',
        nivel_salarial: '',
    });

    const openCreateModal = () => {
        setEditingCargo(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (cargo) => {
        setEditingCargo(cargo);
        setData({
            nombre: cargo.nombre,
            nivel_salarial: cargo.nivel_salarial || '',
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCargo) {
            put(route('admin.cargos.update', editingCargo.id), {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post(route('admin.cargos.store'), {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Está seguro de eliminar este cargo?')) {
            destroy(route('admin.cargos.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Catálogo de Cargos y Puestos</h1>
                        <p className="text-sm text-slate-400 mt-1">Estructura jerárquica y niveles salariales de la empresa</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center space-x-2 w-fit"
                    >
                        <span>💼 Nuevo Cargo</span>
                    </button>
                </div>
            }
        >
            <Head title="Cargos - AgroEcoPay" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cargos.map((c) => (
                    <div key={c.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 text-lg">💼</span>
                                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                                    {c.empleados_count || 0} Asignados
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{c.nombre}</h3>
                            <span className="inline-block px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono font-medium">
                                {c.nivel_salarial || 'Sin nivel especificado'}
                            </span>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800/80">
                            <button
                                onClick={() => openEditModal(c)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                            >
                                ✏️ Editar
                            </button>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-bold text-white">
                                {editingCargo ? 'Editar Cargo' : 'Nuevo Cargo'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Nombre del Cargo *</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Supervisor de Campo / Operador Maquinaria"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    required
                                />
                                {errors.nombre && <span className="text-rose-400">{errors.nombre}</span>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Nivel Salarial / Categoría</label>
                                <input
                                    type="text"
                                    value={data.nivel_salarial}
                                    onChange={(e) => setData('nivel_salarial', e.target.value)}
                                    placeholder="Ej: Nivel 2 - Profesional / Operativo"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
