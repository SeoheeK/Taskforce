import { type NextRequest, NextResponse } from "next/server"

// 임시 데이터 (실제로는 데이터베이스 연결 필요)
const projectTypes = [
  {
    id: 1,
    name: "모바일 앱 개발",
    description: "새로운 모바일 애플리케이션 기획부터 출시까지 전체 프로세스",
    icon: "📱",
    category: "development",
    difficulty_level: "high",
    estimated_duration: "2-3개월",
    suggested_experts: ["Technical Lead", "UX Designer", "Product Manager", "Quality Assurance"],
    required_skills: ["React Native", "UI/UX 디자인", "프로젝트 관리", "테스트"],
    typical_deliverables: ["앱 프로토타입", "기술 문서", "UI/UX 가이드", "테스트 리포트"],
    is_default: true,
  },
  {
    id: 2,
    name: "마케팅 캠페인",
    description: "브랜드 인지도 향상을 위한 통합 마케팅 전략 수립 및 실행",
    icon: "📢",
    category: "marketing",
    difficulty_level: "medium",
    estimated_duration: "1-2개월",
    suggested_experts: ["Marketing Specialist", "Data Analyst", "UX Designer", "Strategic Planner"],
    required_skills: ["디지털 마케팅", "데이터 분석", "크리에이티브 디자인", "전략 기획"],
    typical_deliverables: ["마케팅 전략서", "캠페인 소재", "성과 분석 리포트", "ROI 분석"],
    is_default: true,
  },
  {
    id: 3,
    name: "비즈니스 전략",
    description: "시장 분석 및 사업 전략 수립을 통한 비즈니스 성장 방안 도출",
    icon: "📊",
    category: "strategy",
    difficulty_level: "high",
    estimated_duration: "3-4주",
    suggested_experts: ["Strategic Planner", "Data Analyst", "Product Manager"],
    required_skills: ["시장 분석", "경쟁사 분석", "비즈니스 모델링", "전략 기획"],
    typical_deliverables: ["시장 분석 보고서", "사업 계획서", "경쟁사 분석", "전략 로드맵"],
    is_default: true,
  },
  {
    id: 4,
    name: "제품 출시",
    description: "신제품 런칭을 위한 종합적인 계획 수립 및 실행 전략",
    icon: "🚀",
    category: "product",
    difficulty_level: "high",
    estimated_duration: "1-2개월",
    suggested_experts: ["Product Manager", "Marketing Specialist", "Strategic Planner", "Quality Assurance"],
    required_skills: ["제품 기획", "마케팅", "품질 관리", "프로젝트 관리"],
    typical_deliverables: ["제품 기획서", "출시 계획서", "마케팅 전략", "품질 체크리스트"],
    is_default: true,
  },
  {
    id: 5,
    name: "데이터 분석 프로젝트",
    description: "비즈니스 데이터 분석을 통한 인사이트 도출 및 의사결정 지원",
    icon: "📈",
    category: "analytics",
    difficulty_level: "medium",
    estimated_duration: "2-3주",
    suggested_experts: ["Data Analyst", "Strategic Planner"],
    required_skills: ["데이터 분석", "통계", "시각화", "리포팅"],
    typical_deliverables: ["데이터 분석 리포트", "대시보드", "인사이트 요약", "권장사항"],
    is_default: true,
  },
]

export async function GET() {
  return NextResponse.json(projectTypes)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newProjectType = {
    id: projectTypes.length + 1,
    ...body,
    is_default: false,
  }
  projectTypes.push(newProjectType)
  return NextResponse.json(newProjectType, { status: 201 })
}
