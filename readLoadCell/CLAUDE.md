# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

**readLoadCell**은 산업용 자동화 장비에서 CAS 계열 로드셀 인디케이터(모델: CAS200 계열)와 RS485 시리얼 통신으로 무게 데이터를 실시간 수집하는 WinForms C# 프로그램이다.

### 핵심 기능
- **연결 관리**: RS485-to-USB 컨버터를 통한 일반 COM 포트로 인디케이터 연결/해제
- **실시간 무게 표시**: 연속 출력 모드에서 수신한 무게 데이터 실시간 표시
- **Zero(영점) 명령**: Operator가 영점 설정 버튼 제공
- **CSV 데이터 로깅**: 설정된 주기마다 무게값을 CSV 파일에 기록
- **Alarm/임계값 관리**: 상한/하한 임계값 설정, 초과 시 UI 색상 경고 및 로그 기록

### 기술 스택
- **.NET**: 8 (WinForms, self-contained 배포 지원)
- **언어**: C#
- **통신**: System.SerialPort (RS485, ASCII 프로토콜)
- **설정 저장**: appsettings.json

---

## 아키텍처 개요

프로젝트는 관심사별로 엄격히 분리되어 있다. 파싱 불확실성(아래 참고)으로 인해 프로토콜 파싱만 인터페이스 뒤로 격리했으며, 그 외는 불필요한 추상화를 도입하지 않는다.

### 계층 구조
```
MainForm (UI)
    ↓
LoadCellCommunication (SerialPort 래핑)
    ↓ [RawFrameReceived 이벤트]
    ├→ CasProtocolParser (ICasFrameParser 구현) → WeightReading
    ├→ RawFrameLogger (진단용 raw 데이터 기록)
    ├→ CsvDataLogger (주기적 무게 로깅)
    └→ AlarmEvaluator (상/하한 평가)
```

### 주요 클래스 책임

**Communication 계층** (`LoadCellCommunication`)
- SerialPort 열기/닫기, 설정 관리
- 원시 바이트 수신 및 버퍼 누적 (Partial/Multiple Packet 처리)
- 델리미터(CR/LF) 기준 완성 프레임 단위로 `RawFrameReceived` 이벤트 발행
- 포트 예외를 `CommunicationError` 이벤트로 전달 (앱 내구성 확보)

**Protocol 계층** (`ICasFrameParser` / `CasProtocolParser`)
- 원문 텍스트 프레임을 구조화된 `WeightReading` DTO로 파싱
- `TryParse()`는 절대 예외를 던지지 않고 bool + out 파라미터로 실패 전달
- 기존 `CasProtocolParser`는 추정 포맷(콤마 구분 ASCII)으로 구현, 실제 장비 연결 후 이 클래스만 교체 가능하도록 설계

**Logging 계층**
- `CsvDataLogger`: 설정된 주기(초)마다 최근 무게값을 CSV로 기록, 날짜별 파일 분리
- `RawFrameLogger`: 모든 수신 프레임(파싱 성공/실패 무관)을 raw 텍스트로 기록 — **프로토콜 검증/디버깅의 핵심**
- `AppLogger`: 일반 Info/Error 로그, 파일 I/O 예외 내부 처리

**Alarm 계층** (`AlarmEvaluator`)
- UI/통신에 의존하지 않는 순수 로직: 무게값과 상/하한을 비교해 `AlarmState` 산출
- 상태 전이 시에만 로그 기록 (매 프레임마다 로그하지 않음)

**설정 계층** (`AppSettings`)
- appsettings.json에서 포트명, 보레이트, 파리티, 임계값, 로깅 주기 등을 읽기/쓰기
- MainForm Load 시 로드, FormClosing 시 저장

---

## CAS 인디케이터 프로토콜 — 불확실성 및 대응 방안

### 현황

CAS CI-200 시리즈 공개 매뉴얼(ManualsLib)에서 확인한 사실:
- **COM 설정**: Baud Rate 600~38400 bps, Data bit 8, Stop bit 1, Parity None, ASCII
- **RS485**: Device ID 00~99 (F26 메뉴)로 멀티드롭 주소 설정 가능
- **Command Mode**: `Z CR`(Zero), `T CR`(Tare), `KG CR`(Gross 요청), `KN CR`(Net 요청)
- **"22 Bytes" 연속출력 포맷** 언급 있음 → **하지만 정확한 바이트별 구조(STX 위치, 상태필드, 부호, 자릿수, 소수점, 단위, 체크섬, 종료문자)는 공개 자료로 확인 불가**

### 대응 전략

1. **일반적인 CAS류 콤마구분 ASCII 포맷으로 우선 구현**
   - 추정 포맷: `"ST,GS,+  1234.5,kg\r\n"` (상태, 모드, 부호+무게, 단위)
   - 이 포맷은 많은 Asian 계열 무게계에서 사용되는 표준이므로 교육성 있음
   - 소스: `Protocol/CasProtocolParser.cs`

