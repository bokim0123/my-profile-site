"use client"

import {
  Bell,
  ChevronDown,
  LogOut,
  Mail,
  Plus,
  Settings,
  Trash2,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const fruitItems = [
  { label: "사과", value: "apple" },
  { label: "바나나", value: "banana" },
  { label: "포도", value: "grape" },
]

// 쇼케이스 섹션 공통 래퍼
function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function ComponentShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section title="Button" description="variant / size / 아이콘 조합">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">XS</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="추가">
              <Plus />
            </Button>
            <Button variant="outline">
              <Mail data-icon="inline-start" /> 메일 보내기
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section title="Badge & Avatar">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>KM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JH</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>SY</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Section>

      <Section title="Form Controls" description="Input / Textarea / Select / Checkbox / Switch">
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="showcase-email">이메일</Label>
            <Input id="showcase-email" type="email" placeholder="name@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="showcase-message">메시지</Label>
            <Textarea id="showcase-message" placeholder="내용을 입력하세요" />
          </div>
          <div className="grid gap-2">
            <Label>과일 선택</Label>
            <Select items={fruitItems}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {fruitItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Label className="flex items-center gap-2">
              <Checkbox defaultChecked /> 약관 동의
            </Label>
            <Label className="flex items-center gap-2">
              <Switch /> 알림 수신
            </Label>
          </div>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">계정</TabsTrigger>
            <TabsTrigger value="password">비밀번호</TabsTrigger>
            <TabsTrigger value="notification">알림</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-4 text-sm text-muted-foreground">
            계정 정보를 관리하는 탭입니다.
          </TabsContent>
          <TabsContent value="password" className="pt-4 text-sm text-muted-foreground">
            비밀번호를 변경하는 탭입니다.
          </TabsContent>
          <TabsContent value="notification" className="pt-4 text-sm text-muted-foreground">
            알림 설정을 변경하는 탭입니다.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Dropdown Menu & Sheet">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              내 계정 <ChevronDown data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuItem>
                  <User /> 프로필
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings /> 설정
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut /> 로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Sheet 열기
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>프로필 편집</SheetTitle>
                <SheetDescription>변경 후 저장 버튼을 눌러주세요.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4">
                <div className="grid gap-2">
                  <Label htmlFor="sheet-name">이름</Label>
                  <Input id="sheet-name" defaultValue="홍길동" />
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => toast.success("저장되었습니다.")}>저장</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </Section>

      <Section title="Toast (sonner)">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast("기본 알림입니다.")}>
            <Bell data-icon="inline-start" /> 기본
          </Button>
          <Button variant="outline" onClick={() => toast.success("성공적으로 처리되었습니다.")}>
            성공
          </Button>
          <Button variant="outline" onClick={() => toast.error("오류가 발생했습니다.")}>
            오류
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("항목이 삭제되었습니다.", {
                icon: <Trash2 className="size-4" />,
                action: { label: "되돌리기", onClick: () => toast.info("복원되었습니다.") },
              })
            }
          >
            액션 포함
          </Button>
        </div>
      </Section>

      <Section title="Card & Separator">
        <Card size="sm">
          <CardHeader>
            <CardTitle>월간 리포트</CardTitle>
            <CardDescription>2026년 9월 요약</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">방문자</p>
              <p className="text-lg font-semibold">12,480</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <p className="text-muted-foreground">전환율</p>
              <p className="text-lg font-semibold">3.2%</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="secondary">자세히 보기</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Skeleton" description="데이터 로딩 중 표시">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </Section>
    </div>
  )
}
