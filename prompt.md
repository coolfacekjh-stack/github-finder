# 📝 Prompt 기록 - GitHub Finder 프로젝트

> AI(Cline)와 나눈 프롬프트 전체 기록입니다.  
> 바이브코딩(Vibe Coding) 실습 과정에서 사용한 지시문과 그 결과를 정리했습니다.

---

## 🔢 프롬프트 목록

---

### Prompt 1 — API 데이터 요청 정리

```
GitHub Finder 앱을 만들기 위해 GitHub REST API에서
어떤 데이터를 요청해야 하는지 정리해 주세요.
```

**결과:**  
- GitHub REST API 엔드포인트 5가지 정리
  - `GET /search/users?q=` — 사용자 검색
  - `GET /users/{username}` — 프로필 상세
  - `GET /users/{username}/repos` — 저장소 목록
  - `GET /users/{username}/followers` — 팔로워
  - `GET /users/{username}/following` — 팔로잉
- 응답 데이터 필드, Rate Limit, 인증 방법, JS 예시 코드 포함

---

### Prompt 2 — 기본 HTML 구조 생성

```
GitHub REST API에서 데이터를 요청하여 GitHub Finder 앱을 만들려고 합니다.
순수 HTML/CSS/JavaScript로 GitHub Finder 앱의 기본 HTML 구조를 작성해 주세요.

조건:
1. 사용자명을 입력할 검색창이 있어야 합니다.
2. 검색 버튼이 있어야 합니다.
3. 사용자 프로필 정보를 보여줄 영역이 있어야 합니다.
4. 저장소 목록을 보여줄 영역이 있어야 합니다.
5. 상태 메시지 영역이 있어야 합니다.
6. CSS는 style.css, JavaScript는 app.js로 분리해 주세요.
7. JavaScript에서 선택하기 쉽도록 id를 명확히 붙여 주세요.
```

**결과:**  
- `index.html`, `style.css`, `app.js` 3개 파일 생성
- 검색 폼, 프로필 카드, 저장소 목록, 상태 메시지 영역 구현

---

### Prompt 3 — 참고 화면 디자인 반영

```
이 화면을 참고해 주세요
[이미지 첨부: 파란 헤더, 프로필+뱃지 레이아웃, 저장소 리스트 화면]
```

**결과:**  
- 파란 헤더 (`#4a90d9`)
- 좌: 프로필 이미지 + View Profile 버튼
- 우: Public Repos / Gists / Followers / Following 색상 뱃지
- 상세정보 (Company, Website, Location, Member Since) border-bottom 구분선
- 저장소 행: 이름 링크 + Stars/Watchers/Forks 뱃지

---

### Prompt 4 — JavaScript 초보자용 주석 추가

```
GitHub 사용자명을 입력하면 사용자 정보와 저장소 목록을 가져오는 JavaScript 코드를 작성해 주세요.

조건:
1. fetch와 async/await를 사용합니다.
2. 사용자 정보 요청과 저장소 목록 요청을 분리합니다.
3. 사용자를 찾지 못했을 때 안내 메시지를 표시합니다.
4. API 요청 실패 시 오류 메시지를 표시합니다.
5. 초보자가 이해할 수 있도록 주석을 달아 주세요.
```

**결과:**  
- `fetchUserProfile()`, `fetchUserRepos()` 함수 분리
- 404(없는 사용자), 403(한도 초과), 일반 오류 처리
- async/await, fetch, try/catch, DOM 조작 등 단계별 한국어 주석

---

### Prompt 5 — 저장소 뱃지 고정 너비

```
정렬이 필요해 보여. 고정크기로 해줘
[이미지 첨부: 행마다 뱃지 너비가 달라 정렬이 안 맞는 화면]
```

**결과:**  
```css
.repo-item__badges .badge {
  flex: 0 0 130px;
  width: 130px;
  text-align: center;
  padding: 6px 0;
}
```

---

### Prompt 6 — 다크모드 토글 버튼

```
다크모드로 변경할 수 있는 버튼이 있으면 좋겠어
```

**결과:**  
- 헤더 우측 🌙/☀️ 토글 버튼 추가
- `body.dark` 클래스 기반 CSS 다크 테마
- `localStorage`에 선택값 저장 → 새로고침 후에도 유지

