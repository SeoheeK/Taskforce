"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Eye, EyeOff, Zap, Settings, Upload, Download, Plus, Edit, Copy, Trash2, ExternalLink } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("environment")
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})
  const [settings, setSettings] = useState({
    // 개인 정보
    name: "사용자",
    email: "user@example.com",
    bio: "",
    avatar: "",
    timezone: "Asia/Seoul",
    language: "ko",

    // API 키
    openaiKey: "sk-...",
    anthropicKey: "",
    googleKey: "",

    // 보안
    twoFactorEnabled: false,
    sessionTimeout: "24",
    loginNotifications: true,

    // 알림
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    weeklyReports: true,

    // 개인화
    theme: "light",
    sidebarCollapsed: false,
    defaultProjectView: "grid",
    autoSave: true,
  })

  const plans = [
    {
      name: "Free",
      price: "₩0",
      period: "월",
      features: ["기본 AI 페르소나 4개", "월 10개 태스크포스", "기본 분석", "커뮤니티 지원"],
      current: true,
    },
    {
      name: "Pro",
      price: "₩29,000",
      period: "월",
      features: [
        "무제한 AI 페르소나",
        "무제한 태스크포스",
        "고급 분석 및 리포트",
        "우선 지원",
        "커스텀 통합",
        "팀 협업 기능",
      ],
      current: false,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₩99,000",
      period: "월",
      features: ["Pro의 모든 기능", "전용 계정 관리자", "SSO 통합", "고급 보안", "온프레미스 배포", "24/7 전화 지원"],
      current: false,
    },
  ]

  const toggleApiKeyVisibility = (keyName: string) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [keyName]: !prev[keyName],
    }))
  }

  const handleSave = (section: string) => {
    console.log(`${section} 설정 저장됨:`, settings)
    // 실제로는 API 호출
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          이 프로젝트에 필요한 외부 API, 비공개 키, 자동화 설정 등을 환경변수로 관리합니다
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="environment" className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            환경 변수
          </TabsTrigger>
          <TabsTrigger value="api-integrations" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            API 연동
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            자동화
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            배포 설정
          </TabsTrigger>
        </TabsList>

        {/* 환경 변수 관리 */}
        <TabsContent value="environment">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>환경 변수</CardTitle>
                    <CardDescription>프로젝트에서 사용하는 환경 변수를 관리합니다</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variable
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="production" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="development">Development</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="production">Production</TabsTrigger>
                  </TabsList>

                  <TabsContent value="production" className="mt-4">
                    <div className="space-y-3">
                      {[
                        { key: "OPENAI_API_KEY", value: "sk-...", description: "OpenAI API 호출용 키" },
                        { key: "ANTHROPIC_API_KEY", value: "sk-ant-...", description: "Anthropic Claude API 키" },
                        { key: "NEXT_PUBLIC_ANALYTICS_ID", value: "G-...", description: "Google Analytics 추적 ID" },
                        { key: "WEBHOOK_URL", value: "https://...", description: "자동화 트리거용 웹훅 URL" },
                        { key: "SLACK_BOT_TOKEN", value: "xoxb-...", description: "Slack 봇 토큰" },
                        { key: "DATABASE_URL", value: "postgresql://...", description: "데이터베이스 연결 URL" },
                      ].map((env, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{env.key}</code>
                              <span className="text-sm text-gray-600">{env.description}</span>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                              <Input
                                type={showApiKeys[env.key] ? "text" : "password"}
                                value={env.value}
                                readOnly
                                className="font-mono text-sm"
                              />
                              <Button variant="outline" size="sm" onClick={() => toggleApiKeyVisibility(env.key)}>
                                {showApiKeys[env.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="text-center py-8 text-gray-500">
                      <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Preview 환경에 설정된 환경 변수가 없습니다.</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-2" />첫 번째 변수 추가
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="development" className="mt-4">
                    <div className="space-y-3">
                      {[
                        { key: "OPENAI_API_KEY", value: "sk-dev-...", description: "개발용 OpenAI API 키" },
                        {
                          key: "DATABASE_URL",
                          value: "postgresql://localhost...",
                          description: "로컬 데이터베이스 URL",
                        },
                      ].map((env, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{env.key}</code>
                              <span className="text-sm text-gray-600">{env.description}</span>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                              <Input
                                type={showApiKeys[env.key] ? "text" : "password"}
                                value={env.value}
                                readOnly
                                className="font-mono text-sm"
                              />
                              <Button variant="outline" size="sm" onClick={() => toggleApiKeyVisibility(env.key)}>
                                {showApiKeys[env.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Vercel CLI 명령어 가이드 */}
            <Card>
              <CardHeader>
                <CardTitle>Vercel CLI 명령어</CardTitle>
                <CardDescription>터미널에서 직접 환경 변수를 관리할 수 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div className="text-green-400 mb-2"># 환경 변수 추가</div>
                    <div>vercel env add OPENAI_API_KEY production</div>
                    <div className="text-green-400 mt-4 mb-2"># 환경 변수 목록 조회</div>
                    <div>vercel env ls</div>
                    <div className="text-green-400 mt-4 mb-2"># 환경 변수 제거</div>
                    <div>vercel env rm OPENAI_API_KEY production</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      명령어 복사
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Vercel 문서
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API 연동 관리 */}
        <TabsContent value="api-integrations">
          <Card>
            <CardHeader>
              <CardTitle>API 연동 상태</CardTitle>
              <CardDescription>외부 서비스와의 연동 상태를 확인하고 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "OpenAI", status: "connected", description: "GPT-4, DALL-E 3 사용 가능", icon: "🤖" },
                  { name: "Anthropic", status: "connected", description: "Claude 3.5 Sonnet 사용 가능", icon: "🧠" },
                  {
                    name: "Google Analytics",
                    status: "connected",
                    description: "사용자 분석 데이터 수집 중",
                    icon: "📊",
                  },
                  { name: "Slack", status: "disconnected", description: "팀 협업 알림 비활성화", icon: "💬" },
                  { name: "GitHub", status: "connected", description: "코드 저장소 연동 활성화", icon: "🐙" },
                ].map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{api.icon}</div>
                      <div>
                        <h3 className="font-medium">{api.name}</h3>
                        <p className="text-sm text-gray-600">{api.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={api.status === "connected" ? "default" : "secondary"}>
                        {api.status === "connected" ? "연결됨" : "연결 안됨"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {api.status === "connected" ? "설정" : "연결"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 자동화 설정 */}
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>자동화 설정</CardTitle>
              <CardDescription>프로젝트 워크플로우 자동화를 설정합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-deploy">자동 배포</Label>
                    <p className="text-sm text-gray-500">Git push 시 자동으로 배포를 실행합니다</p>
                  </div>
                  <Switch id="auto-deploy" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="slack-notifications">Slack 알림</Label>
                    <p className="text-sm text-gray-500">배포 완료 시 Slack으로 알림을 전송합니다</p>
                  </div>
                  <Switch id="slack-notifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-testing">자동 테스트</Label>
                    <p className="text-sm text-gray-500">배포 전 자동으로 테스트를 실행합니다</p>
                  </div>
                  <Switch id="auto-testing" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="performance-monitoring">성능 모니터링</Label>
                    <p className="text-sm text-gray-500">웹사이트 성능을 자동으로 모니터링합니다</p>
                  </div>
                  <Switch id="performance-monitoring" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 배포 설정 */}
        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>배포 설정</CardTitle>
              <CardDescription>Vercel 배포 관련 설정을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="build-command">빌드 명령어</Label>
                  <Input id="build-command" defaultValue="npm run build" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="output-directory">출력 디렉토리</Label>
                  <Input id="output-directory" defaultValue=".next" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="node-version">Node.js 버전</Label>
                  <Select defaultValue="18.x">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16.x">16.x</SelectItem>
                      <SelectItem value="18.x">18.x</SelectItem>
                      <SelectItem value="20.x">20.x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">배포 상태</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>마지막 배포:</span>
                      <span className="text-green-600">성공 (2분 전)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>도메인:</span>
                      <span className="text-blue-600">taskforce-ai.vercel.app</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Git 브랜치:</span>
                      <span>main</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  지금 배포하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
