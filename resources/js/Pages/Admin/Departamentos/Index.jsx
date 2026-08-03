import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function DepartamentosIndex({ departamentos }) {
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
    });

    const openCreateModal = () => {
        setEditingDept(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (dept) => {
        setEditingDept(dept);
        setData({
            nombre: dept.nombre,
            descripcion: dept.descripcion || '',
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingDept) {
            put(route('admin.departamentos.update', editingDept.id), {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post(route('admin.departamentos.store'), {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Está seguro de eliminar este departamento?')) {
            destroy(route('admin.departamentos.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Departamentos Organizacionales</h1>
                        <p className="text-sm text-slate-400 mt-1">Áreas operativas agrícolas, bio-reciclaje y administración</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center space-x-2 w-fit"
                    >
                        <span>🏢 Nuevo Departamento</span>
                    </button>
                </div>
            }
        >
            <Head title="Departamentos - AgroEcoPay" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departamentos.map((d) => (
                    <div key={d.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-lg">🏢</span>
                                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                                    {d.empleados_count || 0} Empleados
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{d.nombre}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{d.descripcion || 'Sin descripción asignada.'}</p>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800/80">
                            <button
                                onClick={() => openEditModal(d)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                            >
                                ✏️ Editar
                            </button>
                            <button
                                onClick={() => handleDelete(d.id)}
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
                                {editingDept ? 'Editar Departamento' : 'Nuevo Departamento'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Nombre del Departamento *</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Planta de Reciclaje Bio-Orgánico"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    required
                                />
                                {errors.nombre && <span className="text-rose-400">{errors.nombre}</span>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Descripción</label>
                                <textarea
                                    rows="3"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Detalles del área u operaciones..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                ></textarea>
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
