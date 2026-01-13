# Study Python (studycoding.kr)

> 파이썬 학습 플랫폼
> 최초 작성일: 2026-01-12
> 최종 수정일: 2026-01-13

---

## 프로젝트 목적

### 왜 이 서비스를 만들었나요?

프로그래밍을 배우고 싶은 많은 한국인들이 **영어로 된 코딩 명령어** 때문에 진입 장벽을 느끼고 있습니다.

특히:
- **어린이/청소년**: 영어에 익숙하지 않아 코드를 이해하기 어려움
- **성인 입문자**: 영어 명령어의 의미를 몰라 학습 속도가 느려짐
- **비전공자**: 프로그래밍 용어가 낯설어 포기하는 경우가 많음

### 해결 방안

**Study Python**은 이러한 어려움을 해결하기 위해 개발되었습니다:

- **한국어 사전 제공**: 코딩 명령어/함수의 한국어 뜻 설명
- **영어 사전 연동**: 영어 단어의 발음, 의미, 예문 제공
- **단계별 학습**: 쉬운 것부터 차근차근 배우는 커리큘럼
- **실습 환경**: 직접 코드를 작성하고 결과를 확인

### 대상 사용자

| 대상 | 특징 |
|------|------|
| 초등학생~고등학생 | 영어가 어려운 어린이/청소년 |
| 성인 입문자 | 코딩을 처음 배우는 직장인, 주부 등 |
| 비전공 대학생 | 프로그래밍 교양 수업 수강생 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프론트엔드 | Next.js, React, TypeScript, Tailwind CSS |
| 백엔드/DB | Convex |
| 인증 | @convex-dev/auth (Google OAuth, 이메일/비밀번호) |
| 호스팅 | Vercel |
| 도메인 | studycoding.kr (가비아) |

---

## 시작하기 (Getting Started)

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd "Study Python"

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 터미널 1: Next.js 개발 서버
npm run dev

# 터미널 2: Convex 개발 서버
npx convex dev
```

브라우저에서 http://localhost:3000 접속

---

## 환경 구성

### 환경 분리

| 환경 | 도메인 | Git 브랜치 | Convex Deployment | 용도 |
|------|--------|-----------|-------------------|------|
| **Production** | studycoding.kr | `main` | pastel-mandrill-274 | 정식 서비스 |
| **Development** | dev.studycoding.kr | `dev` | cheerful-beagle-175 | 개발/테스트 |

### DNS 설정 (가비아)

| 타입 | 호스트 | 값 | TTL |
|------|--------|-----|-----|
| A | @ | 76.76.21.21 | 1800 |
| CNAME | www | cname.vercel-dns.com. | 600 |
| CNAME | dev | cname.vercel-dns.com. | 600 |

### Vercel 환경변수

| 변수명 | Production | Preview/Development |
|--------|------------|---------------------|
| `NEXT_PUBLIC_CONVEX_URL` | https://pastel-mandrill-274.convex.cloud | https://cheerful-beagle-175.convex.cloud |
| `CONVEX_DEPLOY_KEY` | prod:pastel-mandrill-274\|... | dev:cheerful-beagle-175\|... |

---

## 개발 워크플로우

### 전체 흐름

```
┌─────────────────────────────────────────────────────────┐
│  1. git checkout dev          (개발 브랜치로 전환)       │
│                    ↓                                    │
│  2. npm run dev + npx convex dev  (로컬 개발)           │
│                    ↓                                    │
│  3. git add . → commit → push  (dev에 푸시)             │
│                    ↓                                    │
│  4. dev.studycoding.kr 테스트  (자동 배포됨)            │
│                    ↓                                    │
│  5. git checkout main → merge dev → push                │
│                    ↓                                    │
│  6. studycoding.kr 확인       (정식 서비스 배포 완료!)   │
└─────────────────────────────────────────────────────────┘
```

### 단계별 명령어

```bash
# 1. 개발 브랜치로 전환
git checkout dev
git pull origin dev

# 2. 로컬 개발
npm run dev          # 터미널 1
npx convex dev       # 터미널 2

# 3. 커밋 & 푸시
git add .
git commit -m "feat: 기능 설명"
git push origin dev

# 4. dev.studycoding.kr 에서 테스트

# 5. 정식 배포
git checkout main
git merge dev
git push origin main

