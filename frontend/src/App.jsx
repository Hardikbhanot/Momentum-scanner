import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Bell, Activity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import SignalTable from './components/SignalTable';
import PriceChartModal from './components/PriceChartModal';

function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [data, setData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(null);

  useEffect(() => {
    fetchScan();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchScan();
    }, 60000); // 60s

    return () => clearInterval(interval);
  }, []);

  const fetchScan = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/scan');
      if (res.data.candidates) {
        setData(res.data.candidates);
        setRejectedData(res.data.rejected || []);
      } else {
        // Legacy fallback

        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Derived Stats
  const activeSignals = data.filter(d => d.status === 'BUY').length;
  const potentialSetups = data.filter(d => d.status === 'SETUP').length;
  // Estimated Capital Exposure

  const capitalAtRisk = activeSignals * 2000;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Capital at Risk (Potential)"
                value={`$${capitalAtRisk.toLocaleString()}`}
                icon={Wallet}
                trend="up"
                subValue="2% per trade"
              />
              <StatCard
                title="Active Buy Signals"
                value={activeSignals}
                icon={Bell}
                trend={activeSignals > 0 ? 'up' : 'neutral'}
                subValue="Breakout confirmed"
              />
              <StatCard
                title="Setup Watchlist"
                value={potentialSetups}
                icon={Activity}
                trend="neutral"
                subValue="In Consolidation"
              />
            </div>
            {/* Show a preview of the scanner on dashboard */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Market Scanner Preview</h3>
              <SignalTable
                data={data.slice(0, 5)}
                loading={loading}
                onSelectTicker={setSelectedTicker}
              />
            </div>
          </div>
        );
      case 'scanner':
        return (
          <div className="h-full flex flex-col">
            <SignalTable
              data={data}
              loading={loading}
              onSelectTicker={setSelectedTicker}
            />
          </div>
        );
      case 'status':
        return (
          <div className="h-full flex flex-col bg-slate-800/20 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/40">
              <h3 className="text-lg font-bold text-white">Screening Audit Log</h3>
              <p className="text-slate-400 text-sm">Showing why stocks were rejected from the scan.</p>
            </div>
            <div className="overflow-auto flex-1 custom-scrollbar p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50 sticky top-0 backdrop-blur">
                  <tr className="text-slate-400 text-sm">
                    <th className="p-4 font-medium pl-6">Ticker</th>
                    <th className="p-4 font-medium">Rejection Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedData.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-300">{item.ticker}</td>
                      <td className="p-4 text-rose-300 font-mono text-sm">{item.reason}</td>
                    </tr>
                  ))}
                  {rejectedData.length === 0 && !loading && (
                    <tr><td colSpan={2} className="p-8 text-center text-slate-500">No rejections recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-slate-900 min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-400 text-sm">Real-time Momentum Scanner • US Tech Universe</p>
          </div>
          <div className="flex gap-4">

          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>

        {/* Modal */}
        {selectedTicker && (
          <PriceChartModal
            ticker={selectedTicker.ticker}
            details={selectedTicker}
            onClose={() => setSelectedTicker(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
