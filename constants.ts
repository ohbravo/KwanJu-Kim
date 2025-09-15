
import type { SurveyStepConfig } from './types';

export const SURVEY_STEPS: SurveyStepConfig[] = [
  {
    id: 'step1',
    title: '1단계: 조직 진단',
    description: '현재 조직이 처한 상황과 교육의 필요성에 대해 파악합니다.',
    questions: [
      {
        id: 'q1',
        text: '현재 조직이 직면한 가장 큰 비즈니스 과제는 무엇인가요?',
        type: 'multiple-choice',
        options: ['시장 점유율 하락', '신규 사업 성장 동력 부재', '핵심 인재 이탈', '업무 생산성 저하', '기타'],
      },
      {
        id: 'q2',
        text: '교육을 통해 해결하고자 하는 구체적인 성과 목표는 무엇인가요?',
        type: 'text',
      },
      {
        id: 'q3',
        text: '교육이 가장 시급하게 필요한 핵심 직무나 직급은 어디인가요?',
        type: 'multiple-choice',
        options: ['신입사원', '실무자(주니어)', '중간관리자(시니어/팀장)', '임원', '전사 공통'],
      },
    ],
  },
  {
    id: 'step2',
    title: '2단계: 교육 목표 설정',
    description: '교육을 통해 달성하고자 하는 구체적인 목표(KSA)를 설정합니다.',
    questions: [
      {
        id: 'q1',
        text: '교육 후 참가자들이 어떤 지식(Knowledge)을 습득해야 하나요?',
        type: 'textarea',
      },
      {
        id: 'q2',
        text: '교육 후 참가자들이 어떤 기술(Skill)을 능숙하게 발휘해야 하나요?',
        type: 'textarea',
      },
      {
        id: 'q3',
        text: '교육 후 참가자들에게 어떤 태도(Attitude) 변화를 기대하나요?',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'step3',
    title: '3단계: 학습자 분석',
    description: '교육에 참여할 학습자들의 특성을 분석합니다.',
    questions: [
      {
        id: 'q1',
        text: '교육 대상의 평균 경력은 어느 정도인가요?',
        type: 'multiple-choice',
        options: ['1년 미만', '1~3년', '4~7년', '8~10년', '10년 이상'],
      },
      {
        id: 'q2',
        text: '대상자들의 현재 직무 역량 수준은 어떻다고 평가하시나요?',
        type: 'multiple-choice',
        options: ['기초 수준', '중급 수준', '고급 수준'],
      },
      {
        id: 'q3',
        text: '대상자들이 가장 선호하는 학습 방식은 무엇인가요?',
        type: 'multiple-choice',
        options: ['강의/이론 중심', '토론/사례 연구', '실습/워크숍', '온라인/마이크로러닝', '코칭/멘토링'],
      },
    ],
  },
  {
    id: 'step4',
    title: '4단계: 환경 분석',
    description: '교육을 실행하기 위한 조직의 환경적 요소를 점검합니다.',
    questions: [
      {
        id: 'q1',
        text: '교육에 활용 가능한 예산 범위는 어느 정도인가요?',
        type: 'multiple-choice',
        options: ['제한 없음', '충분함', '보통', '부족함'],
      },
      {
        id: 'q2',
        text: '교육에 투자할 수 있는 총 시간은 어느 정도인가요?',
        type: 'multiple-choice',
        options: ['4시간 이내', '1일 (8시간)', '2일 (16시간)', '3일 이상', '장기 과정 (1개월 이상)'],
      },
      {
        id: 'q3',
        text: '경영진의 교육에 대한 지원 수준은 어떻습니까?',
        type: 'multiple-choice',
        options: ['매우 적극적', '적극적', '보통', '소극적'],
      },
    ],
  },
];
