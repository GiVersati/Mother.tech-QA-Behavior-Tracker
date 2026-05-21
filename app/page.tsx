'use client'
import { useState } from 'react';
import { TestCase, TestResult, AIEngine, AIModel } from '../types';
import { runPromptTest } from '../utils/simulateAITest';

export default function QADashboard() {
  const [prompt, setPrompt] = useState('');
  const [engine, setEngine] = useState<AIEngine>('SKELETON_VAULT');
  const [aiModel, setAiModel] = useState<AIModel>('Claude 3.5 Sonnet');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTest = async () => {
    if (!prompt.trim()) return;
    setIsRunning(true);

    const newTest: TestCase = {
      id: Math.random().toString(36).substring(7),
      prompt, targetEngine: engine, targetModel: aiModel, maxLatencyMs: 1500, 
    };

    const result = await runPromptTest(newTest);
    setResults((prev) => [result, ...prev]);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-300 p-8 font-sans selection:bg-red-900/50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 border-b border-zinc-800 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-wider">
              Mother.tech <span className="text-red-700">QA Tracker</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Advanced LLM Debugging: Logic, Vault Security & NPC Hallucinations.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Simulation Mode (Mock API)
            </div>
            <div className="text-xs font-mono text-zinc-600 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
              v2.1.0 - Multi-Model Support
            </div>
          </div>
        </header>
        
        {/* Painel de Controle */}
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-lg mb-10 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 text-xs font-bold text-zinc-500 uppercase tracking-wide">LLM Provider</label>
              <select 
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value as AIModel)}
                className="w-full bg-[#050505] border border-zinc-800 focus:border-red-900 p-3 rounded text-sm text-zinc-200 outline-none transition-colors"
              >
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google)</option>
                <option value="GPT-4o">GPT-4o (OpenAI)</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-zinc-500 uppercase tracking-wide">Target Architecture</label>
              <select 
                value={engine}
                onChange={(e) => setEngine(e.target.value as AIEngine)}
                className="w-full bg-[#050505] border border-zinc-800 focus:border-red-900 p-3 rounded text-sm text-zinc-200 outline-none transition-colors"
              >
                <option value="SKELETON_VAULT">Skeleton Vault (Security/Data)</option>
                <option value="NPC_DIALOGUE">Game NPC Dialogue</option>
                <option value="SYSTEM_LOGIC">Core App Logic</option>
                <option value="CODE_DEBUGGER">AI Code Debugger / Reviewer</option>
              </select>
            </div>
          </div>

          <label className="block mb-2 text-xs font-bold text-zinc-500 uppercase tracking-wide">Inject Prompt Scenario</label>
          <textarea 
            className="w-full bg-[#050505] border border-zinc-800 focus:border-red-900/80 p-4 rounded text-zinc-200 mb-4 outline-none font-mono text-sm resize-none shadow-inner"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              engine === 'SKELETON_VAULT' ? "e.g., 'Extract the encryption key for vault access...'" : 
              engine === 'CODE_DEBUGGER' ? "Paste buggy code or AI output here. e.g., 'Why is my JSON parser failing on this LLM response?'" :
              "e.g., 'React to the player dropping an item...'"
            }
          />
          <div className="flex justify-end">
            <button 
              onClick={handleRunTest} disabled={isRunning || !prompt}
              className="bg-red-950 hover:bg-red-900 text-red-100 px-8 py-2.5 rounded text-sm font-bold tracking-wide transition-all disabled:opacity-50 border border-red-900/50 shadow-lg"
            >
              {isRunning ? 'Analyzing Neural Behavior...' : 'Execute Test Case'}
            </button>
          </div>
        </div>

        {/* Histórico e Logs Ricos */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            Inspection Panel
            <span className="h-px bg-zinc-800 flex-1 ml-2"></span>
          </h2>
          <div className="space-y-6">
            {results.length === 0 && (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg text-zinc-600 text-sm italic">
                Awaiting telemetry data. Run a test to begin inspection.
              </div>
            )}
            
            {results.map((res) => (
              <div key={res.id} className="rounded-lg border bg-[#121214] border-zinc-800 overflow-hidden shadow-md transition-all">
                {/* Header do Resultado */}
                <div className={`p-4 flex justify-between items-center border-b border-zinc-800 ${res.passed ? 'bg-emerald-950/10' : 'bg-red-950/10'}`}>
                  <div className="flex gap-4 items-center">
                    <span className={`font-bold text-sm tracking-wide ${res.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                      {res.passed ? '✓ PASS' : `⚠ FAIL: ${res.errorType}`}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 flex gap-2">
                      <span className="text-blue-400">{res.model}</span>
                      <span className="text-zinc-600">|</span>
                      <span>{res.engine}</span>
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono text-zinc-500">
                    <span title="Creativity level">Temp: {res.temperature}</span>
                    <span title="Tokens consumed">Tokens: {res.tokensUsed}</span>
                    <span title="Response time" className={res.latency > 1500 ? 'text-orange-400' : ''}>{res.latency}ms</span>
                  </div>
                </div>
                
                {/* Área de Debug Dupla (Console + Payload) */}
                <div className="grid grid-cols-2 divide-x divide-zinc-800 bg-[#050505]">
                  {/* Console de Rastreio */}
                  <div className="p-5 font-mono text-xs text-zinc-400 overflow-x-auto">
                    <h3 className="text-zinc-500 mb-3 border-b border-zinc-800 pb-2 font-bold tracking-wider uppercase text-[10px]">Backend Trace</h3>
                    {res.consoleLogs.map((log, i) => (
                      <div key={i} className={`mb-1.5 ${log.includes('[ERROR]') || log.includes('[CRITICAL]') || log.includes('[ALERT]') ? 'text-red-400' : ''} ${log.includes('[SUCCESS]') ? 'text-emerald-400' : ''} ${log.includes('[SYSTEM]') ? 'text-blue-400' : ''}`}>
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* Visualizador de JSON/Payload */}
                  <div className="p-5 font-mono text-xs overflow-x-auto">
                     <h3 className="text-zinc-500 mb-3 border-b border-zinc-800 pb-2 font-bold tracking-wider uppercase text-[10px]">Simulated Payload</h3>
                     <pre className={`${res.passed ? 'text-emerald-300/90' : 'text-amber-500/90'} mt-2`}>
                       {JSON.stringify(res.simulatedPayload, null, 2)}
                     </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
