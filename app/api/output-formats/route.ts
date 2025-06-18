"use client"

import { type NextRequest, NextResponse } from "next/server"

// 임시 데이터 (실제로는 데이터베이스 연결 필요)
const outputFormats = [
  {
    id: 1,
    name: "Markdown Document",
    description: "구조화된 텍스트 문서를 위한 마크다운 형식",
    file_extension: ".md",
    mime_type: "text/markdown",
    category: "document",
    template_structure: "# 제목\n\n## 개요\n\n내용...\n\n## 결론",
    validation_rules: ["제목 필수", "최소 100자", "마크다운 문법 준수"],
    example_output: "# 프로젝트 분석 보고서\n\n## 개요\n\n이 보고서는...",
    supports_versioning: true,
    is_binary: false,
  },
  {
    id: 2,
    name: "React Component",
    description: "���사용 가능한 React 컴포넌트 코드",
    file_extension: ".tsx",
    mime_type: "text/typescript",
    category: "code",
    template_structure:
      "import React from 'react';\n\ninterface Props {\n  // props 정의\n}\n\nexport const Component: React.FC<Props> = () => {\n  return (\n    <div>\n      {/* 컴포넌트 내용 */}\n    </div>\n  );\n};",
    validation_rules: ["TypeScript 문법", "Props 인터페이스 정의", "Export 필수"],
    example_output:
      "import React from 'react';\n\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n}\n\nexport const Button: React.FC<ButtonProps> = ({ label, onClick }) => {\n  return (\n    <button onClick={onClick}>\n      {label}\n    </button>\n  );\n};",
    supports_versioning: true,
    is_binary: false,
  },
  {
    id: 3,
    name: "JSON Data Model",
    description: "구조화된 데이터를 위한 JSON 형식",
    file_extension: ".json",
    mime_type: "application/json",
    category: "data",
    template_structure:
      '{\n  "metadata": {\n    "version": "1.0",\n    "created": "timestamp"\n  },\n  "data": {\n    // 실제 데이터\n  }\n}',
    validation_rules: ["유효한 JSON 구조", "메타데이터 포함", "스키마 준수"],
    example_output:
      '{\n  "metadata": {\n    "version": "1.0",\n    "created": "2024-01-15T10:30:00Z"\n  },\n  "data": {\n    "users": [\n      {\n        "id": 1,\n        "name": "John Doe",\n        "email": "john@example.com"\n      }\n    ]\n  }\n}',
    supports_versioning: true,
    is_binary: false,
  },
  {
    id: 4,
    name: "Flowchart Description",
    description: "프로세스나 워크플로우를 설명하는 텍스트 형식",
    file_extension: ".txt",
    mime_type: "text/plain",
    category: "document",
    template_structure: "시작 -> 단계1 -> 조건 분기 -> 단계2 -> 종료",
    validation_rules: ["명확한 시작점", "논리적 흐름", "명확한 종료점"],
    example_output:
      "사용자 로그인 프로세스:\n1. 시작\n2. 로그인 페이지 접속\n3. 이메일/비밀번호 입력\n4. 인증 확인\n   - 성공: 메인 페이지로 이동\n   - 실패: 오류 메시지 표시\n5. 종료",
    supports_versioning: false,
    is_binary: false,
  },
  {
    id: 5,
    name: "Slide Outline",
    description: "프레젠테이션 슬라이드의 구조와 내용 개요",
    file_extension: ".txt",
    mime_type: "text/plain",
    category: "document",
    template_structure: "슬라이드 1: 제목\n- 부제목\n- 주요 포인트\n\n슬라이드 2: 내용\n- 세부사항",
    validation_rules: ["슬라이드별 구분", "계층 구조", "핵심 메시지"],
    example_output:
      "슬라이드 1: 프로젝트 개요\n- 목표와 범위\n- 기대 효과\n\n슬라이드 2: 현황 분석\n- 현재 상황\n- 문제점 식별\n\n슬라이드 3: 해결 방안\n- 제안 사항\n- 구현 계획",
    supports_versioning: false,
    is_binary: false,
  },
]

export async function GET() {
  return NextResponse.json(outputFormats)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newOutputFormat = {
    id: outputFormats.length + 1,
    ...body,
  }
  outputFormats.push(newOutputFormat)
  return NextResponse.json(newOutputFormat, { status: 201 })
}