# 6. studycoding.kr 에서 확인
```

---

## 테스트 가이드라인

### Safari 개인 정보 보호 탭 사용 (필수!)

**개발 환경 테스트 시 반드시 Safari의 "개인 정보 보호 탭"을 사용할 것!**

```
Safari → 파일 → 새로운 개인 정보 보호 윈도우 (⇧⌘N)
```

#### 왜 개인 정보 보호 탭을 사용해야 하나요?

| 문제 | 설명 |
|------|------|
| **캐시 문제** | 일반 브라우저는 JS/CSS/이미지 등을 캐시하여 변경사항이 반영되지 않을 수 있음 |
| **인증 상태 혼란** | 이전 세션의 로그인 상태가 남아있어 테스트 결과가 왜곡될 수 있음 |
| **쿠키 충돌** | dev/production 환경 간 쿠키가 충돌할 수 있음 |

#### 테스트 체크리스트

- [ ] Safari 개인 정보 보호 탭으로 `dev.studycoding.kr` 접속
- [ ] 새 기능 정상 작동 확인
- [ ] 로그인/로그아웃 플로우 테스트
- [ ] 모바일 뷰 확인 (개발자 도구 → 반응형 디자인 모드)

#### 캐시 강제 새로고침 (대안)

개인 정보 보호 탭 없이 캐시를 무시하고 새로고침하려면:

```
⌘ + Shift + R  (Mac)
Ctrl + Shift + R  (Windows)
```

---

## 트러블슈팅 & 실수 기록

### 1. Vercel Preview 도메인 Save 버튼 비활성화

**상황**: dev.studycoding.kr 도메인을 Preview 환경에 추가하려 했으나 Save 버튼이 눌리지 않음

**원인**: Preview 환경에 연결할 Git 브랜치가 존재하지 않았음

**해결**:
```bash
git checkout -b dev
git push -u origin dev
```

**교훈**: Vercel Preview 도메인 설정 전에 해당 브랜치를 먼저 생성해야 함

---

### 2. Convex Deploy 에러: "no Convex deployment configuration found"

**상황**: dev 브랜치 첫 배포 시 Convex 배포 실패

**원인**: Vercel의 Preview/Development 환경에 `CONVEX_DEPLOY_KEY` 환경변수가 설정되지 않음

**해결**:
1. Vercel → Settings → Environment Variables
2. `CONVEX_DEPLOY_KEY` 추가 (Preview + Development 환경)

**교훈**: Production과 Preview/Development의 CONVEX_DEPLOY_KEY가 **다름**

---

### 3. 환경변수 설정 시 환경 선택 실수

**상황**: CONVEX_DEPLOY_KEY를 추가했지만 Production 환경만 체크함

**해결**: 같은 Key로 환경별 다른 값 설정
- Production: prod 키
- Preview + Development: dev 키

**교훈**: 환경변수 설정 시 **어떤 환경에 적용할지** 반드시 확인

---

### 4. "npm warn deprecated lucia@3.2.2" 경고

**상황**: 배포 로그에 lucia 패키지 deprecated 경고 표시

**원인**: `@convex-dev/auth`가 내부적으로 `lucia`에 의존

**현재 상태**: 경고(Warning)일 뿐, 에러 아님. 빌드/배포 정상 작동

**향후 계획**: @convex-dev/auth 업데이트 대기 또는 Clerk 마이그레이션 검토

---

### 5. Convex DB 데이터 분리 이해

| 항목 | 배포 시 변경됨? | 설명 |
|------|----------------|------|
| 함수 (Functions) | ✅ 변경됨 | Query, Mutation, Action |
| 스키마 (Schema) | ✅ 변경됨 | 테이블 구조 |
| 데이터 (Data) | ❌ 변경 안됨 | 실제 저장된 데이터 |

**교훈**:
- dev와 main의 **데이터는 완전히 분리**됨
- 스키마 변경 시 새 필드는 `optional`로 선언 권장

---

### 6. 프로필 이미지 깨짐 (물음표 아이콘 표시)

**상황**: 프로필 사진 업로드 후 이미지 대신 물음표 아이콘이 표시됨

**원인**: Convex 파일 스토리지에 저장된 `storageId`를 URL로 변환하지 않고 `<img src>`에 직접 전달

**해결**: `getCurrentUserWithAccount` 쿼리에서 서버 측에서 `ctx.storage.getUrl(storageId)`로 URL 변환 후 반환

**교훈**: storageId는 내부 식별자일 뿐, 이미지 표시에는 반드시 URL로 변환 필요

---

### 7. 닉네임 변경이 반영되지 않음

**상황**: 프로필에서 닉네임을 변경해도 화면에 반영되지 않음

**원인**: `getCurrentUserWithAccount`에서 `user?.name || profile?.name` 순서로 되어있어 `profile.name`이 무시됨

**해결**:
- `nickname` 필드 별도 추가: `profile?.name || user?.name || email?.split("@")[0]`
- `name` 필드: 회원가입 시 입력한 원래 이름 (`user?.name || email`)

**교훈**: 여러 테이블에서 같은 의미의 필드를 가져올 때 우선순위를 명확히 정의해야 함

---

### 8. 프로필 이미지 CORS 차단 (Cross-Origin-Resource-Policy)

**상황**: 프로필 이미지 업로드 성공, URL도 정상 생성되는데 브라우저에서 이미지가 표시되지 않음 (물음표 아이콘)

**증상 (브라우저 콘솔)**:
```
Cannot load image https://cheerful-beagle-175.convex.cloud/api/storage/xxx due to access control checks.
Cross-Origin-Resource-Policy response header
```

**처음 시도한 잘못된 진단**:
- `ctx.storage.getUrl(storageId)`가 실패한다고 생각함
- `as any` 타입 캐스팅 문제라고 생각함
- 디버깅 로그 추가해도 URL은 정상 반환됨

**진짜 원인 (핵심!)**:

1. `next.config.mjs`에 Pyodide를 위한 보안 헤더가 설정되어 있음:
   ```javascript
   headers: [
     { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
     { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
   ]
   ```

2. `Cross-Origin-Embedder-Policy: require-corp`는 **모든 외부 리소스**가 `Cross-Origin-Resource-Policy: cross-origin` 헤더를 가지도록 요구

3. Convex 스토리지 URL (`cheerful-beagle-175.convex.cloud`)은 이 헤더를 포함하지 않음

4. 결과: 브라우저가 이미지 로드를 차단!

**해결 방법**:

Convex HTTP 라우트를 통해 이미지를 제공하고, 응답 헤더에 `Cross-Origin-Resource-Policy: cross-origin` 추가

**파일: `convex/http.ts`**
```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";  // 중요: httpAction 사용!
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/image",
  method: "GET",
  handler: httpAction(async (ctx, request) => {  // httpAction으로 감싸야 함!
    const url = new URL(request.url);
    const storageId = url.searchParams.get("id");

    const blob = await ctx.storage.get(storageId as Id<"_storage">);

    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "image/jpeg",
        "Cross-Origin-Resource-Policy": "cross-origin",  // 핵심!
      },
    });
  }),
});
```

**파일: `convex/users.ts`**
```typescript
// 기존: ctx.storage.getUrl(storageId)
// 변경: HTTP 라우트 URL 생성
const convexSiteUrl = "https://cheerful-beagle-175.convex.site";
imageUrl = `${convexSiteUrl}/image?id=${profile.image}`;
```

**추가 교훈 - TypeScript 오류**:

HTTP 라우트 핸들러는 반드시 `httpAction()`으로 감싸야 함!
```typescript
// ❌ 잘못된 방법 (TypeScript 오류 발생)
handler: async (ctx, request) => { ... }

