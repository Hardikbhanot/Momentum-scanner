import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

const GuideOverlay = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Welcome to Momentum Scanner",
            content: "This tool helps you identify high-momentum stock setups in real-time. It scans the US Tech Universe to find breakout candidates before they run.",
            icon: <Activity className="w-16 h-16 text-emerald-400 mb-4" />
        },
        {
            title: "Understanding the Scanner",
            content: (
                <div className="space-y-4 text-left">
                    <p>The main dashboard shows live signals:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                        <li><strong className="text-emerald-400">BUY Signal:</strong> Stock has broken out of consolidation with volume.</li>
                        <li><strong className="text-blue-400">SETUP:</strong> Stock is consolidating and worth watching.</li>
                        <li><strong className="text-rose-400">Rejections:</strong> Stocks that failed the criteria (visible in Status tab).</li>
                    </ul>
                </div>
            ),
            icon: <TrendingUp className="w-16 h-16 text-blue-400 mb-4" />
        },
        {
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
                            <span><strong>Dashed Blue:</strong> 50-Day Simple Moving Average (Trend Filter)</span>
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
        }
    ];

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
            >
                <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 flex justify-end">
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
                                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
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