---

### Prompt 7 — 콘솔 오류 분석

```
Uncaught (in promise) Could not establish connection. Receiving end does not exist.
콘솔 오류 분석해줘
```

**결과:**  
- `content.js`에서 발생한 오류 → **브라우저 확장 프로그램 내부 오류**
- 앱 코드(`app.js`)와 무관, 기능 동작에 영향 없음
- 시크릿 창에서 테스트 권장

---

### Prompt 8 — README.md 작성

```
현재 프로젝트 내용을 바탕으로 README.md를 작성해줘.

조건:
- 프로젝트명: [추천 영문명: 추천 한글명]
- 실습 환경: [사용 기술 및 환경]
- 목적: [프로젝트 개요 및 목적]
- 포함 내용:
  1. 프로젝트 소개
  2. 학습 목표
  3. 기술 스택
  4. 실행 방법
  5. 주요 기능
  6. 사용한 프롬프트 기록
  7. AI 생성 결과 검토 기준
  8. 수정 요청 내용
  9. 배운 점
  10. 3줄 보고서
  11. 향후 개선 사항

작성 방식:
- Markdown 형식
- 초보자도 이해하기 쉽게
- GitHub에 올릴 수 있는 README.md 완성본으로 작성
- "AI가 코드를 만들어도, 최종 판단은 개발자가 한다"는 메시지를 포함
(배운점: 로컬 호스트 주소 형태여야 수정된 내용이 적용되는 상황을 접함)
```

**결과:**  
- 11개 섹션이 포함된 README.md 완성본 생성

---

### Prompt 9 — GitHub 푸쉬

```
깃허브에 푸쉬해줘
```

**결과:**  
- `gh repo create github-finder --public` 으로 저장소 자동 생성
- `git init` → `git add .` → `git commit` → `git push` 완료
- 저장소: https://github.com/coolfacekjh-stack/github-finder

---

### Prompt 10 — OOP + Spinner + 잔디밭 기능 추가

```
자바스크립트 OOP를 이용해서 구현합니다.
비동기 통신을 이용합니다.
위에 기능 외에 잔디밭 기능
Spinner 기능 등 원하는 기능 등이 적용된거니?
```

**결과:**  
- `app.js` 전면 재설계: **GithubAPI / UI / App** 3클래스 OOP 구조
- **로딩 Spinner**: CSS 회전 애니메이션 (`@keyframes spin`)
- **잔디밭(Contribution Garden)**: `/events/public` API로 최근 91일 히트맵 구현
- 활동 레벨 0~4 색상 구분 + 툴팁 + 범례
- `Promise.all()`로 3개 API 병렬 요청

---

### Prompt 11 — prompt.md 파일 생성

```
prompt.md 파일도 생성해줘
```

**결과:**  
- 현재 이 파일! 프로젝트 진행 중 사용된 모든 프롬프트 기록

---

## 💡 프롬프트 작성 팁

| 좋은 프롬프트 | 효과 |
|-------------|------|
| **조건을 번호로 명시** | AI가 누락 없이 모든 요구사항 반영 |
| **참고 이미지 첨부** | 레이아웃·색상 의도를 정확히 전달 |
| **기술 스택 명시** | 원하는 구현 방식(OOP, async/await 등) 지정 |
| **구체적인 기능명 사용** | 잔디밭, Spinner 등 명확한 용어 사용 |
| **오류 메시지 그대로 전달** | AI가 정확한 원인 분석 가능 |

---

## ⚠️ 트러블슈팅 기록

| 문제 | 원인 | 해결 |
|------|------|------|
| 뱃지 폭이 행마다 달랐음 | flex 컨텍스트에서 내용에 따라 크기 변동 | `flex: 0 0 130px` 고정 |
| CSS 수정이 반영 안 됨 | `file:///` 직접 실행 시 캐시 문제 | **Live Server(localhost)** 로 실행 |
| 콘솔에 `content.js` 오류 | 브라우저 확장 프로그램 내부 오류 | 앱 코드와 무관, 무시 가능 |

---

<p align="center">
  <em>"AI가 코드를 만들어도, 최종 판단은 개발자가 한다."</em>
</p>
