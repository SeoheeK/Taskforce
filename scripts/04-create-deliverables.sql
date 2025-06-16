-- 결과물 테이블
CREATE TABLE IF NOT EXISTS deliverables (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES taskforce_sessions(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  file_size INTEGER,
  file_type VARCHAR(50),
  created_by_persona_id INTEGER REFERENCES personas(id),
  category VARCHAR(100), -- 'document', 'design', 'code', 'report', 'presentation' 등
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'review', 'approved', 'final'
  version VARCHAR(20) DEFAULT '1.0',
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 결과물 기여자 테이블 (여러 전문가가 하나의 결과물에 기여할 수 있음)
CREATE TABLE IF NOT EXISTS deliverable_contributors (
  id SERIAL PRIMARY KEY,
  deliverable_id INTEGER REFERENCES deliverables(id),
  persona_id INTEGER REFERENCES personas(id),
  contribution_type VARCHAR(100), -- 'author', 'reviewer', 'editor', 'collaborator'
  contribution_description TEXT,
  hours_spent DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 결과물 댓글/피드백 테이블
CREATE TABLE IF NOT EXISTS deliverable_feedback (
  id SERIAL PRIMARY KEY,
  deliverable_id INTEGER REFERENCES deliverables(id),
  persona_id INTEGER REFERENCES personas(id),
  feedback_text TEXT NOT NULL,
  feedback_type VARCHAR(50) DEFAULT 'comment', -- 'comment', 'approval', 'revision_request'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 샘플 결과물 데이터
INSERT INTO deliverables (session_id, title, description, file_name, file_type, created_by_persona_id, category, status, version, tags) VALUES
(1, '모바일 앱 기획서', '새로운 헬스케어 모바일 앱의 전체 기획 문서', 'mobile_app_plan.pdf', 'pdf', 1, 'document', 'final', '2.1', ARRAY['기획서', '모바일앱', '헬스케어']),
(1, 'UI/UX 디자인 가이드', '앱의 사용자 인터페이스 및 경험 디자인 가이드라인', 'ui_ux_guide.figma', 'figma', 3, 'design', 'final', '1.5', ARRAY['디자인', 'UI', 'UX', '가이드라인']),
(1, '기술 아키텍처 문서', '앱 개발을 위한 기술 스택 및 아키텍처 설계서', 'tech_architecture.md', 'markdown', 2, 'document', 'approved', '1.0', ARRAY['기술문서', '아키텍처', '개발']),
(1, '시장 분석 리포트', '타겟 시장 및 경쟁사 분석 보고서', 'market_analysis.xlsx', 'excel', 4, 'report', 'final', '1.2', ARRAY['시장분석', '리포트', '경쟁사분석']),
(1, '프로젝트 최종 발표자료', '프로젝트 완료 및 성과 발표 자료', 'final_presentation.pptx', 'powerpoint', 1, 'presentation', 'final', '1.0', ARRAY['발표자료', '최종보고', '성과']);

-- 기여자 데이터
INSERT INTO deliverable_contributors (deliverable_id, persona_id, contribution_type, contribution_description, hours_spent) VALUES
(1, 1, 'author', '전체 기획서 작성 및 전략 수립', 24.5),
(1, 4, 'collaborator', '시장 조사 데이터 제공 및 분석', 8.0),
(2, 3, 'author', 'UI/UX 디자인 및 프로토타입 제작', 32.0),
(2, 1, 'reviewer', '디자인 검토 및 피드백 제공', 4.0),
(3, 2, 'author', '기술 아키텍처 설계 및 문서화', 16.5),
(4, 4, 'author', '시장 분석 및 리포트 작성', 20.0),
(4, 1, 'reviewer', '분석 결과 검토 및 전략적 해석', 6.0),
(5, 1, 'author', '발표자료 구성 및 작성', 12.0),
(5, 3, 'collaborator', '디자인 요소 및 시각화 지원', 6.0),
(5, 2, 'collaborator', '기술적 내용 검토', 3.0);
