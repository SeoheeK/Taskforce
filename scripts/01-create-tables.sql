-- 페르소나 테이블
CREATE TABLE IF NOT EXISTS personas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 태스크포스 세션 테이블
CREATE TABLE IF NOT EXISTS taskforce_sessions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  problem_description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 대화 메시지 테이블
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES taskforce_sessions(id),
  persona_id INTEGER REFERENCES personas(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'chat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MCP 작업 테이블
CREATE TABLE IF NOT EXISTS mcp_tasks (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES taskforce_sessions(id),
  assigned_persona_id INTEGER REFERENCES personas(id),
  task_description TEXT NOT NULL,
  task_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