2. **프로토콜 파싱은 인터페이스 뒤로 격리**
   - `ICasFrameParser` 인터페이스 정의 → `CasProtocolParser` 구현체
   - 실제 장비 연결 후 프레임 포맷이 다르면 **구현체 내부 로직만 수정 가능**
   - MainForm은 인터페이스에만 의존하므로 변경 불필요

3. **Raw 데이터 로깅이 검증의 핵심**
   - `RawFrameLogger`로 모든 수신 프레임을 원문 그대로 `Logs/rawlog_yyyyMMdd.txt`에 기록
   - 실제 장비 연결 시 raw 로그를 확인하여 추정 포맷과 실제 포맷의 차이 파악
   - 차이 발견 시 `CasProtocolParser`의 파싱 로직만 수정 + 재검증

4. **매뉴얼 확보 시**
   - 매뉴얼을 `docs/protocol-notes.md`에 정리
   - `CasProtocolParser` 구현 근거 문서화

---

## 빌드 및 실행

### 프로젝트 생성 (첫 회)

```bash
# .NET 8 WinForms 프로젝트 및 솔루션 생성
dotnet new sln -n readLoadCell
dotnet new winforms -n readLoadCell -f net8.0
dotnet sln readLoadCell.sln add readLoadCell/readLoadCell.csproj
```

### 빌드

```bash
# 디버그 빌드
dotnet build readLoadCell.sln

# 릴리스 빌드
dotnet build -c Release readLoadCell.sln
```

### 실행

```bash
# 콘솔에서 직접 실행
dotnet run --project readLoadCell

# 또는 Visual Studio에서 F5
```

---

## 개발 및 테스트

### 개발 환경 설정

**com0com (가상 시리얼 포트 페어) 설치**
- Windows 환경에서 실제 하드웨어 없이 SerialPort 통신을 테스트하려면 필수
- 다운로드: https://sourceforge.net/projects/com0com/
- 설정: COM10 ↔ COM11 가상 포트 페어 생성
  - COM10: 시뮬레이터가 수신 대기
  - COM11: readLoadCell 앱이 연결

### 시뮬레이터 (CasLoadCellSimulator)

`Simulator/CasLoadCellSimulator.cs`: CAS 프레임을 시뮬레이션하는 콘솔 또는 간단한 폼 앱
- com0com의 COM10에 연결하여 주기적으로 추정 포맷 프레임 송신
- 정상 프레임 외에도 다음 비정상 케이스 재현 가능:
  - **Partial Packet**: 델리미터 없이 전송, 다음 틱에 나머지 송신
  - **Multiple Packet**: 프레임 2~3개를 한 번에 붙여 송신
  - **쓰레기 데이터**: 알 수 없는 바이트열 주입
  - **무게 변화**: 증가/감소/노이즈 시뮬레이션

### 테스트 절차

**단계 1: 통신 레이어 검증**
```bash
# com0com 설정 확인
# NET VIEW \\computername 또는 Device Manager에서 COM10/COM11 확인

# 시뮬레이터 실행 (별도 콘솔)
dotnet run --project readLoadCell -- --simulator

# readLoadCell 앱 실행, COM11 선택 후 연결
# → 무게값이 주기적으로 갱신되는지 확인
```

**단계 2: 파싱 검증**
- 진단 패널의 "Raw 프레임 표시" TextBox에서 수신된 원문 프레임 확인
- `Logs/rawlog_*.txt`에서 실제 프레임 포맷 확인
- 파싱 실패 프레임이 와도 앱이 죽지 않는지 확인

**단계 3: Alarm 검증**
- 시뮬레이터에서 상한값을 초과하는 무게 송신
- UI Alarm Label이 빨강으로 바뀌고 텍스트가 "상한 초과"로 표시되는지 확인
- CSV 로그의 `AlarmState` 컬럼이 올바르게 기록되는지 확인

**단계 4: 엣지 케이스 검증**
- 시뮬레이터에서 Partial/Multiple/쓰레기 프레임 순차 송신
- 앱이 강제 종료되지 않고 원정상 프레임만 파싱되는지 확인
- 파싱 실패 카운트가 증가하는지 확인

### 실제 장비 테스트 (최종 단계)

1. CAS200 인디케이터를 RS485-to-USB 컨버터를 통해 PC에 연결
2. readLoadCell 앱의 COM 포트 선택에서 해당 포트 선택 후 연결
3. `Logs/rawlog_*.txt`에서 **실제 프레임 포맷 캡처**
4. 추정 포맷과의 차이 확인:
   - STX/ETX 위치
   - 필드별 순서 및 구분자
   - 체크섬 유무
   - 소수점 위치, 부호 표현법 등
