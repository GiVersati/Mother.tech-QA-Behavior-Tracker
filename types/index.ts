export type AIEngine = 'NPC_DIALOGUE' | 'SKELETON_VAULT' | 'SYSTEM_LOGIC' | 'CODE_DEBUGGER';
export type AIModel = 'Claude 3.5 Sonnet' | 'Gemini 1.5 Pro' | 'GPT-4o';

export interface TestCase {
  id: string;
  targetEngine: AIEngine;
  targetModel: AIModel;
  prompt: string;
  maxLatencyMs: number;
}

export interface TestResult {
  id: string;
  passed: boolean;
  engine: AIEngine;
  model: AIModel;
  latency: number;
  tokensUsed: number;
  temperature: number;
  errorType?: 'HALLUCINATION' | 'PROMPT_INJECTION' | 'TIMEOUT' | 'FORMAT_BREAK' | 'VAULT_BREACH' | 'ANALYSIS_FAILED';
  consoleLogs: string[];
  simulatedPayload: unknown; // Corrigido de 'any' para 'unknown' para respeitar as regras do ESLint
}
