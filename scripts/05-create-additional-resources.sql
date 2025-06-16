-- 메시지 유형 테이블
CREATE TABLE IF NOT EXISTS message_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '💬',
  category VARCHAR(50),
  priority_level VARCHAR(20) DEFAULT 'medium',
  response_required BOOLEAN DEFAULT false,
  typical_use_cases TEXT[],
  example_content TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 산출물 유형 테이블
CREATE TABLE IF NOT EXISTS output_formats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📄',
  file_extension VARCHAR(10),
  mime_type VARCHAR(100),
  category VARCHAR(50),
  template_structure TEXT,
  validation_rules TEXT[],
  typical_tools TEXT[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 협업 방식 테이블
CREATE TABLE IF NOT EXISTS interaction_modes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🧠',
  category VARCHAR(50),
  participant_limit INTEGER,
  decision_method VARCHAR(50),
  communication_flow TEXT,
  advantages TEXT[],
  best_use_cases TEXT[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 평가 메트릭 테이블
CREATE TABLE IF NOT EXISTS evaluation_metrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📊',
  category VARCHAR(50),
  measurement_type VARCHAR(50), -- 'quantitative', 'qualitative', 'binary'
  scale_min INTEGER DEFAULT 1,
  scale_max INTEGER DEFAULT 10,
  evaluation_criteria TEXT[],
  calculation_method TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 미션 유형 테이블
CREATE TABLE IF NOT EXISTS mission_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🎯',
  category VARCHAR(50),
  complexity_level VARCHAR(20) DEFAULT 'medium',
  estimated_duration VARCHAR(50),
  required_roles TEXT[],
  typical_deliverables TEXT[],
  success_criteria TEXT[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 역량/스킬 유형 테이블
CREATE TABLE IF NOT EXISTS role_capabilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🧬',
  category VARCHAR(50),
  skill_level VARCHAR(20) DEFAULT 'intermediate',
  prerequisite_skills TEXT[],
  related_tools TEXT[],
  output_types TEXT[],
  learning_resources TEXT[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 지식 자산 테이블
CREATE TABLE IF NOT EXISTS knowledge_assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📚',
  category VARCHAR(50),
  asset_type VARCHAR(50), -- 'document', 'dataset', 'tool', 'reference', 'api'
  file_path VARCHAR(500),
  access_url VARCHAR(500),
  version VARCHAR(20) DEFAULT '1.0',
  last_updated TIMESTAMP,
  access_level VARCHAR(20) DEFAULT 'public', -- 'public', 'restricted', 'private'
  tags TEXT[],
  related_capabilities TEXT[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 메시지 유형 데이터
INSERT INTO message_types (name, description, icon, category, response_required, typical_use_cases, example_content, is_default) VALUES
('Proposal', '새로운 아이디어나 해결책을 제안하는 메시지', '💡', 'communication', true, ARRAY['아이디어 제안', '해결책 제시', '개선안 제안'], '다음과 같은 방법을 제안합니다...', true),
('Response', '질문이나 요청에 대한 응답 메시지', '💬', 'communication', false, ARRAY['질문 답변', '요청 응답', '피드백 제공'], '귀하의 질문에 대한 답변은...', true),
('Feedback', '작업 결과나 아이디어에 대한 피드백', '📝', 'evaluation', false, ARRAY['작업 검토', '개선점 제시', '평가 의견'], '검토 결과 다음과 같은 개선점이 있습니다...', true),
('Report', '작업 진행 상황이나 결과를 보고하는 메시지', '📊', 'reporting', false, ARRAY['진행 보고', '결과 공유', '상태 업데이트'], '현재 작업 진행 상황을 보고드립니다...', true),
('Question', '정보나 의견을 요청하는 질문 메시지', '❓', 'inquiry', true, ARRAY['정보 요청', '의견 문의', '확인 질문'], '다음 사항에 대해 문의드립니다...', true),
('Assignment', '작업이나 역할을 할당하는 메시지', '📋', 'management', true, ARRAY['작업 할당', '역할 배정', '책임 부여'], '다음 작업을 할당합니다...', true);

-- 기본 산출물 유형 데이터
INSERT INTO output_formats (name, description, icon, file_extension, mime_type, category, template_structure, validation_rules, typical_tools, is_default) VALUES
('Markdown Document', '마크다운 형식의 문서', '📝', 'md', 'text/markdown', 'document', '# 제목\n## 섹션\n내용...', ARRAY['제목 필수', '구조화된 헤더'], ARRAY['Notion', 'Obsidian', 'Typora'], true),
('React Component', '리액트 컴포넌트 코드', '⚛️', 'tsx', 'text/typescript', 'code', 'export default function Component() {\n  return <div></div>\n}', ARRAY['JSX 문법', 'TypeScript 타입'], ARRAY['VS Code', 'WebStorm'], true),
('Flowchart Description', '플로우차트 설명 텍스트', '📊', 'txt', 'text/plain', 'diagram', '시작 -> 프로세스 -> 결정 -> 종료', ARRAY['논리적 흐름', '명확한 단계'], ARRAY['Mermaid', 'Draw.io'], true),
('Slide Outline', '프레젠테이션 슬라이드 개요', '📑', 'txt', 'text/plain', 'presentation', '슬라이드 1: 제목\n슬라이드 2: 내용...', ARRAY['논리적 구성', '핵심 메시지'], ARRAY['PowerPoint', 'Keynote'], true),
('JSON Data Model', 'JSON 형식의 데이터 모델', '🗃️', 'json', 'application/json', 'data', '{\n  "field": "value"\n}', ARRAY['유효한 JSON', '스키마 준수'], ARRAY['Postman', 'JSON Editor'], true);

-- 기본 협업 방식 데이터
INSERT INTO interaction_modes (name, description, icon, category, participant_limit, decision_method, communication_flow, advantages, best_use_cases, is_default) VALUES
('Turn-based', '순서대로 발언하는 협업 방식', '🔄', 'structured', 10, 'consensus', '순차적 발언 -> 의견 수렴 -> 결정', ARRAY['체계적 진행', '모든 의견 청취'], ARRAY['브레인스토밍', '의사결정 회의'], true),
('Free Conversation', '자유로운 대화 형식의 협업', '💭', 'flexible', 5, 'majority', '자유 발언 -> 실시간 토론 -> 합의', ARRAY['창의적 아이디어', '빠른 소통'], ARRAY['아이디어 발굴', '문제 해결'], true),
('Vote and Decide', '투표를 통한 의사결정 방식', '🗳️', 'democratic', 20, 'voting', '제안 -> 토론 -> 투표 -> 결정', ARRAY['민주적 결정', '명확한 결과'], ARRAY['정책 결정', '옵션 선택'], true),
('Leader Driven', '리더가 주도하는 협업 방식', '👑', 'hierarchical', 8, 'leader_decision', '리더 지시 -> 팀 실행 -> 보고', ARRAY['빠른 실행', '명확한 방향'], ARRAY['긴급 상황', '명확한 목표'], true);

-- 기본 평가 메트릭 데이터
INSERT INTO evaluation_metrics (name, description, icon, category, measurement_type, scale_min, scale_max, evaluation_criteria, calculation_method, is_default) VALUES
('Completeness', '작업의 완성도를 평가하는 지표', '✅', 'quality', 'quantitative', 0, 100, ARRAY['모든 요구사항 충족', '누락 항목 없음'], '완료된 항목 / 전체 항목 * 100', true),
('Relevance to Task', '작업과의 관련성을 평가하는 지표', '🎯', 'alignment', 'qualitative', 1, 5, ARRAY['목표와 일치', '요구사항 부합'], '전문가 평가 점수 평균', true),
('Creativity', '창의성을 평가하는 지표', '🎨', 'innovation', 'qualitative', 1, 10, ARRAY['독창적 아이디어', '혁신적 접근'], '창의성 평가 기준 적용', true),
('Technical Accuracy', '기술적 정확성을 평가하는 지표', '🔧', 'technical', 'quantitative', 0, 100, ARRAY['기술적 오류 없음', '표준 준수'], '오류 개수 기반 계산', true);

-- 기본 미션 유형 데이터
INSERT INTO mission_types (name, description, icon, category, complexity_level, estimated_duration, required_roles, typical_deliverables, success_criteria, is_default) VALUES
('Design New Feature', '새로운 기능을 설계하는 미션', '🎨', 'product', 'high', '2-3주', ARRAY['UX Designer', 'Product Manager', 'Technical Lead'], ARRAY['기능 명세서', '와이어프레임', '기술 설계서'], ARRAY['사용자 요구사항 충족', '기술적 실현 가능성'], true),
('Summarize User Feedback', '사용자 피드백을 요약하는 미션', '📋', 'analysis', 'medium', '3-5일', ARRAY['Data Analyst', 'UX Researcher'], ARRAY['피드백 요약 보고서', '개선점 제안'], ARRAY['핵심 인사이트 도출', '실행 가능한 제안'], true),
('Compare Strategies', '전략을 비교 분석하는 미션', '⚖️', 'strategy', 'high', '1-2주', ARRAY['Strategic Planner', 'Data Analyst'], ARRAY['비교 분석 보고서', '권장사항'], ARRAY['객관적 비교', '명확한 권장사항'], true),
('Competitor Analysis', '경쟁사를 분석하는 미션', '🔍', 'research', 'medium', '1주', ARRAY['Market Researcher', 'Strategic Planner'], ARRAY['경쟁사 분석 보고서', 'SWOT 분석'], ARRAY['포괄적 분석', '전략적 시사점'], true);

-- 기본 역량/스킬 유형 데이터
INSERT INTO role_capabilities (name, description, icon, category, skill_level, prerequisite_skills, related_tools, output_types, learning_resources, is_default) VALUES
('Write Spec Document', '기술 명세서 작성 능력', '📋', 'documentation', 'advanced', ARRAY['기술적 이해', '문서 작성'], ARRAY['Confluence', 'Notion'], ARRAY['기술 명세서', 'API 문서'], ARRAY['기술 문서 작성 가이드'], true),
('Critique Design', '디자인 비평 및 개선 제안 능력', '🎨', 'design', 'expert', ARRAY['디자인 원칙', '사용자 경험'], ARRAY['Figma', 'Sketch'], ARRAY['디자인 리뷰', '개선 제안서'], ARRAY['디자인 평가 기준'], true),
('Generate HTML Code', 'HTML 코드 생성 능력', '💻', 'development', 'intermediate', ARRAY['HTML 기초', 'CSS 이해'], ARRAY['VS Code', 'CodePen'], ARRAY['HTML 파일', '웹 컴포넌트'], ARRAY['HTML/CSS 튜토리얼'], true),
('Summarize Meeting Notes', '회의록 요약 능력', '📝', 'communication', 'intermediate', ARRAY['문서 이해', '요약 기술'], ARRAY['Notion', 'OneNote'], ARRAY['회의록 요약', '액션 아이템'], ARRAY['효과적 요약 기법'], true);

-- 기본 지식 자산 데이터
INSERT INTO knowledge_assets (name, description, icon, category, asset_type, file_path, access_url, version, last_updated, access_level, tags, related_capabilities, is_default) VALUES
('Style Guide', '브랜드 및 디자인 스타일 가이드', '🎨', 'design', 'document', '/assets/style_guide.pdf', 'https://company.com/style-guide', '2.1', CURRENT_TIMESTAMP, 'public', ARRAY['디자인', '브랜드', '가이드라인'], ARRAY['Critique Design', 'Generate HTML Code'], true),
('API Documentation', 'REST API 사용 가이드 문서', '📚', 'technical', 'reference', '/docs/api_reference.md', 'https://api.company.com/docs', '1.5', CURRENT_TIMESTAMP, 'public', ARRAY['API', '개발', '참조'], ARRAY['Write Spec Document', 'Generate HTML Code'], true),
('User Feedback Dataset', '사용자 피드백 데이터셋', '📊', 'data', 'dataset', '/data/user_feedback.csv', NULL, '1.0', CURRENT_TIMESTAMP, 'restricted', ARRAY['사용자', '피드백', '데이터'], ARRAY['Summarize Meeting Notes'], true),
('Design System Reference', '디자인 시스템 참조 자료', '🧩', 'design', 'reference', '/assets/design_system.figma', 'https://figma.com/design-system', '3.0', CURRENT_TIMESTAMP, 'public', ARRAY['디자인시스템', '컴포넌트'], ARRAY['Critique Design'], true);