// ✅ 올바른 방법
handler: httpAction(async (ctx, request) => { ... })
```

**핵심 교훈**:
1. CORS 문제는 서버가 아닌 **브라우저에서 차단**하는 것
2. `ctx.storage.getUrl()`이 정상 작동해도 브라우저 보안 정책으로 차단될 수 있음
3. COEP 헤더가 설정된 사이트는 외부 리소스 로드에 제약이 있음
4. Convex HTTP 라우트를 사용하면 응답 헤더를 완전히 제어 가능
5. HTTP 라우트 URL은 `.convex.cloud`가 아닌 **`.convex.site`** 도메인 사용

---

### 9. Google OAuth 프로필 이미지도 CORS 차단

**상황**: 이메일 로그인 이미지 수정 후에도 Google 로그인 사용자의 프로필 이미지가 여전히 깨짐

**증상 (브라우저 콘솔)**:
```
Cannot load image https://lh3.googleusercontent.com/a/xxx due to access control checks.
```

**원인**:
1. Google OAuth 이미지 URL (`lh3.googleusercontent.com`)도 CORP 헤더가 없음
2. 기존 코드에서 `profile.image`가 HTTP URL인 경우 **프록시 없이 직접 반환**하고 있었음

**잘못된 코드**:
```typescript
if (profile.image.startsWith("http")) {
  imageUrl = profile.image;  // ❌ 외부 URL 직접 반환 → CORS 차단!
}
```

**수정된 코드** (`convex/users.ts`):
```typescript
const convexSiteUrl = "https://cheerful-beagle-175.convex.site";

