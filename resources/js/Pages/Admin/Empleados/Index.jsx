import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function EmpleadosIndex({ empleados, departamentos, cargos, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        ci_nit: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        genero: 'M',
        direccion: '',
        telefono: '',
        email_personal: '',
        email_corporativo: '',
        departamento_id: departamentos[0]?.id || '',
        cargo_id: cargos[0]?.id || '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        fecha_retiro: '',
        salario_base: '2500.00',
        tipo_contrato: 'INDEFINIDO',
        password: 'password123',
        estado: 'ACTIVO',
    });

    const openCreateModal = () => {
        setEditingEmpleado(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (emp) => {
        setEditingEmpleado(emp);
        setData({
            ci_nit: emp.ci_nit,
            nombres: emp.nombres,
            apellidos: emp.apellidos,
            fecha_nacimiento: emp.fecha_nacimiento,
            genero: emp.genero,
            direccion: emp.direccion || '',
            telefono: emp.telefono || '',
            email_personal: emp.email_personal || '',
            email_corporativo: emp.email_corporativo,
            departamento_id: emp.departamento_id,
            cargo_id: emp.cargo_id,
            fecha_ingreso: emp.fecha_ingreso,
            fecha_retiro: emp.fecha_retiro || '',
            salario_base: emp.contrato_vigente ? emp.contrato_vigente.salario_base : '2500.00',
            tipo_contrato: emp.contrato_vigente ? emp.contrato_vigente.tipo_contrato : 'INDEFINIDO',
            estado: emp.estado,
        });
        setShowModal(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.empleados.index'), { search }, { preserveState: true });
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingEmpleado) {
            put(route('admin.empleados.update', editingEmpleado.id), {
                onSuccess: () => setShowModal(false)
            });
        } else {
            post(route('admin.empleados.store'), {
                onSuccess: () => setShowModal(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Empleados</h1>
                        <p className="text-sm text-slate-400 mt-1">Directorio de personal agrícola, técnico y administrativo</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center space-x-2 w-fit"
                    >
                        <span>➕ Registrar Empleado</span>
                    </button>
                </div>
            }
        >
            <Head title="Empleados - AgroEcoPay" />

            <div className="space-y-6">
                {/* Search Bar */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por Nombre, CI/NIT, Teléfono o Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs w-full focus:outline-none focus:border-emerald-500"
                        />
                        <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold">
                            Buscar
                        </button>
                    </form>
                    <span className="text-xs text-slate-400 font-mono">{empleados.total || empleados.data.length} Empleados Encontrados</span>
                </div>

                {/* Empleados Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">CI / NIT</th>
                                    <th className="px-6 py-4">Empleado</th>
                                    <th className="px-6 py-4">Contacto / Dirección</th>
                                    <th className="px-6 py-4">Departamento / Cargo</th>
                                    <th className="px-6 py-4">Salario Base</th>
                                    <th className="px-6 py-4">Tipo Contrato</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                                {empleados.data.length > 0 ? (
                                    empleados.data.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                                            <td className="px-6 py-4 font-mono text-emerald-400 font-bold">{emp.ci_nit}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-white block">{emp.nombres} {emp.apellidos}</span>
                                                <span className="text-[11px] text-slate-400">{emp.email_corporativo}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-300 font-semibold block">{emp.telefono || 'Sin teléfono'}</span>
                                                <span className="text-slate-400 text-[11px] block">{emp.direccion || 'Sin dirección'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-200 font-semibold block">{emp.departamento?.nombre || 'S/D'}</span>
                                                <span className="text-slate-400 text-[11px]">{emp.cargo?.nombre || 'S/C'}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-white">
                                                Bs. {emp.contrato_vigente ? Number(emp.contrato_vigente.salario_base).toFixed(2) : '0.00'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-mono text-[11px]">
                                                {emp.contrato_vigente?.tipo_contrato || 'INDEFINIDO'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    emp.estado === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                                }`}>
                                                    {emp.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openEditModal(emp)}
                                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-300 text-xs font-bold transition"
                                                >
                                                    ✏️ Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8 text-slate-500">
                                            No se encontraron empleados registrados.
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
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-bold text-white">
                                {editingEmpleado ? 'Editar Ficha de Empleado' : 'Registrar Nuevo Empleado'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">CI / NIT *</label>
                                    <input
                                        type="text"
                                        value={data.ci_nit}
                                        onChange={(e) => setData('ci_nit', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 font-mono"
                                        required
                                    />
                                    {errors.ci_nit && <span className="text-rose-400">{errors.ci_nit}</span>}
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Nombres *</label>
                                    <input
                                        type="text"
                                        value={data.nombres}
                                        onChange={(e) => setData('nombres', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Apellidos *</label>
                                    <input
                                        type="text"
                                        value={data.apellidos}
                                        onChange={(e) => setData('apellidos', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Email Corporativo (Login) *</label>
                                    <input
                                        type="email"
                                        value={data.email_corporativo}
                                        onChange={(e) => setData('email_corporativo', e.target.value)}
                                        disabled={!!editingEmpleado}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 disabled:opacity-50"
                                        required
                                    />
                                    {errors.email_corporativo && <span className="text-rose-400">{errors.email_corporativo}</span>}
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Email Personal</label>
                                    <input
                                        type="email"
                                        value={data.email_personal}
                                        onChange={(e) => setData('email_personal', e.target.value)}
                                        placeholder="personal@gmail.com"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Teléfono / Celular</label>
                                    <input
                                        type="text"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="76543210"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 font-mono"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-slate-300 font-semibold mb-1">Dirección de Domicilio</label>
                                    <input
                                        type="text"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        placeholder="Av. Ecológica #123, Zona Norte"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Género</label>
                                    <select
                                        value={data.genero}
                                        onChange={(e) => setData('genero', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="O">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Departamento *</label>
                                    <select
                                        value={data.departamento_id}
                                        onChange={(e) => setData('departamento_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    >
                                        {departamentos.map((d) => (
                                            <option key={d.id} value={d.id}>{d.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Cargo *</label>
                                    <select
                                        value={data.cargo_id}
                                        onChange={(e) => setData('cargo_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    >
                                        {cargos.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Salario Base (Bs.) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.salario_base}
                                        onChange={(e) => setData('salario_base', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold focus:border-emerald-500 font-mono text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Tipo de Contrato *</label>
                                    <select
                                        value={data.tipo_contrato}
                                        onChange={(e) => setData('tipo_contrato', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    >
                                        <option value="INDEFINIDO">INDEFINIDO</option>
                                        <option value="FIJO">PLAZO FIJO</option>
                                        <option value="EVENTUAL">EVENTUAL</option>
                                        <option value="CONSULTORIA">CONSULTORIA</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Fecha Ingreso *</label>
                                    <input
                                        type="date"
                                        value={data.fecha_ingreso}
                                        onChange={(e) => setData('fecha_ingreso', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Fecha Nacimiento *</label>
                                    <input
                                        type="date"
                                        value={data.fecha_nacimiento}
                                        onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Fecha Retiro (Opcional)</label>
                                    <input
                                        type="date"
                                        value={data.fecha_retiro}
                                        onChange={(e) => setData('fecha_retiro', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                                    />
                                </div>

                                {!editingEmpleado ? (
                                    <div>
                                        <label className="block text-slate-300 font-semibold mb-1">Contraseña de Usuario *</label>
                                        <input
                                            type="text"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-slate-300 font-semibold mb-1">Estado de Empleado</label>
                                        <select
                                            value={data.estado}
                                            onChange={(e) => setData('estado', e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                                        >
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                            <option value="VACACIONES">VACACIONES</option>
                                            <option value="LICENCIA">LICENCIA</option>
                                        </select>
                                    </div>
                                )}
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
                                    {editingEmpleado ? 'Guardar Cambios' : 'Crear Empleado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
