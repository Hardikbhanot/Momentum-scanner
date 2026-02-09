import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle, Activity, TrendingUp, AlertTriangle, PieChart, List, FileText } from 'lucide-react';

const GuideOverlay = ({ isOpen, onClose, activeTab }) => {
    const [currentStep, setCurrentStep] = useState(0);

    // Reset step when opening
    useEffect(() => {
        if (isOpen) setCurrentStep(0);
    }, [isOpen, activeTab]);

    const commonChartsStep = {
        title: "Reading the Charts",
        content: (
            <div className="space-y-4 text-left">
                <p>When you click a ticker, the Chart Modal opens. Here's what the lines mean:</p>
                <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
                        <span><strong>Green Line:</strong> Current Price Action</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-blue-500 border-dashed border-t-2 border-blue-500"></div>
                        <span><strong>Dashed Blue:</strong> 50-Day SMA (Trend Filter)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-amber-400 border-dashed border-t-2 border-amber-400"></div>
                        <span><strong>Yellow Dashed:</strong> Breakout Level (Target Entry)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-rose-500"></div>
                        <span><strong>Red Line:</strong> Stop Loss Level (Risk Management)</span>
                    </li>
                </ul>
            </div>
        ),
        icon: <AlertTriangle className="w-16 h-16 text-amber-400 mb-4" />
    };

    const contentMap = {
        dashboard: [
            {
                title: "Dashboard Overview",
                content: "This is your command center. It gives you a high-level view of market activity and your potential exposure if you take all trades.",
                icon: <Activity className="w-16 h-16 text-emerald-400 mb-4" />
            },
            {
                title: "Key Metrics",
                content: (
                    <div className="space-y-4 text-left">
                        <p>Track these numbers daily:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li><strong>Capital at Risk:</strong> Total exposure assuming $2k risk per trade.</li>
                            <li><strong>Active signals:</strong> Number of confirmed breakouts today.</li>
                        </ul>
                    </div>
                ),
                icon: <PieChart className="w-16 h-16 text-blue-400 mb-4" />
            },
            commonChartsStep
        ],
        scanner: [
            {
                title: "The Scanner",
                content: "This is the core of the app. It scans the US Tech Universe in real-time to find stocks meeting the 'Trend + Consolidation' criteria.",
                icon: <List className="w-16 h-16 text-emerald-400 mb-4" />
            },
            {
                title: "Understanding Signals",
                content: (
                    <div className="space-y-4 text-left">
                        <p>The status column tells you what to do:</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li><strong className="text-emerald-400">BUY:</strong> Breakout confirmed. Price &gt; Breakout Level.</li>
                            <li><strong className="text-blue-400">SETUP:</strong> Watchlist. Price is within 5% of breaking out.</li>
                            <li><strong className="text-slate-400">WAIT:</strong> Consolidating but not near breakout.</li>
                        </ul>
                    </div>
                ),
                icon: <TrendingUp className="w-16 h-16 text-blue-400 mb-4" />
            },
            commonChartsStep
        ],
        status: [
            {
                title: "Screening Audit Log",
                content: "Wondering why a stock isn't showing up? This page explains exactly why tickers were rejected by the algorithm.",
                icon: <FileText className="w-16 h-16 text-slate-400 mb-4" />
            },
            {
                title: "Common Rejection Reasons",
                content: (
                    <div className="space-y-4 text-left">
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li><strong>Volume &lt; 300k:</strong> Stock is too illiquid.</li>
                            <li><strong>Downtrend (Price &lt; SMA50):</strong> We only trade stocks in uptrends.</li>
                            <li><strong>No Riser:</strong> Stock hasn't moved up 30% in the last quarter (no momentum).</li>
                            <li><strong>Drawdown too deep:</strong> The consolidation pullback was too severe (&gt;25%).</li>
                        </ul>
                    </div>
                ),
                icon: <AlertTriangle className="w-16 h-16 text-rose-400 mb-4" />
            }
        ]
    };

    const steps = contentMap[activeTab] || contentMap['dashboard'];

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    key={`${activeTab}-${currentStep}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {activeTab} Guide • {currentStep + 1}/{steps.length}
                        </span>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col items-center text-center">
                        {steps[currentStep].icon}
                        <h2 className="text-2xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
                        <div className="text-slate-300 text-lg leading-relaxed">
                            {steps[currentStep].content}
                        </div>
                    </div>

                    {/* Footer / Navigation */}
                    <div className="p-6 border-t border-slate-700 flex justify-between items-center bg-slate-800/50">
                        <div className="flex gap-1">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === 0
                                    ? 'text-slate-600 cursor-not-allowed'
                                    : 'text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <ChevronLeft size={16} className="mr-1" /> Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex items-center px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                {currentStep !== steps.length - 1 && <ChevronRight size={16} className="ml-1" />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GuideOverlay;
