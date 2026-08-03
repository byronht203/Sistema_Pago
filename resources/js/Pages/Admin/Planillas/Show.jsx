import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function PlanillaShow({ planilla }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.role?.nombre ? auth.user.role.nombre.toLowerCase() : 'admin';
    const isEmpleadoRole = userRole === 'empleado';

    const emp = planilla.empleado;
    const depto = emp?.departamento;
    const cargo = emp?.cargo;
    const asis = planilla.asistencia;

    const ingresos = planilla.detalles?.filter((d) => d.concepto_pago?.tipo === 'INGRESO') || [];
    const egresos = planilla.detalles?.filter((d) => d.concepto_pago?.tipo === 'EGRESO') || [];

    const handlePrint = () => {
        window.print();
    };

    const handleEstadoChange = (nuevoEstado) => {
        if (isEmpleadoRole) return;
        router.patch(route('admin.planillas.estado', planilla.id), { estado: nuevoEstado });
    };

    const mesStr = String(planilla.periodo_mes).padStart(2, '0');
    const fechaInicioPeriodo = `01/${mesStr}/${planilla.periodo_anio}`;
    const fechaFinPeriodo = `30/${mesStr}/${planilla.periodo_anio}`;

    return (
        <AuthenticatedLayout header={null}>
            <Head title={`Boleta de Pago - ${emp?.nombres} ${emp?.apellidos} - Tropiflor A.G.`} />

            {/* Print Styles for Letter Paper */}
            <style>{`
                @media print {
                    @page {
                        size: letter portrait;
                        margin: 10mm;
                    }
                    body {
                        background-color: #ffffff !important;
                        color: #000000 !important;
                    }
                    header, footer, nav, .print-hidden {
                        display: none !important;
                    }
                    .boleta-paper {
                        border: 1px solid #000000 !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        box-shadow: none !important;
                        padding: 20px !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                    }
                }
            `}</style>

            <div className="space-y-6">
                {/* Top Action Bar (Screen Only) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 print-hidden">
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('admin.planillas.index')}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1"
                        >
                            <span>← Volver a Planillas</span>
                        </Link>
                        <span className="text-xs text-slate-400">
                            Boleta de <strong className="text-white">{emp?.nombres} {emp?.apellidos}</strong> ({mesStr}/{planilla.periodo_anio})
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Status Section: Static badge for Employees, interactive buttons for Admin/RRHH */}
                        {isEmpleadoRole ? (
                            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
                                <span className="text-slate-400 font-semibold">Estado:</span>
                                <span className={`font-black uppercase px-2.5 py-0.5 rounded-md ${
                                    planilla.estado === 'PAGADO'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : planilla.estado === 'APROBADO'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}>
                                    {planilla.estado}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                                {['GENERADO', 'APROBADO', 'PAGADO'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => handleEstadoChange(st)}
                                        className={`px-3 py-1 rounded-lg font-bold transition ${
                                            planilla.estado === st
                                                ? 'bg-orange-500 text-slate-950 shadow'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handlePrint}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center space-x-2"
                        >
                            <span>🖨️ Imprimir boleta</span>
                        </button>
                    </div>
                </div>

                {/* MAIN BOLETA DOCUMENT - Exact single line header & Letter proportions */}
                <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-slate-100 boleta-paper font-sans">

                    {/* HEADER: Single Line Separator below */}
                    <div className="flex justify-between items-start pb-4 border-b border-slate-700 print:border-black">
                        <div className="space-y-1">
                            <img
                                src="/images/logo.png"
                                alt="Tropiflor A.G."
                                className="h-12 w-auto object-contain mb-1 print:h-10"
                            />
                            <h2 className="text-base font-black text-white print:text-black uppercase tracking-tight">
                                TROPIFLOR A.G.
                            </h2>
                            <p className="text-xs text-slate-300 print:text-slate-800">
                                Dirección: Parque Agroindustrial Km 12 • Santa Cruz, Bolivia
                            </p>
                            <p className="text-[11px] text-slate-400 print:text-slate-700 font-mono">
                                NIT / RUC: 1029384029
                            </p>
                        </div>

                        <div className="text-right space-y-1">
                            <h1 className="text-xl font-black text-white print:text-black uppercase tracking-wider">
                                BOLETA DE PAGO
                            </h1>
                            <p className="text-xs font-mono text-slate-300 print:text-black">
                                Del <strong className="text-orange-400 print:text-black">{fechaInicioPeriodo}</strong> Al <strong className="text-orange-400 print:text-black">{fechaFinPeriodo}</strong>
                            </p>
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 print:border print:border-black print:text-black">
                                Estado: {planilla.estado}
                            </span>
                        </div>
                    </div>

                    {/* EMPLOYEE INFO BOX */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 print:bg-white border border-slate-700 print:border-black grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                        <div>
                            <span className="text-slate-400 print:text-slate-700 block text-[10px] font-bold uppercase">Trabajador:</span>
                            <span className="font-bold text-white print:text-black">{emp?.nombres} {emp?.apellidos}</span>
                        </div>

                        <div>
                            <span className="text-slate-400 print:text-slate-700 block text-[10px] font-bold uppercase">CI / NIT:</span>
                            <span className="font-mono font-bold text-slate-200 print:text-black">{emp?.ci_nit}</span>
                        </div>

                        <div>
                            <span className="text-slate-400 print:text-slate-700 block text-[10px] font-bold uppercase">Cargo:</span>
                            <span className="font-semibold text-slate-200 print:text-black">{cargo?.nombre || 'N/A'}</span>
                        </div>

                        <div>
                            <span className="text-slate-400 print:text-slate-700 block text-[10px] font-bold uppercase">Departamento:</span>
                            <span className="font-semibold text-slate-200 print:text-black">{depto?.nombre || 'N/A'}</span>
                        </div>

                        <div>
                            <span className="text-slate-400 print:text-slate-700 block text-[10px] font-bold uppercase">Fecha de Ingreso:</span>
                            <span className="font-medium text-slate-300 print:text-black">{emp?.fecha_ingreso}</span>
                        </div>

                        <div>
                            <span className="text-slate-400 print:text-slate-700 block text-[10px] font-bold uppercase">Días Trabajados:</span>
                            <span className="font-bold text-emerald-400 print:text-black">{asis ? asis.dias_trabajados : 30} días</span>
                        </div>
                    </div>

                    {/* REMUNERACIONES VS DESCUENTOS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Remuneraciones */}
                        <div className="border border-slate-700 print:border-black rounded-xl overflow-hidden flex flex-col justify-between">
                            <div>
                                <div className="bg-slate-950 print:bg-slate-200 px-3 py-1.5 border-b border-slate-700 print:border-black flex justify-between items-center font-bold text-[11px]">
                                    <span className="text-white print:text-black">REMUNERACIONES</span>
                                    <span className="text-slate-400 print:text-black text-[10px]">Monto (Bs)</span>
                                </div>
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                                        {ingresos.map((det) => (
                                            <tr key={det.id}>
                                                <td className="px-3 py-1.5">
                                                    <span className="font-semibold text-slate-200 print:text-black block">{det.concepto_pago?.nombre}</span>
                                                    {det.observacion && <span className="text-[10px] text-slate-400 print:text-slate-600 block">{det.observacion}</span>}
                                                </td>
                                                <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-100 print:text-black">
                                                    {Number(det.monto_calculado).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-slate-950 print:bg-slate-100 px-3 py-2 border-t border-slate-700 print:border-black flex justify-between items-center font-bold">
                                <span className="text-white print:text-black text-[10px]">TOTAL REMUNERACION:</span>
                                <span className="font-mono text-emerald-400 print:text-black text-xs">
                                    Bs. {Number(planilla.total_ganado).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Descuentos */}
                        <div className="border border-slate-700 print:border-black rounded-xl overflow-hidden flex flex-col justify-between">
                            <div>
                                <div className="bg-slate-950 print:bg-slate-200 px-3 py-1.5 border-b border-slate-700 print:border-black flex justify-between items-center font-bold text-[11px]">
                                    <span className="text-white print:text-black">DESCUENTOS</span>
                                    <span className="text-slate-400 print:text-black text-[10px]">Monto (Bs)</span>
                                </div>
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                                        {egresos.map((det) => (
                                            <tr key={det.id}>
                                                <td className="px-3 py-1.5">
                                                    <span className="font-semibold text-slate-200 print:text-black block">{det.concepto_pago?.nombre}</span>
                                                    {det.observacion && <span className="text-[10px] text-slate-400 print:text-slate-600 block">{det.observacion}</span>}
                                                </td>
                                                <td className="px-3 py-1.5 text-right font-mono font-bold text-rose-400 print:text-black">
                                                    {Number(det.monto_calculado).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-slate-950 print:bg-slate-100 px-3 py-2 border-t border-slate-700 print:border-black flex justify-between items-center font-bold">
                                <span className="text-white print:text-black text-[10px]">TOTAL DESCUENTOS:</span>
                                <span className="font-mono text-rose-400 print:text-black text-xs">
                                    Bs. {Number(planilla.total_descuentos).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* FIRMAS */}
                    <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
                        <div className="space-y-1">
                            <div className="border-t border-dashed border-slate-600 print:border-black pt-1.5 max-w-xs mx-auto"></div>
                            <p className="font-bold text-white print:text-black uppercase text-[11px]">EMPLEADOR</p>
                            <p className="text-[10px] text-slate-400 print:text-slate-700">Tropiflor A.G.</p>
                        </div>

                        <div className="space-y-1">
                            <div className="border-t border-dashed border-slate-600 print:border-black pt-1.5 max-w-xs mx-auto"></div>
                            <p className="font-bold text-white print:text-black uppercase text-[11px]">{emp?.nombres} {emp?.apellidos}</p>
                            <p className="text-[10px] text-slate-400 print:text-slate-700">Firma Trabajador</p>
                        </div>
                    </div>

                    {/* NETO A PAGAR BOX */}
                    <div className="p-3.5 rounded-xl bg-slate-950 print:bg-white border border-orange-500 print:border-black flex justify-between items-center">
                        <div>
                            <span className="text-xs uppercase font-extrabold text-orange-400 print:text-black block">
                                NETO A PAGAR:
                            </span>
                            <span className="text-[10px] text-slate-400 print:text-slate-700">
                                Tropiflor A.G.
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-emerald-400 print:text-black font-mono">
                                Bs. {Number(planilla.liquido_pagable).toFixed(2)}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
