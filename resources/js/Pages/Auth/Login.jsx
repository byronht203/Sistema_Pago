import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const fillCredentials = (email) => {
        setData({
            email: email,
            password: 'password123',
            remember: true
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans relative overflow-hidden">
            {/* Background glowing eco & tropiflor elements */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header / Brand */}
            <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src="/images/logo.png"
                        alt="Tropiflor A.G. Logo"
                        className="h-12 w-auto object-contain drop-shadow-md"
                    />
                    <div>
                        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                            TROPIFLOR <span className="text-white font-light">A.G.</span>
                        </span>
                        <span className="block text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">
                            Sistema de Boletas & Planillas de Pago
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-amber-400/90 bg-slate-900/80 border border-orange-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span>Empresa Agrícola & Floricultura Tropical</span>
                </div>
            </header>

            {/* Main Section */}
            <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
                <Head title="Iniciar Sesión - Tropiflor A.G." />

                {/* Left Panel: Information & Value proposition */}
                <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Plataforma Oficial de Gestión Salarial</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                        Nómina & Boletas en <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">Tropiflor A.G.</span>
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
                        Automatice la emisión de recibos de pago, cálculo de retenciones de ley, bono de antigüedad y exportación de planillas en Excel para el personal de producción y gestión bio-orgánica.
                    </p>

                    {/* Features Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-3 text-xl">
                                🌺
                            </div>
                            <h3 className="text-sm font-semibold text-slate-100">Tropiflor A.G.</h3>
                            <p className="text-xs text-slate-400 mt-1">Gestión integral de personal agrícola y viveros.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 text-xl">
                                📊
                            </div>
                            <h3 className="text-sm font-semibold text-slate-100">Exportación a Excel</h3>
                            <p className="text-xs text-slate-400 mt-1">Descargue planillas generales de nómina en formato CSV/XLS.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 text-xl">
                                🖨️
                            </div>
                            <h3 className="text-sm font-semibold text-slate-100">Boleta con Logo</h3>
                            <p className="text-xs text-slate-400 mt-1">Recibos imprimibles con membrete e imagen corporativa.</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Login Card */}
                <div className="lg:col-span-5">
                    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl hover:border-orange-500/40 transition-all duration-300">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Acceso al Sistema</h2>
                                <p className="text-sm text-slate-400 mt-1">Ingrese sus credenciales de Tropiflor A.G.</p>
                            </div>
                            <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        </div>

                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ejemplo@sistema.com"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-xs text-rose-400 font-medium flex items-center space-x-1">
                                        <span>⚠️ {errors.email}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
                                        required
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-xs text-rose-400 font-medium">
                                        ⚠️ {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                                    />
                                    <span className="text-slate-400 text-xs font-medium">Recordar sesión</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-orange-950/50 hover:shadow-orange-500/30 transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {processing ? (
                                    <span>Verificando...</span>
                                ) : (
                                    <>
                                        <span>Ingresar a Tropiflor A.G.</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Quick Demo Access Bar */}
                        <div className="mt-8 pt-6 border-t border-slate-800/80">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Accesos Rápidos de Prueba (Demo)
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('admin@sistema.com')}
                                    className="px-2.5 py-1.5 rounded-lg bg-orange-950/60 border border-orange-700/50 text-orange-300 hover:bg-orange-800/40 text-xs font-medium text-center transition"
                                >
                                    👑 Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('rrhh@sistema.com')}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-800/40 text-xs font-medium text-center transition"
                                >
                                    💼 RRHH
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillCredentials('empleado@sistema.com')}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-800 text-xs font-medium text-center transition"
                                >
                                    👤 Empleado
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 text-center">
                                Contraseña demo: <code className="text-orange-400 font-mono">password123</code>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4 text-center md:flex md:items-center md:justify-between text-xs text-slate-500 border-t border-slate-900">
                <p>© {new Date().getFullYear()} Tropiflor A.G. — Sistema de Automatización de Boletas de Pago. Todos los derechos reservados.</p>
                <div className="mt-2 md:mt-0 space-x-4">
                    <span>Soporte Técnico</span>
                    <span>•</span>
                    <span>Tropiflor A.G. Bolivia</span>
                </div>
            </footer>
        </div>
    );
}