5. `CasProtocolParser`의 파싱 로직 수정 후 재검증

---

## 개발 시 주의사항

### SerialPort 버퍼 및 Partial Packet 처리

`LoadCellCommunication.DataReceived` 핸들러에서:
- **절대하지 말 것**: 한 이벤트에서 모든 바이트가 들어온다고 가정하지 말 것
- **해야 할 것**: `ReadExisting()`으로 읽은 바이트를 StringBuilder 버퍼에 누적, 델리미터 검색 후 완성 프레임만 추출
- **Multiple Packet 처리**: 버퍼에 여러 프레임이 있으면 `while` 루프로 모두 추출
- **버퍼 오버플로우 방지**: 델리미터 없이 계속 누적되면 4096바이트 상한에서 로그 남기고 초기화

### 스레드 안전성

- `DataReceived`는 ThreadPool 스레드에서 호출됨 → UI 컨트롤 직접 접근 금지
- MainForm의 이벤트 핸들러에서 반드시 `InvokeRequired` 체크 후 `BeginInvoke` 사용:
  ```csharp
  private void OnRawFrameReceived(object sender, string rawFrame)
  {
      if (InvokeRequired) { BeginInvoke(new Action(() => OnRawFrameReceived(sender, rawFrame))); return; }
      // 이 아래부터 UI 스레드 안전
  }
  ```

### 예외 처리

- `LoadCellCommunication`: 포트 예외(`IOException`, `UnauthorizedAccessException` 등)를 catch → `CommunicationError` 이벤트 발행, 앱 종료 금지
- `CasProtocolParser.TryParse()`: 절대 예외 던지지 않음 → bool + out 파라미터로 실패 전달
- 파일 쓰기 (`CsvDataLogger`, `RawFrameLogger`): 디스크 꽉참 등의 예외를 내부에서 흡수, 상태바/로그에만 기록
- 일반적인 `catch {}` (catch all) 형태 금지, 구체적 예외 타입 지정

### 로그 기록

- **AppLogger**: 상태 전이, 포트 오류, 파싱 실패 등 의미 있는 사건만 기록
  - 예: `[2026-08-21 14:30:15] [INFO] 포트 COM11 연결됨 (38400 bps)`
  - 매 프레임마다 로그하지 말 것 (파일 폭증 방지)
- **RawFrameLogger**: 모든 수신 프레임을 그대로 기록 (프로토콜 검증용)
- **CsvDataLogger**: 설정된 주기마다 최근 무게값만 기록 (연속출력 시 파일 폭증 방지)

### Zero/Tare 명령 송신

- `LoadCellCommunication.SendCommand("Z")`는 half-duplex 송신
- 연속출력 모드에서 명령과 응답이 섞여 들어올 수 있음 (실측 필요)
- UI에서 버튼 클릭 후 즉시 Disable, 응답/타임아웃 후 재Enable하여 중복 실행 방지

### UI 반응성

- 무게 표시는 대형 폰트(32pt 이상)로 현장에서 멀리서도 가시성 확보
- Alarm 상태는 색상으로 즉시 인지 가능하게 (빨강=상한초과, 주황=하한미달)
- Blink 애니메이션은 지양 (산업 환경에서 눈 피로 유발)
- 연결/설정 변경 중에는 관련 컨트롤 Disable

---

## 프로젝트 상태 및 구현 체크리스트

### 완료
- [x] 아키텍처 설계 및 계획 (이 문서 기반)
- [x] 프로토콜 분석 및 불확실성 파악
- [x] 시뮬레이터 테스트 전략 수립

### 진행 중 / 예정
- [ ] 프로젝트 뼈대 생성 (.sln, .csproj, 폴더 구조)
- [ ] `LoadCellCommunication` 구현 (버퍼 누적/델리미터 파싱)
- [ ] `CasLoadCellSimulator` 구현
- [ ] Protocol 계층 (`ICasFrameParser`, `CasProtocolParser`, `WeightReading`)
- [ ] MainForm UI 연동
- [ ] Zero 명령 송신
- [ ] Logging 계층 (CSV, Raw, AppLogger)
- [ ] Alarm 계층
- [ ] 설정 영속화 (AppSettings)
- [ ] 엣지 케이스 강화 테스트
- [ ] 실제 CAS200 장비 연결 및 프로토콜 검증
- [ ] 프로토콜 문서화 (docs/protocol-notes.md)

---

## 참고

- **전역 CLAUDE.md** (`~/.claude/CLAUDE.md`): C# 코딩 스타일, 산업 프로그램 개발 원칙, SerialPort/Thread 안전성 등 전반적 지침
- **계획 문서**: `.claude/plans/winform-c-cryptic-wave.md` (이 프로젝트의 상세 설계)
- **com0com**: https://sourceforge.net/projects/com0com/ (가상 시리얼 포트 테스트 환경)
