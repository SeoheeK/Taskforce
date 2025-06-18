"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react"
import Image from "next/image"

const slogans = [
  "AI 팀원들과 문제를 해결해보세요",
  "당신의 문제에 딱 맞는 AI 전문가를 구성하세요",
  "협업하는 AI, 이제는 혼자가 아닙니다",
  "AI와 함께 더 나은 결정을 만들어보세요",
  "각기 다른 역할, 하나의 목표",
  "생각하는 에이전트들이 팀이 됩니다",
  "아이디어만 주세요, 나머지는 AI가 처리합니다",
  "여러 명의 AI가 머리를 맞대는 순간",
  "팀 빌딩? 이제는 AI로",
  "Mission accepted. AI 팀이 곧바로 출동합니다",
]

export default function HomePage() {
  const router = useRouter()
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 상태
  const [isSliding, setIsSliding] = useState(false) // 슬라이딩 애니메이션 상태

  // 로그인 상태 확인 (실제로는 JWT 토큰이나 세션 확인)
  useEffect(() => {
    // 임시로 localStorage에서 로그인 상태 확인
    const loginStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loginStatus)
  }, [])

  const handleStartNewProject = () => {
    if (!isLoggedIn) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push("/login")
      return
    }

    // 로그인된 경우 슬라이딩 애니메이션과 함께 새 프로젝트 페이지로 이동
    setIsSliding(true)
    setTimeout(() => {
      router.push("/taskforce/new")
    }, 500) // 애니메이션 시간과 맞춤
  }

  const features = [
    {
      image: "/images/ai-personas.png",
      title: "AI 페르소나 구성",
      description: "다양한 전문 분야의 AI 페르소나를 선택하여 최적의 팀을 구성하세요",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      image: "/images/mission-collaboration.png",
      title: "미션 기반 협업",
      description: "명확한 목표와 역할 분담으로 효율적인 문제 해결을 경험하세요",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      image: "/images/intelligent-interaction.png",
      title: "지능형 상호작용",
      description: "AI들이 서로 토론하고 협력하여 최상의 결과를 도출합니다",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      image: "/images/real-time-collaboration.png",
      title: "실시간 협업",
      description: "AI 팀원들의 작업 과정을 실시간으로 모니터링하고 참여하세요",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % slogans.length)
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-transform duration-500 ${
        isSliding ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Title with Handwriting Font */}
            <h1 className="text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Taskforce
              </span>
            </h1>

            {/* Animated Slogan */}
            <div className="h-16 flex items-center justify-center mb-4">
              <p
                className={`text-2xl text-gray-700 max-w-3xl transition-all duration-300 ${
                  isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
                }`}
              >
                {slogans[currentSloganIndex]}
              </p>
            </div>

            {/* Main CTA Button */}
            <div className="mb-6">
              <Button
                size="lg"
                onClick={handleStartNewProject}
                disabled={isSliding}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  isSliding ? "animate-pulse" : ""
                }`}
              >
                {isSliding ? "Starting..." : "Start New AI Team Project"}
                <ArrowRight className={`ml-3 h-6 w-6 transition-transform ${isSliding ? "translate-x-2" : ""}`} />
              </Button>
            </div>

            {/* Auth Buttons */}
            <div className="flex justify-center gap-6 mb-16">
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/login")}
                    className="text-gray-600 hover:text-blue-600 text-lg underline-offset-4 hover:underline"
                  >
                    Log In
                  </Button>
                  <span className="text-gray-400 text-lg">|</span>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/signup")}
                    className="text-gray-600 hover:text-purple-600 text-lg underline-offset-4 hover:underline"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-medium">✓ Logged in</span>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      localStorage.removeItem("isLoggedIn")
                      setIsLoggedIn(false)
                    }}
                    className="text-gray-600 hover:text-red-600 text-lg underline-offset-4 hover:underline"
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">AI 협업의 새로운 경험</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            다양한 전문성을 가진 AI 페르소나들이 팀을 이루어 복잡한 문제를 해결합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-8 overflow-hidden rounded-3xl">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20`}></div>
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Quick Access Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">지금 바로 시작해보세요</h2>
            <p className="text-xl text-white/80 mb-12">강력한 AI 협업 도구들을 경험해보세요</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/personas" className="group">
                <Card className="bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">AI 페르소나</h3>
                    <p className="text-white/90 leading-relaxed">전문가 AI들을 만나보세요</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/resource" className="group">
                <Card className="bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Zap className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">리소스 관리</h3>
                    <p className="text-white/90 leading-relaxed">협업 도구들을 설정하세요</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/deliverables" className="group">
                <Card className="bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">성과물</h3>
                    <p className="text-white/90 leading-relaxed">완성된 결과물을 확인하세요</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">AI 협업 플랫폼 Taskforce</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            지능형 에이전트들과 함께하는 협업의 미래를 경험해보세요. 복잡한 문제도 AI 팀과 함께라면 간단해집니다.
          </p>
          <p className="text-sm text-gray-500">© 2024 Taskforce. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
