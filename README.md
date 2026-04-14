# PLAY SPOT Intro

플레이스팟 소개 페이지(React + Vite + Tailwind) 프로젝트입니다.

## 개발

- 설치: `pnpm install`
- 개발 서버: `pnpm run dev`
- 빌드: `pnpm run build`

## 최근 리팩토링 메모

동작/디자인은 유지하고 가독성·유지보수성 위주로 정리했습니다.

- `src/hooks/use-contact-form.ts`
  - 창업 문의 폼 상태/검증/제출/이메일 자동완성 로직 분리
  - `FooterSection` UI 파일의 복잡도 감소
- `src/components/CoreTechnology.tsx`
  - 머신 힌트(아이콘+비콘) 관련 상수/핸들러 분리
  - 모바일 토글/접근성 분기 가독성 개선
- `src/components/SmartManagementSection.tsx`
  - 목업 캐러셀 상수화(이미지 크기, aria 문구, 클래스)
  - 슬라이드 선택 로직 정리
- 메일 함수 정리
  - `functions/api/contact.ts`: payload 정규화/본문 생성 유틸 분리
  - `netlify/functions/contact.js`: 이메일 정규식/정규화/본문 생성 유틸 분리

## 코드 컨벤션 (요약)

### 주석

- **원칙:** 주석은 "무엇"보다 **"왜"**를 설명한다.
- **위치:** 큰 기능 블록/분기/성능·접근성 처리 지점에만 작성한다.
- **길이:** 1~2문장 이내로 짧게 유지한다.
- **금지:** 코드 그대로 읽으면 알 수 있는 설명(대입/반복 등)은 쓰지 않는다.
- **형식:** 한국어 기준으로 간결하게 작성하고, 동일 파일 내 문체를 통일한다.

### 상태/상수

- 반복되는 문자열/숫자/클래스는 파일 상단 `const`로 분리한다.
- UI 이벤트 핸들러는 가능한 한 의미 있는 함수명(`toggle*`, `handle*`)으로 분리한다.

### 리팩토링

- 기본 원칙은 **동작/디자인 불변**이다.
- 리팩토링 후에는 최소 `pnpm run build`로 회귀 확인한다.

## 문의 메일 관련 환경변수

Cloudflare Functions(`functions/api/contact.ts`) 기준:

- `RESEND_API_KEY` 또는 `RESEND_KEY`
- `MAIL_TO` (복수 가능: `,` 또는 `;` 구분)
- `MAIL_FROM` (예: `PLAY SPOT <contact@playspot.co.kr>`)

선택:

- `SITE_URL` / `PUBLIC_SITE_URL` (메일 로고/아이콘 URL 생성용)
- `MAIL_LOGO_URL` (직접 로고 URL 지정 시 우선)
