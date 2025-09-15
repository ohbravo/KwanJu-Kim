import type { SurveyData } from '../types';

export async function generateProposal(surveyData: SurveyData): Promise<string> {
  try {
    // Google API를 직접 호출하는 대신, 우리의 백엔드 엔드포인트(Netlify Function)를 호출합니다.
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ surveyData }),
    });

    if (!response.ok) {
      // 서버 함수에서 보낸 구체적인 에러 메시지를 받아옵니다.
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.proposal;
  } catch (error) {
    console.error("Error fetching proposal from Netlify function:", error);
    if (error instanceof Error) {
        return `제안서 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. (오류: ${error.message})`;
    }
    return "제안서 생성 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
}