// 1순위: profile.image
if (profile?.image) {
  if (profile.image.startsWith("http")) {
    // ✅ 외부 URL도 프록시를 통해 제공
    imageUrl = `${convexSiteUrl}/proxy-image?url=${encodeURIComponent(profile.image)}`;
  } else {
    imageUrl = `${convexSiteUrl}/image?id=${profile.image}`;
  }
}

// 2순위: user.image (Google OAuth)
if (!imageUrl && user?.image) {
  imageUrl = `${convexSiteUrl}/proxy-image?url=${encodeURIComponent(user.image)}`;
}
```

**추가 수정** (`convex/http.ts`):
```typescript
// 외부 이미지 프록시 라우트 추가
http.route({
  path: "/proxy-image",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const imageUrl = new URL(request.url).searchParams.get("url");
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Response(blob, {
      headers: {
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  }),
});
```

**핵심 교훈**:
1. **모든 외부 이미지 URL**은 COEP 환경에서 프록시가 필요함
2. Google, Facebook 등 OAuth 제공자의 이미지도 CORP 헤더가 없음
3. 한 부분을 수정할 때 **관련된 모든 경로**를 함께 확인해야 함

---

### 10. 프론트엔드 변경사항이 반영되지 않음 (배포 실수)

**상황**: 코드 수정 후 `npx convex dev --once` 실행했는데 dev.studycoding.kr에 변경사항이 반영되지 않음

**증상**:
- 코드상 수정 완료 확인됨
- Convex 배포 성공 메시지 표시됨
- 하지만 브라우저에서 변경사항이 보이지 않음

**원인 (핵심!)**:
| 명령어 | 배포 대상 | 설명 |
|--------|----------|------|
| `npx convex dev --once` | **Convex 백엔드만** | Query, Mutation, Action 함수만 배포 |
| `git push origin dev` | **Vercel 프론트엔드** | Next.js 앱 (React 컴포넌트) 배포 |

**해결 방법**:
```bash
# 프론트엔드 변경사항이 있는 경우 반드시 Git 푸시 필요!
git add .
git commit -m "feat: 기능 설명"
git push origin dev
# → Vercel이 자동으로 빌드 & 배포 (1-2분 소요)
```

**핵심 교훈**:
1. **Convex 함수 변경** (`convex/*.ts`): `npx convex dev --once`로 즉시 배포
2. **프론트엔드 변경** (`app/**/*.tsx`, `components/**/*.tsx`): **Git 푸시 필수!**
3. **양쪽 모두 변경**: Convex 배포 + Git 푸시 **둘 다** 필요!

**배포 체크리스트**:
```
□ convex/*.ts 수정됨? → npx convex dev --once
□ app/**/*.tsx 수정됨? → git add . && git commit && git push
□ 둘 다 수정됨? → 둘 다 실행!
```

---

### 11. 프론트엔드 배포 후에도 변경사항 안 보임

**상황**: Git 푸시 후에도 브라우저에서 변경사항이 보이지 않음

**원인**: 브라우저 캐시

**해결**: 강력 새로고침
```
Mac: ⌘ + Shift + R
Windows: Ctrl + Shift + R
```

또는 Safari 개인 정보 보호 탭으로 접속

---

## 주요 기능

### 인증 시스템

| 기능 | 설명 | 파일 |
|------|------|------|
| Google OAuth 로그인 | Google 계정으로 로그인 | `convex/auth.ts` |
| 이메일/비밀번호 로그인 | 이메일로 회원가입 및 로그인 | `convex/auth.ts` |
| 비밀번호 변경 | 로그인 후 프로필 페이지에서 변경 | `convex/users.ts` |
| 비밀번호 재설정 | 로그인 실패 시 계정 확인 후 재설정 | `convex/users.ts` |
| 회원탈퇴 | 모든 데이터 삭제 | `convex/users.ts` |

### 프로필 페이지 (`/profile`)

| 기능 | 설명 |
|------|------|
| 닉네임 표시 | 편집 가능한 표시 이름 (profiles 테이블) |
| 이름 표시 | 회원가입 시 입력한 원래 이름 (users 테이블) |
| 이메일 표시 | 로그인용 이메일 주소 |
| 로그인 방식 | Google 로그인 / 이메일 로그인 구분 |
| 학습 진행률 | 완료한 레벨, 달성률, 연속 학습일 등 |
| 프로필 사진 변경 | 이메일 로그인 사용자만, Convex 파일 스토리지 활용 |
| 닉네임 변경 | **모든 사용자** (Google/이메일), 최대 20자 |
| 비밀번호 변경 | 이메일 로그인 사용자만 표시 |
| 회원탈퇴 | 확인 모달 후 삭제 진행 |

### 로그인 페이지 (`/login`)

| 기능 | 설명 |
|------|------|
| 이메일/비밀번호 로그인 | 기본 로그인 방식 |
| Google OAuth | "Google로 계속하기" 버튼 |
| 계정 확인 | 로그인 실패 시 이메일로 계정 존재 여부 확인 |
| 비밀번호 재설정 | 이메일 계정인 경우 새 비밀번호 설정 가능 |

---

## 자주 쓰는 명령어

### Git

| 상황 | 명령어 |
|------|--------|
| dev로 전환 | `git checkout dev` |
| main으로 전환 | `git checkout main` |
| 변경사항 확인 | `git status` |
| 커밋 | `git add . && git commit -m "메시지"` |
| 푸시 | `git push origin [브랜치명]` |
| 머지 | `git checkout main && git merge dev` |

### 개발 서버

| 상황 | 명령어 |
|------|--------|
| Next.js 서버 | `npm run dev` |
| Convex 서버 | `npx convex dev` |
| 빌드 | `npm run build` |

### 커밋 메시지 규칙

| 접두어 | 용도 |
|--------|------|
| `feat:` | 새 기능 |
| `fix:` | 버그 수정 |
| `style:` | UI/스타일 |
| `refactor:` | 리팩토링 |
| `docs:` | 문서 |

---

## 관련 링크

### 대시보드
- [Vercel](https://vercel.com/sungwon-chos-projects/study-python)
- [Convex](https://dashboard.convex.dev/)
- [Google Cloud Console](https://console.cloud.google.com/)

### 문서
- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 서비스 URL
- Production: https://studycoding.kr
- Development: https://dev.studycoding.kr

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-01-12 | 프로젝트 초기 설정, 도메인 구매 및 연결 |
| 2026-01-13 | 개발/운영 환경 분리 (dev 브랜치, Convex Development) |
| 2026-01-13 | README 문서 통합 및 정리 |
| 2026-01-13 | 프로필 페이지 기능 추가 (로그인 방식, 이메일 표시, 회원탈퇴) |
| 2026-01-13 | 비밀번호 변경 기능 구현 (프로필 페이지) |
| 2026-01-13 | 로그인 실패 시 계정 확인 및 비밀번호 재설정 기능 추가 |
| 2026-01-13 | 헤더에 실제 사용자 이름 표시되도록 수정 |
| 2026-01-13 | 프로필 사진/닉네임 편집 기능 추가 (이메일 로그인 사용자) |
| 2026-01-13 | 테스트 가이드라인 문서 추가 (Safari 개인 정보 보호 탭 사용) |
| 2026-01-13 | 프로필 닉네임/이미지 표시 버그 수정 (storageId→URL 변환, profile.name 우선) |
| 2026-01-13 | 프로필 페이지에 이름/이메일 라벨 추가 (회원가입 시 입력한 이름 표시) |
| 2026-01-13 | 프로필 이미지 CORS 문제 해결 (Convex HTTP 라우트로 CORP 헤더 추가) |
| 2026-01-13 | Google OAuth 프로필 이미지 CORS 문제 해결 (/proxy-image 라우트 추가) |
| 2026-01-13 | Google 로그인 사용자 닉네임 편집 기능 추가 (이미지 변경은 이메일 사용자만) |
