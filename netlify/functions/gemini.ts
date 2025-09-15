import { GoogleGenAI } from "@google/genai";
import type { SurveyData } from '../../types';
import { SURVEY_STEPS } from '../../constants';

// Netlify 함수 핸들러의 타입을 간단하게 정의합니다.
interface HandlerEvent {
  httpMethod: string;
  body: string | null;
}

interface HandlerResponse {
  statusCode: number;
  body: string;
  headers?: { [key: string]: string };
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatSurveyDataForPrompt(surveyData: SurveyData): string {
  let formattedString = "HRD 교육 니즈 진단 설문 결과:\n\n";

  SURVEY_STEPS.forEach(step => {
    formattedString += `**${step.title}**\n`;
    const stepAnswers = surveyData[step.id];
    if (stepAnswers) {
      step.questions.forEach(question => {
        const answer = stepAnswers[question.id] || "응답 없음";
        formattedString += `- ${question.text}\n  - 답변: ${answer}\n`;
      });
    }
    formattedString += "\n";
  });

  return formattedString;
}

const generatePrompt = (surveyData: SurveyData): string => {
    const formattedData = formatSurveyDataForPrompt(surveyData);
    return `
당신은 최고의 기업 교육(HRD) 컨설턴트입니다. 아래 제공된 교육 니즈 진단 설문 결과를 바탕으로, 전문적이고 실행 가능한 교육 프로그램 제안서를 작성해 주세요.

---
${formattedData}
---

**제안서 작성 가이드라인:**

다음 항목을 포함하여, 체계적이고 설득력 있는 제안서를 한국어로 작성해 주세요.

1.  **과정명 (안):** 설문 결과를 종합하여 교육의 핵심을 담은 매력적인 과정명 2~3개를 제안.
2.  **교육 목표:** 교육 후 학습자들이 달성해야 할 구체적이고 측정 가능한 목표(KSA)를 명확하게 제시.
3.  **교육 대상:** 설문 결과에 명시된 핵심 직무/직급을 바탕으로 구체화.
4.  **기대 효과:** 교육을 통해 조직의 비즈니스 과제 해결 및 성과 목표 달성에 어떻게 기여할 수 있는지 구체적으로 서술.
5.  **교육 커리큘럼 (초안):** 모듈, 주요 학습 내용, 교육 방법, 시간 배분을 포함한 표(테이블) 형식으로 상세하게 작성. 마크다운 테이블 형식을 사용.
6.  **교육 방법:** 학습자 선호도와 교육 목표를 고려한 가장 효과적인 교육 방법론 제안 (예: 워크숍, 액션러닝, 블렌디드 러닝 등).
7.  **평가 방안:** 교육 효과를 측정하기 위한 다각적인 평가 계획 제안 (예: 사전/사후 진단, 만족도 조사, 현업 적용도 평가 등).

전체적으로 전문가의 시각에서 깊이 있는 분석과 통찰력을 보여주세요.
`;
}


export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not configured in Netlify.");
    }
    
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Request body is empty' }) };
    }

    const { surveyData } = JSON.parse(event.body);
    if (!surveyData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing surveyData in request body' }),
      };
    }
    
    const prompt = generatePrompt(surveyData);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const proposalText = response.text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal: proposalText }),
    };

  } catch (error) {
    console.error('Error in Gemini function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to generate proposal. ${errorMessage}` }),
    };
  }
};
