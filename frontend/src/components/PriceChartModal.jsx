import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const PriceChartModal = ({ ticker, onClose, details }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ticker) {

            fetchHistory();
        }
    }, [ticker]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://127.0.0.1:8000/history/${ticker}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!ticker) return null;

    const buyLevel = details?.signal_details?.signal_price;
    const stopLevel = details?.execution?.stop_price;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                {ticker}
                                <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">Daily</span>
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6" style={{ height: '500px' }}>
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                Loading Chart Data...
                            </div>
                        ) : data.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                No Price Data Available
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis
                                        dataKey="date"
                                        hide
                                        stroke="#475569"
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        orientation="right"
                                        stroke="#475569"
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#cbd5e1' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="close"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Price"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sma_50"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                        strokeDasharray="5 5"
                                        name="50 SMA"
                                    />

                                    {buyLevel && (
                                        <ReferenceLine y={buyLevel} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'insideRight', value: 'Breakout', fill: '#fbbf24' }} />
                                    )}
                                    {stopLevel && (
                                        <ReferenceLine y={stopLevel} stroke="#f43f5e" label={{ position: 'insideRight', value: 'Stop', fill: '#f43f5e' }} />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="bg-slate-800/30 p-4 border-t border-slate-800 flex gap-8">
                        <div>
                            <span className="text-slate-500 text-xs text-transform uppercase">Stop Loss</span>
                            <div className="text-rose-400 font-mono font-bold">${stopLevel || '-'}</div>
                        </div>
                        <div>
                            <span className="text-slate-500 text-xs text-transform uppercase">Target Entry</span>
                            <div className="text-cyan-400 font-mono font-bold">${buyLevel || '-'}</div>
                        </div>
                        <div>
                            <span className="text-slate-500 text-xs text-transform uppercase">Shares</span>
                            <div className="text-slate-200 font-mono font-bold">{details?.execution?.shares || '-'}</div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PriceChartModal;
