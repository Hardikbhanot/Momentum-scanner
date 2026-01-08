import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subValue, trend, icon: Icon }) => {
    const isPositive = trend === 'up';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800/60 transition-all duration-300 group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-700/30 rounded-lg text-slate-400 group-hover:text-emerald-400 transition-colors">
                    {Icon && <Icon size={20} />}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {subValue}
                    </div>
                )}
            </div>

            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-slate-100">{value}</div>
        </motion.div>
    );
};

export default StatCard;
