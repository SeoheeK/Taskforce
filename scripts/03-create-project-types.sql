-- 프로젝트 유형 테이블
CREATE TABLE IF NOT EXISTS project_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📋',
  category VARCHAR(50),
  difficulty_level VARCHAR(20) DEFAULT 'medium',
  estimated_duration VARCHAR(50),
  suggested_experts TEXT[], -- 추천 전문가 역할들
  required_skills TEXT[], -- 필요한 스킬들
  typical_deliverables TEXT[], -- 일반적인 결과물들
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 프로젝트 유형 데이터
INSERT INTO project_types (name, description, icon, category, difficulty_level, estimated_duration, suggested_experts, required_skills, typical_deliverables, is_default) VALUES
(
  '모바일 앱 개발',
  '새로운 모바일 애플리케이션 기획부터 출시까지 전체 프로세스',
  '📱',
  'development',
  'high',
  '2-3개월',
  ARRAY['Technical Lead', 'UX Designer', 'Product Manager', 'Quality Assurance'],
  ARRAY['React Native', 'UI/UX 디자인', '프로젝트 관리', '테스트'],
  ARRAY['앱 프로토타입', '기술 문서', 'UI/UX 가이드', '테스트 리포트'],
  true
),
(
  '마케팅 캠페인',
  '브랜드 인지도 향상을 위한 통합 마케팅 전략 수립 및 실행',
  '📢',
  'marketing',
  'medium',
  '1-2개월',
  ARRAY['Marketing Specialist', 'Data Analyst', 'UX Designer', 'Strategic Planner'],
  ARRAY['디지털 마케팅', '데이터 분석', '크리에이티브 디자인', '전략 기획'],
  ARRAY['마케팅 전략서', '캠페인 소재', '성과 분석 리포트', 'ROI 분석'],
  true
),
(
  '비즈니스 전략',
  '시장 분석 및 사업 전략 수립을 통한 비즈니스 성장 방안 도출',
  '📊',
  'strategy',
  'high',
  '3-4주',
  ARRAY['Strategic Planner', 'Data Analyst', 'Product Manager'],
  ARRAY['시장 분석', '경쟁사 분석', '비즈니스 모델링', '전략 기획'],
  ARRAY['시장 분석 보고서', '사업 계획서', '경쟁사 분석', '전략 로드맵'],
  true
),
(
  '제품 출시',
  '신제품 런칭을 위한 종합적인 계획 수립 및 실행 전략',
  '🚀',
  'product',
  'high',
  '1-2개월',
  ARRAY['Product Manager', 'Marketing Specialist', 'Strategic Planner', 'Quality Assurance'],
  ARRAY['제품 기획', '마케팅', '품질 관리', '프로젝트 관리'],
  ARRAY['제품 기획서', '출시 계획서', '마케팅 전략', '품질 체크리스트'],
  true
),
(
  '데이터 분석 프로젝트',
  '비즈니스 데이터 분석을 통한 인사이트 도출 및 의사결정 지원',
  '📈',
  'analytics',
  'medium',
  '2-3주',
  ARRAY['Data Analyst', 'Strategic Planner'],
  ARRAY['데이터 분석', '통계', '시각화', '리포팅'],
  ARRAY['데이터 분석 리포트', '대시보드', '인사이트 요약', '권장사항'],
  true
);
