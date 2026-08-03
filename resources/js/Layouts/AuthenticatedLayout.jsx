import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const roleName = user?.role?.nombre ? user.role.nombre.toLowerCase() : 'admin';
    const isAdmin = roleName === 'admin';
    const isAdminOrRrhh = roleName === 'admin' || roleName === 'rrhh';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
            {/* Top Navigation Header */}
            <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand Logo & Name */}
                        <div className="flex items-center space-x-3">
                            <Link href={route('dashboard')} className="flex items-center space-x-3 group">
                                <img
                                    src="/images/logo.png"
                                    alt="Tropiflor A.G."
                                    className="h-10 w-auto object-contain group-hover:scale-105 transition duration-200"
                                />
                                <div>
                                    <span className="text-lg font-black tracking-tight text-white group-hover:text-orange-400 transition">
                                        TROPIFLOR <span className="text-orange-400 font-normal">A.G.</span>
                                    </span>
                                    <span className="hidden sm:block text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                                        Sistema de Boletas & Planillas
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Top Desktop Links & User Info */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Role Badge */}
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                roleName === 'admin'
                                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                    : roleName === 'rrhh'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}>
                                {user?.role?.nombre || 'Usuario'}
                            </span>

                            {/* User details */}
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>

                            {/* Logout button */}
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800/40 transition duration-150"
                                title="Cerrar Sesión"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Link>
                        </div>

                        {/* Mobile menu trigger */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation Bar for Desktop */}
                <div className="hidden md:block bg-slate-900/60 border-t border-slate-800/80 py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto">
                        <Link
                            href={route('dashboard')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                route().current('dashboard')
                                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <span>📊</span>
                            <span>Dashboard</span>
                        </Link>

                        {/* Exclusive Admin User Management Link */}
                        {isAdmin && (
                            <Link
                                href={route('admin.usuarios.index')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                    route().current('admin.usuarios.*')
                                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                }`}
                            >
                                <span>👤</span>
                                <span>Usuarios</span>
                            </Link>
                        )}

                        {isAdminOrRrhh && (
                            <>
                                <Link
                                    href={route('admin.empleados.index')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                        route().current('admin.empleados.*')
                                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <span>👥</span>
                                    <span>Empleados</span>
                                </Link>

                                <Link
                                    href={route('admin.departamentos.index')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                        route().current('admin.departamentos.*')
                                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <span>🏢</span>
                                    <span>Departamentos</span>
                                </Link>

                                <Link
                                    href={route('admin.cargos.index')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                        route().current('admin.cargos.*')
                                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <span>💼</span>
                                    <span>Cargos</span>
                                </Link>

                                <Link
                                    href={route('admin.conceptos.index')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                        route().current('admin.conceptos.*')
                                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <span>⚙️</span>
                                    <span>Conceptos & Leyes</span>
                                </Link>

                                <Link
                                    href={route('admin.asistencias.index')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                        route().current('admin.asistencias.*')
                                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <span>📅</span>
                                    <span>Asistencia Mensual</span>
                                </Link>
                            </>
                        )}

                        <Link
                            href={route('admin.planillas.index')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
                                route().current('admin.planillas.*')
                                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/40'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <span>📄</span>
                            <span>{isAdminOrRrhh ? 'Gestión de Planillas' : 'Mis Boletas de Pago'}</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-2">
                        <Link href={route('dashboard')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                            📊 Dashboard
                        </Link>
                        {isAdmin && (
                            <Link href={route('admin.usuarios.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                                👤 Gestión de Usuarios
                            </Link>
                        )}
                        {isAdminOrRrhh && (
                            <>
                                <Link href={route('admin.empleados.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                                    👥 Empleados
                                </Link>
                                <Link href={route('admin.departamentos.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                                    🏢 Departamentos
                                </Link>
                                <Link href={route('admin.cargos.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                                    💼 Cargos
                                </Link>
                                <Link href={route('admin.conceptos.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                                    ⚙️ Conceptos & Leyes
                                </Link>
                                <Link href={route('admin.asistencias.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                                    📅 Asistencia Mensual
                                </Link>
                            </>
                        )}
                        <Link href={route('admin.planillas.index')} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
                            📄 Boletas & Planilla
                        </Link>
                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-400">{user?.name} ({roleName})</span>
                            <Link method="post" href={route('logout')} as="button" className="text-xs text-rose-400 font-semibold">
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium flex items-center justify-between shadow-lg">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">✅</span>
                            <span>{flash.success}</span>
                        </div>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium flex items-center justify-between shadow-lg">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">⚠️</span>
                            <span>{flash.error}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Title Section if passed */}
            {header && (
                <div className="bg-slate-900/40 border-b border-slate-800/60 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <img src="/images/logo.png" alt="Tropiflor Logo" className="h-6 w-auto opacity-70" />
                        <p>© {new Date().getFullYear()} Tropiflor A.G. — Empresa Agrícola & Floricultura Tropical. Todos los derechos reservados.</p>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span>Motor de Cálculo Salarial & Gestión de Usuarios</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
