import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function UsuariosIndex({ usuarios, roles, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [roleIdFilter, setRoleIdFilter] = useState(filters.role_id || '');

    const { data, setData, post, put, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: roles[0]?.id || '',
        active: true,
    });

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (u) => {
        setEditingUser(u);
        setData({
            name: u.name,
            email: u.email,
            password: '',
            role_id: u.role_id,
            active: u.active,
        });
        setShowModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.usuarios.index'), { search, role_id: roleIdFilter }, { preserveState: true });
    };

    const handleToggleState = (u) => {
        if (confirm(`¿Deseas ${u.active ? 'desactivar' : 'activar'} el acceso al usuario "${u.name}"?`)) {
            router.patch(route('admin.usuarios.toggle', u.id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.usuarios.update', editingUser.id), {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post(route('admin.usuarios.store'), {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Usuarios del Sistema</h1>
                        <p className="text-sm text-slate-400 mt-1">Control de acceso, asignación de roles y estados de cuenta (Exclusivo Admin)</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center space-x-2 w-fit"
                    >
                        <span>👤 Registrar Nuevo Usuario</span>
                    </button>
                </div>
            }
        >
            <Head title="Gestión de Usuarios - Tropiflor A.G." />

            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-2 w-full md:w-auto flex-1 items-center">
                        <input
                            type="text"
                            placeholder="Buscar por Nombre o Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs w-full sm:w-64 focus:outline-none focus:border-orange-500"
                        />
                        <select
                            value={roleIdFilter}
                            onChange={(e) => setRoleIdFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        >
                            <option value="">Todos los Roles</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.nombre.toUpperCase()}</option>
                            ))}
                        </select>
                        <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold">
                            Buscar
                        </button>
                    </form>
                    <span className="text-xs text-slate-400 font-mono">{usuarios.total || usuarios.data.length} Usuarios Registrados</span>
                </div>

                {/* Usuarios Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Correo Electrónico (Login)</th>
                                    <th className="px-6 py-4">Rol Asignado</th>
                                    <th className="px-6 py-4">Perfil Vinculado</th>
                                    <th className="px-6 py-4">Estado Cuenta</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                                {usuarios.data.length > 0 ? (
                                    usuarios.data.map((u) => {
                                        const rName = u.role?.nombre ? u.role.nombre.toLowerCase() : 'empleado';
                                        return (
                                            <tr key={u.id} className="hover:bg-slate-800/40 transition">
                                                <td className="px-6 py-4 flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                                                        {u.name ? u.name[0].toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-white block">{u.name}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono">ID: #{u.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-200">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                        rName === 'admin'
                                                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                                            : rName === 'rrhh'
                                                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                                                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                                    }`}>
                                                        {u.role?.nombre || 'Empleado'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.empleado ? (
                                                        <div>
                                                            <span className="text-emerald-400 font-semibold block">{u.empleado.cargo?.nombre || 'Empleado'}</span>
                                                            <span className="text-slate-400 text-[10px]">{u.empleado.departamento?.nombre || 'General'}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-500 text-[11px]">Usuario de Sistema</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        u.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                                    }`}>
                                                        {u.active ? 'ACTIVO' : 'INACTIVO'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(u)}
                                                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleState(u)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                                            u.active
                                                                ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60'
                                                                : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
                                                        }`}
                                                    >
                                                        {u.active ? '🔒 Desactivar' : '🔓 Activar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-slate-500">
                                            No se encontraron usuarios registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-bold text-white">
                                {editingUser ? 'Editar Usuario de Sistema' : 'Registrar Nuevo Usuario'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Pedro Morales"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-orange-500"
                                    required
                                />
                                {errors.name && <span className="text-rose-400">{errors.name}</span>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico (Login) *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="usuario@tropiflor.com"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-orange-500"
                                    required
                                />
                                {errors.email && <span className="text-rose-400">{errors.email}</span>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Rol Asignado *</label>
                                <select
                                    value={data.role_id}
                                    onChange={(e) => setData('role_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-orange-500"
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nombre.toUpperCase()} — {r.descripcion}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && <span className="text-rose-400">{errors.role_id}</span>}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">
                                    {editingUser ? 'Nueva Contraseña (Opcional, dejar vacío si no cambia)' : 'Contraseña de Acceso *'}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-orange-500 font-mono"
                                    required={!editingUser}
                                />
                                {errors.password && <span className="text-rose-400">{errors.password}</span>}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.active}
                                        onChange={(e) => setData('active', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-slate-300 font-semibold">Cuenta Activa (Permite Iniciar Sesión)</span>
                                </label>
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
                                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold shadow-lg"
                                >
                                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
