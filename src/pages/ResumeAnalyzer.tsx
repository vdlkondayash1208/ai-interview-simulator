import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Search, Rocket, BrainCircuit, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/utils';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResults({
        score: 82,
        atsMatch: "High",
        keywords: ["React.js", "Tailwind CSS", "TypeScript", "Node.js", "Redux", "Jest"],
        missing: ["Next.js", "GraphQL", "Docker"],
        suggestions: [
          "Add more project metrics (e.g. 'Improved performance by 30%')",
          "Highlight your cloud experience with AWS or GCP",
          "Ensure consistent date formatting"
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Resume AI Analyzer</h1>
        <p className="text-slate-400">Optimize your profile for 99% ATS pass rate using our neural scanning model.</p>
      </div>

      <div className="bg-slate-800/20 backdrop-blur-sm p-12 rounded-[40px] border-2 border-dashed border-slate-800 text-center space-y-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
         {!results && !isAnalyzing && (
           <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-indigo-500 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/10">
                <Upload className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Upload your Resume</h3>
                <p className="text-slate-500 text-sm mt-1 font-medium">Supports PDF, DOCX (Max 5MB)</p>
              </div>
              <label className="inline-block cursor-pointer">
                <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx" />
                <span className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 block">
                  Select File
                </span>
              </label>
              {file && (
                <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-2">
                   <FileText className="w-4 h-4" /> {file.name}
                </p>
              )}
              {file && (
                <button onClick={analyzeResume} className="block w-full max-w-xs mx-auto bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/5">
                  Start AI Analysis
                </button>
              )}
           </div>
         )}

         {isAnalyzing && (
           <div className="py-12 space-y-6">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-white animate-pulse">Extracting skill matrices...</h3>
                 <p className="text-slate-500 text-sm font-medium">Identifying key technologies and impact metrics.</p>
              </div>
              <div className="max-w-sm mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-indigo-500 shadow-glow"
                 />
              </div>
           </div>
         )}

         {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold text-slate-200">{file?.name}</span>
                  </div>
                  <button onClick={() => setResults(null)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                    Scan Another
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-inner">
                     <div className="text-center mb-6">
                        <p className="text-5xl font-black text-white mb-1">{results.score}%</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ATS Compatibility Score</p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span className="text-slate-400">Match Potential</span>
                           <span className="text-emerald-400 uppercase">{results.atsMatch}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)] w-[82%]" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Identified Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                           {results.keywords.map((k: string) => (
                              <span key={k} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[11px] font-bold border border-indigo-500/20">{k}</span>
                           ))}
                        </div>
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Missing Critical Skills</h4>
                        <div className="flex flex-wrap gap-2">
                           {results.missing.map((k: string) => (
                              <span key={k} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg text-[11px] font-bold border border-rose-500/20">{k}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-indigo-600/5 p-8 rounded-[32px] border border-indigo-500/10">
                  <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <Rocket className="w-5 h-5 text-indigo-400" /> AI Optimization Strategy
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {results.suggestions.map((s: string, i: number) => (
                       <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed font-medium">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {s}
                       </li>
                     ))}
                  </ul>
               </div>
            </motion.div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 bg-slate-800/20 rounded-3xl border border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
               <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Scan History</p>
               <p className="font-bold text-white">4 Profiles Analyzed</p>
            </div>
         </div>
         <div className="p-6 bg-slate-800/20 rounded-3xl border border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
               <Target className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Success Pipeline</p>
               <p className="font-bold text-white">85% Interview Conversion</p>
            </div>
         </div>
      </div>
    </div>
  );
}
