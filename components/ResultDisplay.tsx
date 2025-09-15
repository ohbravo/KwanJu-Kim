import React, { useState, useEffect } from 'react';
import type { SurveyData } from '../types';
import { generateProposal } from '../services/geminiService';
import Header from './Header';
import { DownloadIcon, SparklesIcon } from './icons/Icons';

interface ResultDisplayProps {
  surveyData: SurveyData;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

const ADDIE_DESCRIPTIONS = {
    Analysis: "설문 결과를 바탕으로 조직의 현재 상황, 교육 목표, 학습자 특성을 분석하여 교육의 필요성과 방향성을 도출했습니다.",
    Design: "분석된 결과를 바탕으로 교육의 목표를 구체화하고, 학습 경험을 설계하며, 평가 전략을 수립하는 단계입니다. AI 제안서가 교육 설계의 청사진을 제공합니다.",
    Development: "설계된 청사진에 따라 실제 교육 콘텐츠와 자료를 개발하는 단계입니다. 제안된 커리큘럼을 바탕으로 강의안, 워크북, 시청각 자료 등을 제작할 수 있습니다.",
    Implementation: "개발된 교육 프로그램을 실제 학습자에게 전달하는 실행 단계입니다. 제안된 교육 방법을 참고하여 효과적인 강의 및 운영 전략을 수립해야 합니다.",
    Evaluation: "교육 프로그램의 효과를 체계적으로 측정하는 단계입니다. 제안된 평가 방안을 활용하여 교육의 성과를 확인하고 개선점을 도출할 수 있습니다.",
};

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">AI가 맞춤 교육 제안서를 생성 중입니다...</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">잠시만 기다려 주세요. 최적의 솔루션을 찾고 있습니다.</p>
    </div>
);

// AI가 생성한 마크다운 형식의 제안서를 시멘틱 HTML로 변환하는 함수
const processProposalHtml = (markdown: string): string => {
    if (!markdown) return '';

    // 마크다운 테이블을 찾아서 HTML 테이블로 먼저 변환합니다.
    const tableRegex = /^\|(.+)\|\r?\n\|( *[-:]+ *\|)+(\r?\n(\|(.*)\|))*$/gm;
    let processedText = markdown.replace(tableRegex, (table) => {
        const lines = table.trim().split('\n');
        const headerCells = lines[0].split('|').slice(1, -1).map(cell => cell.trim());
        const bodyRows = lines.slice(2);

        const thead = `<thead><tr class="bg-slate-100 dark:bg-slate-700">${headerCells.map(h => `<th class="p-2 border border-slate-300 dark:border-slate-600 font-semibold">${h}</th>`).join('')}</tr></thead>`;
        
        const tbody = `<tbody>${bodyRows.map(row => {
            const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
            return `<tr>${cells.map(c => `<td class="p-2 border border-slate-300 dark:border-slate-600">${c}</td>`).join('')}</tr>`;
        }).join('')}</tbody>`;

        return `<table class="w-full my-4 text-left border-collapse">${thead}${tbody}</table>`;
    });

    // 제목, 강조 등 나머지 마크다운을 변환합니다.
    processedText = processedText
        .replace(/---\n/g, '<hr class="my-6">\n')
        .replace(/### (.*?)\n/g, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>\n')
        .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-brand-blue mt-8 mb-4">$1</h2>\n')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
    // 변환되지 않은 나머지 텍스트 줄을 <p> 태그로 감싸줍니다.
    const finalHtml = processedText.split('\n').map(line => {
        const trimmed = line.trim();
        if (trimmed === '') return '';
        // 이미 HTML 태그로 변환된 줄은 그대로 둡니다.
        if (trimmed.startsWith('<h') || trimmed.startsWith('<hr') || trimmed.startsWith('<table')) {
            return trimmed;
        }
        return `<p>${trimmed}</p>`;
    }).join('');
    
    return finalHtml;
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ surveyData, theme, onThemeChange }) => {
  const [proposal, setProposal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setIsLoading(true);
        setError('');
        const result = await generateProposal(surveyData);
        setProposal(result);
      } catch (e) {
        setError('제안서 생성에 실패했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyData]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Header theme={theme} onThemeChange={onThemeChange} />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">진단 결과 및 맞춤 제안서</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">ADDIE 모형에 기반한 교육 방향성과 AI가 생성한 맞춤 제안서입니다.</p>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h3 className="text-2xl font-bold text-brand-blue mb-4">ADDIE 모델 기반 교육 방향성</h3>
            <div className="space-y-4">
                {Object.entries(ADDIE_DESCRIPTIONS).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex-shrink-0 w-16 h-16 bg-brand-blue text-white text-2xl font-bold rounded-full flex items-center justify-center">{key[0]}</div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{key}</h4>
                            <p className="text-slate-600 dark:text-slate-400">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center no-print">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="h-7 w-7 text-brand-orange" />
                    <h3 className="text-2xl font-bold text-brand-orange">AI 맞춤 교육 제안서</h3>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-colors text-sm"
                >
                  <DownloadIcon />
                  인쇄/PDF 저장
                </button>
            </div>
            <div className="p-6 md:p-8">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!isLoading && !error && (
                  <div className="prose prose-slate max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: processProposalHtml(proposal)
                    }}
                  />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ResultDisplay;