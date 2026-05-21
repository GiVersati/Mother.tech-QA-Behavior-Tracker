import { TestCase, TestResult } from '../types';

export const runPromptTest = async (testCase: TestCase): Promise<TestResult> => {
  // Simulando variações de latência baseadas no modelo escolhido
  let baseLatency = testCase.targetModel === 'Claude 3.5 Sonnet' ? 800 : testCase.targetModel === 'Gemini 1.5 Pro' ? 600 : 1200;
  // O motor de debug de código costuma demorar mais por ser uma análise complexa
  if (testCase.targetEngine === 'CODE_DEBUGGER') baseLatency += 500; 
  
  const latency = Math.floor(Math.random() * 1000) + baseLatency;
  const tokensUsed = Math.floor(Math.random() * 250) + 45;
  
  // Vault e Code Debugger exigem temp baixa (precisão máxima), NPC exige alta
  const temperature = testCase.targetEngine === 'NPC_DIALOGUE' ? 0.8 : 0.1; 
  
  const logs: string[] = [];
  logs.push(`[SYSTEM] Initializing request to ${testCase.targetModel}...`);
  logs.push(`[SYSTEM] Routing to engine: ${testCase.targetEngine}`);
  logs.push(`[TRACE] Tokenizing prompt... (${tokensUsed} tokens mapped)`);
  logs.push(`[TRACE] Applying Mother.tech safety filters...`);

  // Análise de Injeção de Prompt e Vazamento de Dados (Foco no Vault)
  const maliciousKeywords = ['ignore', 'hack', 'bypass', 'system prompt', 'drop table', 'extract', 'password', 'key'];
  const isMalicious = maliciousKeywords.some(kw => testCase.prompt.toLowerCase().includes(kw));

  if (isMalicious) {
    logs.push(`[CRITICAL] Security layer breached. Keyword matched evasion patterns.`);
    
    // Se for o Vault, o erro é mais grave
    if (testCase.targetEngine === 'SKELETON_VAULT') {
      logs.push(`[ALERT] Vault Lockdown Initiated. Potential data exfiltration blocked.`);
      return {
        id: testCase.id, passed: false, engine: testCase.targetEngine, model: testCase.targetModel, latency, tokensUsed, temperature,
        errorType: 'VAULT_BREACH', consoleLogs: logs,
        simulatedPayload: { status: "LOCKED", error: "Unauthorized vault access attempt." }
      };
    }

    return {
      id: testCase.id, passed: false, engine: testCase.targetEngine, model: testCase.targetModel, latency, tokensUsed, temperature,
      errorType: 'PROMPT_INJECTION', consoleLogs: logs,
      simulatedPayload: { error: "Execution halted by safety orchestrator." }
    };
  }

  logs.push(`[TRACE] Generating output (Temperature: ${temperature})...`);

  // Simulando falhas baseadas no motor
  const hallucinationTrigger = Math.random() > 0.85; 
  const analysisFailureTrigger = Math.random() > 0.80; // 20% de chance da IA não entender o código
  
  if (hallucinationTrigger && testCase.targetEngine === 'NPC_DIALOGUE') {
    logs.push(`[ERROR] Context Bleed Detected: Model referenced data outside of game lore.`);
    return {
      id: testCase.id, passed: false, engine: testCase.targetEngine, model: testCase.targetModel, latency, tokensUsed, temperature,
      errorType: 'HALLUCINATION', consoleLogs: logs,
      simulatedPayload: { npc_name: "Arthur", dialogue: "I need to upgrade my laser blaster!", sentiment: "confused" }
    };
  }

  // Falha específica para o Code Debugger: IA não conseguiu encontrar o bug
  if (analysisFailureTrigger && testCase.targetEngine === 'CODE_DEBUGGER') {
    logs.push(`[WARN] AI failed to establish context. Fallback generic response triggered.`);
    return {
      id: testCase.id, passed: false, engine: testCase.targetEngine, model: testCase.targetModel, latency, tokensUsed, temperature,
      errorType: 'ANALYSIS_FAILED', consoleLogs: logs,
      simulatedPayload: { 
        status: "FAILED", 
        message: "Insufficient context to analyze the code. Please provide more surrounding logic or specific error logs." 
      }
    };
  }

  logs.push(`[SUCCESS] Output generated and formatted correctly.`);
  
  // Respostas baseadas no produto da empresa
  let successPayload;
  if (testCase.targetEngine === 'SKELETON_VAULT') {
    successPayload = { vault_status: "SECURE", operation: "Data Encrypted", encryption_hash: "0x8F9A...3B21" };
  } else if (testCase.targetEngine === 'NPC_DIALOGUE') {
    successPayload = { npc_name: "Gigi", dialogue: "Hello, traveler. What brings you here?", status: "idle" };
  } else if (testCase.targetEngine === 'CODE_DEBUGGER') {
    // Payload simulado de uma IA de Debugging encontrando um erro
    successPayload = {
      analysis_status: "COMPLETED",
      confidence_score: 0.94,
      detected_issues: [
        {
          type: "Unhandled Exception / Logic Flaw",
          severity: "HIGH",
          description: "Potential null pointer or missing asynchronous await in the execution flow."
        }
      ],
      suggested_solution: "Implement a try/catch block and verify if the AI response format is strictly parsed.",
      code_diff: "+\n+ try {\n+   const response = await ai.generate();\n+   parseData(response);\n+ } catch (error) {\n+   logger.error('Failed to parse AI output', error);\n+ }"
    };
  } else {
    successPayload = { action: "validate", status: 200, execution_time: latency };
  }

  return {
    id: testCase.id, passed: true, engine: testCase.targetEngine, model: testCase.targetModel, latency, tokensUsed, temperature,
    consoleLogs: logs, simulatedPayload: successPayload
  };
};
