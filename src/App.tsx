import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  History, 
  Cpu, 
  Radio, 
  Bell,
  Activity,
  Wrench
} from 'lucide-react';

// --- Types ---

type Tab = 'STATO' | 'CONTROLLI' | 'ALLARMI' | 'MANUTENZIONE';

interface Alarm {
  id: string;
  time: string;
  code: string;
  desc: string;
  type: 'ERR' | 'WRN';
}

// --- Components ---

const IndustrialSlider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  unit = '%',
  isCorrectDesign = false
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number; 
  step?: number;
  unit?: string;
  isCorrectDesign?: boolean;
}) => (
  <div className={isCorrectDesign ? "mb-6" : "mb-3"}>
    <div className={`flex justify-between items-end ${isCorrectDesign ? "mb-2" : "mb-1"}`}>
      <span className={`${isCorrectDesign ? "text-[12px]" : "text-[10px]"} font-bold text-black/60 uppercase tracking-wider`}>{label}</span>
      <span className={`${isCorrectDesign ? "text-lg" : "text-sm"} font-bold text-hmi-toxic-green tracking-tighter`}>
        {step < 1 ? value.toFixed(2) : value}{unit}
      </span>
    </div>
    <div className="flex items-center gap-3">
      {isCorrectDesign && (
        <button 
          onClick={() => onChange(parseFloat(Math.max(min, value - step).toFixed(2)))}
          className="w-10 h-10 border border-black/20 bg-hmi-steel-light flex items-center justify-center text-xl font-bold active:bg-black/10 active:translate-y-0.5 transition-all industrial-bevel"
        >
          -
        </button>
      )}
      <div className={`relative ${isCorrectDesign ? "h-10" : "h-6"} flex-1 flex items-center`}>
        <div className="absolute w-full h-[2px] industrial-inset" />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className={`absolute ${isCorrectDesign ? "h-6 w-3" : "h-4 w-2"} bg-[#94A3B8] industrial-bevel border-[1px] border-black/20 pointer-events-none`}
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - ${isCorrectDesign ? '6px' : '4px'})` }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center gap-[1px]">
            <div className="w-[60%] h-[1px] bg-black/40" />
            <div className="w-[60%] h-[1px] bg-black/40" />
          </div>
        </div>
      </div>
      {isCorrectDesign && (
        <button 
          onClick={() => onChange(parseFloat(Math.min(max, value + step).toFixed(2)))}
          className="w-10 h-10 border border-black/20 bg-hmi-steel-light flex items-center justify-center text-xl font-bold active:bg-black/10 active:translate-y-0.5 transition-all industrial-bevel"
        >
          +
        </button>
      )}
    </div>
  </div>
);

const IndustrialToggle = ({ 
  label, 
  active, 
  onChange,
  isCorrectDesign = false 
}: { 
  label: string; 
  active: boolean; 
  onChange: () => void;
  isCorrectDesign?: boolean;
}) => (
  <div className={`flex items-center justify-between ${isCorrectDesign ? "p-3 h-[48px]" : "p-2 h-[36px]"} rounded bg-black/5 industrial-bevel industrial-gloss transition-all`}>
    <span className={`${isCorrectDesign ? "text-[12px]" : "text-[10px]"} font-bold text-black/70 uppercase`}>{label}</span>
    <div className="flex items-center gap-3">
      {/* LED */}
      <div className={`${isCorrectDesign ? "w-4 h-4" : "w-3 h-3"} rounded-full border border-black/50 ${active ? 'bg-hmi-toxic-green shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'bg-[#CBD5E1]'} transition-all`} />
      {/* Switch */}
      <button 
        onClick={onChange}
        className={`relative ${isCorrectDesign ? "w-14 h-7 px-[3px]" : "w-10 h-5 px-[2px]"} bg-[#E2E8F0] border border-black/10 flex items-center cursor-pointer transition-all`}
      >
        <motion.div 
          animate={{ x: active ? (isCorrectDesign ? 28 : 20) : 0 }}
          className={`${isCorrectDesign ? "w-6 h-6" : "w-4 h-4"} industrial-bevel ${active ? 'bg-hmi-toxic-green-dim' : 'bg-[#94A3B8]'} transition-all`}
        />
      </button>
    </div>
  </div>
);

const IconButton = ({ active }: { active?: boolean }) => (
  <button className="p-1 border border-black/10 bg-[#E5E7EB] industrial-bevel hover:bg-[#D1D5DB] active:bg-[#CBD5E1]">
    <Settings size={12} className={active ? 'text-hmi-toxic-green' : 'text-black/60'} />
  </button>
);

export default function App() {
  const [speed, setSpeed] = useState(30.42);
  const [temp, setTemp] = useState(185);
  const [pressure, setPressure] = useState(0.9);
  const [injPressure, setInjPressure] = useState(74);
  const [cooling, setCooling] = useState(true);
  const [autoCalib, setAutoCalib] = useState(false);
  const [moldHeat, setMoldHeat] = useState(true);
  const [ventilation, setVentilation] = useState(true);
  const [lubrication, setLubrication] = useState(false);
  const [ecoMode, setEcoMode] = useState(false);
  
  const [operatorId, setOperatorId] = useState('');
  const [verified, setVerified] = useState(false);
  const [recipeEdited, setRecipeEdited] = useState(false);
  const [alarmFilter, setAlarmFilter] = useState<'TUTTI' | 'ERR' | 'WRN'>('TUTTI');
  
  const [showFab, setShowFab] = useState(false);
  const [isCorrectDesign, setIsCorrectDesign] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFab(true);
    }, 45000); // 45 seconds
    return () => clearTimeout(timer);
  }, []);

  const initialAlarms: Alarm[] = [
    { id: '1', time: '14:02:42', code: 'WRN_079', desc: 'PRESSIONE STAMPO FUORI SOGLIA', type: 'WRN' },
    { id: '2', time: '14:02:28', code: 'ERR_088', desc: 'TEMPERATURA ZONA 2 CRITICA', type: 'ERR' },
    { id: '3', time: '14:02:13', code: 'WRN_089', desc: 'VELOCITÀ NASTRO ANOMALA', type: 'WRN' },
    { id: '4', time: '14:01:43', code: 'WRN_086', desc: 'SENSORE POMPA NON RISPONDE', type: 'WRN' },
    { id: '5', time: '14:01:02', code: 'WRN_031', desc: 'TARATURA AUTOMATICA FALLITA', type: 'WRN' },
  ];
  const [alarmLog, setAlarmLog] = useState<Alarm[]>(initialAlarms);

  const filteredAlarms = alarmLog.filter(a => {
    if (alarmFilter === 'TUTTI') return true;
    return a.type === alarmFilter;
  });

  const [recipe, setRecipe] = useState([
    { zone: 'PRE-RISCALDO', temp: 80, pressure: 0.5, time: 120, speed: 0.6, toll: 5 },
    { zone: 'VULCANIZZAZIONE', temp: 185, pressure: 2.5, time: 600, speed: 0.5, toll: 2 },
    { zone: 'RAFFREDDAMENTO', temp: 40, pressure: 0.2, time: 300, speed: 0.8, toll: 10 },
    { zone: 'USCITA', temp: 30, pressure: 0.0, time: 60, speed: 1.0, toll: 15 },
  ]);

  const updateRecipe = (idx: number, field: string, delta: number) => {
    setRecipe(prev => prev.map((row, i) => {
      if (i === idx) {
        let val = (row as any)[field] + delta;
        if (field === 'pressure' || field === 'speed') val = parseFloat(val.toFixed(1));
        return { ...row, [field]: Math.max(0, val) };
      }
      return row;
    }));
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex flex-col bg-hmi-carbone border-x border-black/5 overflow-hidden select-none">
      
      {/* Header */}
      <header className="h-[40px] md:h-[50px] flex items-center justify-between px-4 border-b border-black/10 industrial-gloss flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <div className="w-[20px] h-[20px] border border-black/20 flex items-center justify-center">
              <Cpu size={14} className="text-slate-900" />
            </div>
          </div>
          <h1 className="text-xs md:text-sm font-bold tracking-tight uppercase text-slate-900">Parametri Linea B – Componenti in Gomma</h1>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-hmi-toxic-green tracking-widest uppercase">Sistema Attivo</span>
          <span className="text-[10px] font-bold text-hmi-amber tracking-tighter uppercase italic">Modalità Manutenzione</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 ml-4">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-hmi-toxic-green" />
            <div className="flex gap-[2px]">
              {[1, 2, 3].map(i => <div key={i} className="w-[3px] h-4 bg-hmi-toxic-green" />)}
            </div>
          </div>
          <div className="h-6 w-px bg-black/10" />
          <div className="text-[10px] font-mono text-black/40">13.05.2026 | 12:07</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 ${isCorrectDesign ? "p-6 overflow-y-auto" : "p-3 overflow-hidden"} flex flex-col ${isCorrectDesign ? "gap-6" : "gap-3"} min-h-0`}>
        
        <div className={`flex flex-col ${isCorrectDesign ? "gap-6" : "gap-3"} ${isCorrectDesign ? "" : "h-full overflow-hidden"}`}>
          
          {/* Top Row: Process Control and Alarms */}
          <div className={`grid grid-cols-1 ${isCorrectDesign ? "md:grid-cols-1" : "md:grid-cols-2"} ${isCorrectDesign ? "gap-6" : "gap-3"} flex-1 min-h-0`}>
            
            {/* Process Control Section */}
            <section className={`border border-hmi-steel-border/50 ${isCorrectDesign ? "p-6" : "p-2 md:p-3"} bg-hmi-steel/30 relative flex flex-col min-h-0`}>
              <div className={`flex items-center justify-between ${isCorrectDesign ? "mb-6" : "mb-2"} border-b border-black/5 ${isCorrectDesign ? "pb-3" : "pb-1"}`}>
                <h2 className={`${isCorrectDesign ? "text-sm" : "text-[10px] md:text-[11px]"} font-bold text-black/50 uppercase flex items-center gap-2`}>
                  <Activity size={isCorrectDesign ? 16 : 12} />
                  Controllo Processo
                </h2>
              </div>
              
              <div className={isCorrectDesign ? "space-y-6" : "space-y-2 md:space-y-3"}>
                <IndustrialSlider label="Velocità Nastro (%)" value={speed} onChange={setSpeed} max={100} step={0.01} isCorrectDesign={isCorrectDesign} />
                <IndustrialSlider label="Temperatura Zona 2 – Vulcanizzazione" value={temp} onChange={setTemp} min={0} max={300} unit="° C" isCorrectDesign={isCorrectDesign} />
                <IndustrialSlider label="Pressione Iniezione (%)" value={injPressure} onChange={setInjPressure} max={100} step={1} isCorrectDesign={isCorrectDesign} />
              </div>
              
              <div className={`${isCorrectDesign ? "mt-6" : "mt-2"} flex flex-col gap-1`}>
                <div className="flex items-center gap-2">
                  <span className={`${isCorrectDesign ? "text-[11px]" : "text-[9px]"} font-bold text-black/60 uppercase`}>Offset Pressione Stampo</span>
                  <div className="flex-1 h-[1px] bg-black/5" />
                  <div className="flex items-center gap-2">
                    <div className={`${isCorrectDesign ? "w-24 h-10 text-sm" : "w-16 h-6 text-[11px]"} industrial-inset flex items-center justify-end px-3 font-bold text-slate-900 tabular-nums`}>
                      {pressure.toFixed(1)} bar
                    </div>
                    <button 
                      onClick={() => setPressure(p => parseFloat((Math.max(0, p - 0.1)).toFixed(1)))}
                      className={`${isCorrectDesign ? "w-10 h-10 text-lg" : "w-6 h-6 text-sm"} industrial-bevel bg-hmi-steel-light flex items-center justify-center font-bold active:bg-black/10 transition-all`}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setPressure(p => parseFloat((p + 0.1).toFixed(1)))}
                      className={`${isCorrectDesign ? "w-10 h-10 text-lg" : "w-6 h-6 text-sm"} industrial-bevel bg-hmi-steel-light flex items-center justify-center font-bold active:bg-black/10 transition-all`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={`flex items-center justify-between ${isCorrectDesign ? "mt-4" : "mt-1"}`}>
                  <div className={`flex ${isCorrectDesign ? "gap-8" : "gap-4"}`}>
                    <div className="flex flex-col">
                      <span className={`${isCorrectDesign ? "text-[9px]" : "text-[7px]"} text-black/40 uppercase font-bold`}>Portata Pompa</span>
                      <span className={`${isCorrectDesign ? "text-sm" : "text-[10px]"} text-hmi-toxic-green/80 font-mono`}>12.3 L/min</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`${isCorrectDesign ? "text-[9px]" : "text-[7px]"} text-black/40 uppercase font-bold`}>Cicli Completati</span>
                      <span className={`${isCorrectDesign ? "text-sm" : "text-[10px]"} text-hmi-toxic-green/80 font-mono`}>1.847</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-2 ${isCorrectDesign ? "gap-3 mt-6" : "gap-x-2 gap-y-1 mt-2"}`}>
                <IndustrialToggle label="Pompa Olio Idraulico" active={cooling} onChange={() => setCooling(!cooling)} isCorrectDesign={isCorrectDesign} />
                <IndustrialToggle label="Taratura Sensori" active={autoCalib} onChange={() => setAutoCalib(!autoCalib)} isCorrectDesign={isCorrectDesign} />
                <IndustrialToggle label="Riscaldo Stampo" active={moldHeat} onChange={() => setMoldHeat(!moldHeat)} isCorrectDesign={isCorrectDesign} />
                <IndustrialToggle label="Ventilazione Zona" active={ventilation} onChange={() => setVentilation(!ventilation)} isCorrectDesign={isCorrectDesign} />
                <IndustrialToggle label="Lubrificazione Auto" active={lubrication} onChange={() => setLubrication(!lubrication)} isCorrectDesign={isCorrectDesign} />
                <IndustrialToggle label="Modalità Eco" active={ecoMode} onChange={() => setEcoMode(!ecoMode)} isCorrectDesign={isCorrectDesign} />
              </div>
            </section>

            {/* Alarm Log Section */}
            <section className="border border-hmi-steel-border/50 bg-hmi-steel/30 flex flex-col min-h-0">
              <div className={`flex items-center justify-between ${isCorrectDesign ? "px-6 py-3" : "px-3 py-1"} border-b border-black/5 bg-black/5`}>
                <h2 className={`${isCorrectDesign ? "text-sm" : "text-[10px]"} font-bold text-black/50 uppercase flex items-center gap-2`}>
                  <Bell size={isCorrectDesign ? 16 : 10} />
                  Registro Allarmi
                </h2>
                <div className={`flex items-center ${isCorrectDesign ? "gap-6" : "gap-4"}`}>
                  <div className={`flex ${isCorrectDesign ? "gap-2" : "gap-1"}`}>
                    {(['TUTTI', 'ERR', 'WRN'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setAlarmFilter(tag)}
                        className={`${isCorrectDesign ? "px-3 py-1 text-[10px]" : "px-1.5 py-0.5 text-[7px]"} font-bold border industrial-bevel transition-all ${alarmFilter === tag ? 'bg-hmi-steel-light text-hmi-toxic-green border-hmi-toxic-green/50' : 'text-black/30 border-black/5'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <History size={isCorrectDesign ? 16 : 10} className="text-black/40" />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <tbody className="relative">
                    <AnimatePresence initial={false}>
                      {filteredAlarms.map((alarm) => (
                        <motion.tr 
                          key={alarm.id} 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ x: 100, opacity: 0 }}
                          className="border-b border-black/5 last:border-0 hover:bg-black/5 bg-hmi-steel/10"
                        >
                          <td className={`${isCorrectDesign ? "p-4 px-6 text-[12px]" : "p-1 px-2 text-[9px]"} font-bold text-hmi-amber opacity-80 tabular-nums align-top`}>{alarm.time}</td>
                          <td className={`${isCorrectDesign ? "p-4 text-[12px]" : "p-1 text-[9px]"} font-bold uppercase ${alarm.type === 'ERR' ? 'text-red-500' : 'text-hmi-amber'} align-top`}>{alarm.code}</td>
                          <td className={`${isCorrectDesign ? "p-4" : "p-1"} align-top`}>
                            <div className="flex flex-col gap-2">
                              <span className={`${isCorrectDesign ? "text-[12px]" : "text-[9px]"} font-bold uppercase ${alarm.type === 'ERR' ? 'text-red-500' : 'text-hmi-amber'} truncate max-w-[200px]`}>
                                {alarm.desc}
                              </span>
                              {isCorrectDesign && (
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                    className="px-4 py-1.5 border border-hmi-toxic-green/30 bg-hmi-toxic-green/5 text-hmi-toxic-green text-[10px] font-bold uppercase industrial-bevel hover:bg-hmi-toxic-green/10 transition-all flex items-center gap-2"
                                  >
                                    <div className="w-[6px] h-[6px] border-b-2 border-r-2 border-current rotate-45 mb-[1px]" />
                                    Risolvi
                                  </button>
                                  <button 
                                    onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                    className="px-4 py-1.5 border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-bold uppercase industrial-bevel hover:bg-red-500/10 transition-all flex items-center gap-2"
                                  >
                                    <div className="relative w-[7px] h-[7px] flex items-center justify-center">
                                      <div className="absolute w-full h-[1.5px] bg-red-500 rotate-45" />
                                      <div className="absolute w-full h-[1.5px] bg-red-500 -rotate-45" />
                                    </div>
                                    Elimina
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          {!isCorrectDesign && (
                            <td className="p-1 pr-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                  className="inline-flex items-center justify-center w-4 h-4 border border-black/5 hover:border-hmi-toxic-green/40 hover:bg-hmi-toxic-green/10 transition-colors"
                                >
                                  <div className="w-[5px] h-[5px] border-b-2 border-r-2 border-hmi-toxic-green rotate-45 mb-[1px]" />
                                </button>
                                <button 
                                  onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                  className="inline-flex items-center justify-center w-4 h-4 border border-black/5 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
                                >
                                  <div className="relative w-[6px] h-[6px] flex items-center justify-center">
                                    <div className="absolute w-[6px] h-[1px] bg-red-500 rotate-45" />
                                    <div className="absolute w-[6px] h-[1px] bg-red-500 -rotate-45" />
                                  </div>
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className={`${isCorrectDesign ? "p-4" : "p-2"} border-t border-black/10 bg-black/5`}>
                <div className={`flex items-center justify-between ${isCorrectDesign ? "text-[11px]" : "text-[8px]"} font-bold uppercase text-black/40`}>
                  <div className={`flex ${isCorrectDesign ? "gap-6" : "gap-3"}`}>
                    <span>Attivi: <span className="text-hmi-toxic-green">2</span></span>
                    <span>Non Letti: <span className="text-hmi-amber">3</span></span>
                    <span>Risolti: <span className="text-black/60">14</span></span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Row: Recipe Grid */}
          <section className="border border-hmi-steel-border/50 bg-hmi-steel/30 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 bg-black/5">
              <h2 className="text-[11px] font-bold text-black/50 uppercase flex items-center gap-2">
                <Wrench size={12} />
                Ricetta Attiva
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-black/5 border border-black/10 rounded-sm">
                  <span className="text-[11px] font-bold text-hmi-toxic-green">RIC_047_B</span>
                  <button className="p-1 hover:bg-black/5 rounded transition-colors" onClick={() => setRecipeEdited(true)}>
                    <Settings size={10} className="text-black/40" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-2 overflow-x-auto">
              <table className="w-full text-[9px] font-bold uppercase border-collapse">
                <thead>
                  <tr className="text-black/40 border-b border-black/5">
                    <th className="p-2 text-left">Zona</th>
                    <th className="p-2">T°C</th>
                    <th className="p-2">P (bar)</th>
                    <th className="p-2">t (s)</th>
                    <th className="p-2">V (m/m)</th>
                    <th className="p-2">TOLL ±</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.map((row, i) => (
                    <tr key={row.zone} className="border-b border-black/5 last:border-0 hover:bg-black/5">
                      <td className="p-2 text-black/60">{row.zone}</td>
                      {[
                        { field: 'temp', step: 1 },
                        { field: 'pressure', step: 0.1 },
                        { field: 'time', step: 10 },
                        { field: 'speed', step: 0.1 },
                        { field: 'toll', step: 1 }
                      ].map((col) => (
                        <td key={col.field} className="p-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => updateRecipe(i, col.field, -col.step)}
                              className="w-5 h-5 bg-[#E5E7EB] border border-black/10 flex items-center justify-center text-xs active:bg-black/10"
                            >
                              -
                            </button>
                            <div className="w-10 h-5 bg-black/5 border border-black/5 flex items-center justify-center tabular-nums text-slate-900">
                              {(row as any)[col.field].toFixed(col.field === 'pressure' || col.field === 'speed' ? 1 : 0)}
                            </div>
                            <button 
                              onClick={() => updateRecipe(i, col.field, col.step)}
                              className="w-5 h-5 bg-[#E5E7EB] border border-black/10 flex items-center justify-center text-xs active:bg-black/10"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-black/5 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-black/40 uppercase">ID Operatore:</span>
                  <input 
                    type="text" 
                    maxLength={8}
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value.toUpperCase())}
                    placeholder="REQUIRED"
                    className="w-24 h-7 bg-white border border-black/10 text-[11px] px-2 text-hmi-toxic-green font-mono outline-none focus:border-hmi-toxic-green/50"
                  />
                </div>
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setVerified(!verified)}>
                  <div className={`w-[14px] h-[14px] border ${verified ? 'bg-hmi-toxic-green border-hmi-toxic-green' : 'bg-transparent border-black/20'} flex items-center justify-center transition-all`}>
                    {verified && <div className="w-2 h-2 bg-black" />}
                  </div>
                  <span className="text-[9px] font-bold text-black/40 uppercase group-hover:text-black/60 transition-colors">
                    Confermo di aver verificato tutti i parametri
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  className="px-4 py-2 bg-[#E5E7EB] industrial-bevel text-[10px] font-bold uppercase hover:bg-[#D1D5DB] transition-colors"
                  onClick={() => {
                    setRecipe([
                      { zone: 'PRE-RISCALDO', temp: 80, pressure: 0.5, time: 120, speed: 0.6, toll: 5 },
                      { zone: 'VULCANIZZAZIONE', temp: 185, pressure: 2.5, time: 600, speed: 0.5, toll: 2 },
                      { zone: 'RAFFREDDAMENTO', temp: 40, pressure: 0.2, time: 300, speed: 0.8, toll: 10 },
                      { zone: 'USCITA', temp: 30, pressure: 0.0, time: 60, speed: 1.0, toll: 15 },
                    ]);
                  }}
                >
                  Ripristina Default
                </button>
                <button 
                  disabled={operatorId.length !== 8 || !verified}
                  className={`px-6 py-2 industrial-bevel text-[10px] font-bold uppercase transition-all ${operatorId.length === 8 && verified ? 'bg-hmi-amber text-black hover:bg-amber-400' : 'bg-[#E5E7EB] text-black/10 opacity-50'}`}
                  onClick={() => alert('RICETTA AGGIORNATA SUL SERVER')}
                >
                  Salva Ricetta
                </button>
              </div>
            </div>
          </section>

          {/* Final Apply Button */}
          <div className="flex-shrink-0 pt-1">
            <button 
              className="w-full py-4 bg-gradient-to-b from-hmi-toxic-green to-[#095300] industrial-bevel text-black font-bold text-[12px] md:text-[14px] uppercase tracking-[0.2em] shadow-[0_4px_0_#053900] active:shadow-none translate-y-[-4px] active:translate-y-[0px] transition-all"
            >
              Applica Modifiche Linea
            </button>
          </div>
        </div>
      </main>

      {/* Screen Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay">
        <div className="w-full h-full bg-[radial-gradient(circle,transparent_40%,black_100%)]" />
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showFab && (
          <motion.button
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            onClick={() => setIsCorrectDesign(!isCorrectDesign)}
            className="fixed bottom-24 right-8 z-50 px-6 py-3 bg-black text-white font-bold uppercase text-xs rounded-full shadow-2xl flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Settings size={16} className={isCorrectDesign ? "rotate-90 animate-spin-slow" : ""} />
            {isCorrectDesign ? "Vedi design compatto" : "Vedi design corretto"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

