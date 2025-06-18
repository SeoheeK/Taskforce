import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, background, currentSituation, keyIssues, objectives, quantitativeKPIs, qualitativeKPIs, template } =
      await request.json()

    // 실제 AI API 호출 대신 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 템플릿 기반 전략 생성
    const strategies = {
      "mobile-app": {
        approachStrategy: `모바일 앱 개발을 위한 애자일 방법론을 적용하여 단계적으로 접근합니다. 
        1) 사용자 리서치 및 요구사항 분석 
        2) MVP(최소 기능 제품) 설계 및 개발 
        3) 사용자 테스트 및 피드백 수집 
        4) 반복적 개선 및 기능 확장 
        5) 앱스토어 출시 및 마케팅 전략 실행`,
        challenges: `기술적 복잡성, 플랫폼 호환성, 사용자 경험 최적화, 성능 최적화, 보안 이슈, 앱스토어 승인 과정`,
        resourcesNeeded: `모바일 개발자(iOS/Android), UI/UX 디자이너, 백엔드 개발자, QA 엔지니어, 프로젝트 매니저, 개발 도구 및 테스트 디바이스`,
      },
      "marketing-campaign": {
        approachStrategy: `통합 마케팅 커뮤니케이션(IMC) 전략을 통해 다채널 접근을 실행합니다. 
        1) 타겟 오디언스 세분화 및 페르소나 정의 
        2) 브랜드 메시지 및 크리에이티브 컨셉 개발 
        3) 디지털 및 오프라인 채널 믹스 최적화 
        4) 콘텐츠 마케팅 및 소셜미디어 전략 
        5) 성과 측정 및 최적화`,
        challenges: `예산 효율성, 채널 간 일관성 유지, 타겟 오디언스 도달, 경쟁사 대응, 성과 측정의 복잡성`,
        resourcesNeeded: `마케팅 전략가, 크리에이티브 디렉터, 디지털 마케터, 콘텐츠 크리에이터, 데이터 분석가, 광고 플랫폼 및 분석 도구`,
      },
      "business-strategy": {
        approachStrategy: `체계적인 전략 수립 프로세스를 통해 비즈니스 목표를 달성합니다. 
        1) 시장 및 경쟁 환경 분석 
        2) 내부 역량 및 자원 평가 
        3) SWOT 분석 및 전략적 옵션 도출 
        4) 실행 계획 및 로드맵 수립 
        5) KPI 설정 및 모니터링 체계 구축`,
        challenges: `시장 불확실성, 내부 저항, 자원 제약, 실행력 부족, 외부 환경 변화 대응`,
        resourcesNeeded: `전략 컨설턴트, 시장 분석가, 재무 전문가, 프로젝트 매니저, 분석 도구 및 시장 데이터`,
      },
      "product-launch": {
        approachStrategy: `성공적인 제품 출시를 위한 단계별 런칭 전략을 실행합니다. 
        1) 시장 준비도 및 경쟁 분석 
        2) 제품 포지셔닝 및 가격 전략 수립 
        3) 런칭 캠페인 및 PR 전략 개발 
        4) 유통 채널 및 파트너십 구축 
        5) 출시 후 모니터링 및 최적화`,
        challenges: `시장 타이밍, 경쟁사 대응, 유통 채널 확보, 초기 수요 예측, 품질 관리`,
        resourcesNeeded: `제품 매니저, 마케팅 전문가, 영업 팀, PR 전문가, 품질 관리자, 런칭 예산 및 마케팅 도구`,
      },
      custom: {
        approachStrategy: `프로젝트의 고유한 특성을 고려한 맞춤형 접근 방식을 개발합니다. 
        1) 프로젝트 범위 및 목표 명확화 
        2) 이해관계자 분석 및 요구사항 수집 
        3) 위험 요소 식별 및 대응 방안 수립 
        4) 단계별 실행 계획 및 마일스톤 설정 
        5) 지속적 모니터링 및 개선`,
        challenges: `불확실성 관리, 범위 변경, 이해관계자 조율, 품질 보장, 일정 관리`,
        resourcesNeeded: `프로젝트 매니저, 도메인 전문가, 분석가, 개발자, 필요한 도구 및 기술 스택`,
      },
    }

    const selectedStrategy = strategies[template as keyof typeof strategies] || strategies.custom

    // 입력된 내용을 바탕으로 전략 커스터마이징
    const customizedStrategy = { ...selectedStrategy }

    if (background.includes("AI") || background.includes("인공지능")) {
      customizedStrategy.approachStrategy += "\n\nAI 기술 도입을 통한 혁신적 접근을 포함하여 경쟁 우위를 확보합니다."
      customizedStrategy.resourcesNeeded += ", AI/ML 전문가, 데이터 사이언티스트"
    }

    if (objectives.includes("글로벌") || objectives.includes("해외")) {
      customizedStrategy.challenges += ", 글로벌 시장 진출, 현지화, 규제 대응"
      customizedStrategy.resourcesNeeded += ", 글로벌 마케팅 전문가, 현지화 전문가"
    }

    return NextResponse.json(customizedStrategy)
  } catch (error) {
    console.error("전략 생성 오류:", error)
    return NextResponse.json(
      {
        approachStrategy: "프로젝트 목표 달성을 위한 체계적인 접근 방식을 수립하겠습니다.",
        challenges: "일정 관리, 품질 보장, 리소스 최적화 등의 과제가 예상됩니다.",
        resourcesNeeded: "프로젝트 관리 도구, 전문 인력, 기술적 리소스가 필요합니다.",
      },
      { status: 200 },
    )
  }
}
