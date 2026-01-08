import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, ChevronRight } from 'lucide-react';

const SignalTable = ({ data, loading, onSelectTicker }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'BUY': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'SETUP': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-0">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <TrendingUp className="text-emerald-400" />
                    Momentum Scanner
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                    SCAN_ID: {Math.floor(Date.now() / 1000)}
                </div>
            </div>

            <div className="overflow-x-auto flex-1 custom-scrollbar">
                {loading ? (
                    <div className="p-12 flex justify-center text-slate-500 py-32">
                        <Activity className="animate-spin mr-2" /> Scanning Universe...
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900/90 backdrop-blur z-10">
                            <tr className="text-slate-400 text-sm border-b border-slate-700/50">
                                <th className="p-4 font-medium pl-6">Ticker</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">Drawdown</th>
                                <th className="p-4 font-medium">Volatility (ATR)</th>
                                <th className="p-4 font-medium">Risk/Share</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => (
                                <motion.tr
                                    key={item.ticker}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => onSelectTicker(item)}
                                    className="group hover:bg-slate-700/30 cursor-pointer border-b border-slate-800/50 last:border-0 transition-colors"
                                >
                                    <td className="p-4 font-bold text-slate-200 group-hover:text-emerald-400 transition-colors pl-6">
                                        {item.ticker}
                                    </td>
                                    <td className="p-4 text-slate-300 font-mono">
                                        ${item.price}
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono">
                                        {item.signal_details?.drawdown ? (item.signal_details.drawdown * 100).toFixed(1) + '%' : '-'}
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono">
                                        {item.execution?.atr_14 || '-'}
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono">
                                        {item.execution?.risk_per_share ? `$${item.execution.risk_per_share}` : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <ChevronRight size={18} className="text-slate-600 group-hover:text-emerald-400" />
                                    </td>
                                </motion.tr>
                            ))}

                            {!loading && data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-500">
                                        No stocks met the criteria in this scan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SignalTable;
