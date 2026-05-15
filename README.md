# 🔍 GitHub Finder | 깃허브 파인더

> **"AI가 코드를 만들어도, 최종 판단은 개발자가 한다."**

---

## 📌 프로젝트 소개

**GitHub Finder**는 GitHub REST API를 활용하여  
사용자명을 검색하면 해당 사용자의 **프로필 정보**와 **저장소 목록**을 보여주는 웹 앱입니다.

순수 HTML / CSS / JavaScript만으로 구현하였으며,  
AI(Cline)와 함께 바이브코딩(Vibe Coding) 방식으로 제작한 실습 프로젝트입니다.

---

## 🎯 학습 목표

- GitHub REST API의 구조와 사용 방법 이해
- `fetch` + `async/await`를 활용한 비동기 HTTP 요청 실습
- DOM 조작으로 API 응답 데이터를 화면에 렌더링하는 방법 학습
- CSS Flexbox를 이용한 레이아웃 구성 실습
- `localStorage`를 활용한 사용자 설정(다크모드) 저장 방법 습득
- AI 생성 코드를 검토하고 수정 요청하는 협업 프로세스 경험

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 마크업 | HTML5 |
| 스타일 | CSS3 (Flexbox, CSS Variables) |
| 스크립트 | Vanilla JavaScript (ES6+) |
| API | GitHub REST API v3 |
| 저장소 | localStorage (다크모드 설정 유지) |
| 개발 환경 | VS Code, Live Server 확장 프로그램 |
| AI 도구 | Cline (Vibe Coding) |

---

## 🚀 실행 방법

### 방법 1 — VS Code Live Server 사용 (권장)

```bash
1. VS Code에서 프로젝트 폴더 열기
2. index.html 파일 우클릭
3. "Open with Live Server" 클릭
4. 브라우저에서 http://127.0.0.1:5500 자동 열림
```

> ⚠️ **주의**: `index.html`을 파일 탐색기에서 직접 열면(`file:///...`)  
> CSS·JS 변경 사항이 실시간 반영되지 않을 수 있습니다.  
> **반드시 로컬 서버(localhost) 형태로 실행하세요.**

### 방법 2 — 직접 파일 열기

```
index.html 파일을 브라우저로 드래그 앤 드롭
```

### (선택) GitHub Token 설정

`app.js` 상단의 `TOKEN` 변수에 Personal Access Token을 입력하면  
API 요청 한도가 **시간당 60회 → 5,000회**로 증가합니다.

```javascript
// app.js
const TOKEN = 'ghp_여기에토큰입력';
```

---

## ✨ 주요 기능

### 1. 사용자 검색
- 검색창에 GitHub 사용자명 입력 후 Enter
- GitHub REST API `GET /users/{username}` 호출

### 2. 프로필 정보 표시
- 프로필 이미지, 이름, 회사, 위치, 블로그, 가입일 표시
- Public Repos / Public Gists / Followers / Following 통계 뱃지

### 3. 최근 저장소 목록
- 최근 업데이트 순 저장소 5개 표시
- 저장소명(링크) + Stars / Watchers / Forks 뱃지

### 4. 다크모드 토글
- 헤더 우측 🌙 버튼으로 다크 ↔ 라이트 모드 전환
- `localStorage`에 선택값 저장 → 새로고침 후에도 유지

### 5. 에러 처리
- 존재하지 않는 사용자: 안내 메시지 표시
- API 요청 초과(403): 경고 메시지 표시
- 네트워크 오류: 일반 오류 메시지 표시

---

## 💬 사용한 프롬프트 기록

| # | 프롬프트 요약 | 결과 |
|---|-------------|------|
| 1 | GitHub REST API에서 어떤 데이터를 요청해야 하는지 정리해 주세요 | API 엔드포인트 및 응답 데이터 정리 문서 생성 |
| 2 | 순수 HTML/CSS/JS로 GitHub Finder 앱의 기본 HTML 구조를 작성해 주세요 (조건 7가지 포함) | index.html, style.css, app.js 3개 파일 생성 |
| 3 | (참고 화면 이미지 첨부) 이 화면을 참고해 주세요 | 레이아웃을 참고 이미지에 맞게 재설계 |
| 4 | fetch와 async/await를 사용하는 JavaScript 코드를 초보자가 이해할 수 있도록 주석 달아 주세요 | app.js 상세 주석 버전으로 업데이트 |
| 5 | 정렬이 필요해 보여. 고정크기로 해줘 | 저장소 뱃지 고정 너비 CSS 추가 요청 |
| 6 | 다크모드로 변경할 수 있는 버튼이 있으면 좋겠어 | 다크모드 토글 버튼 + CSS + localStorage 구현 |
| 7 | 콘솔 오류 분석해줘 (`content.js` 오류) | 브라우저 확장 프로그램 문제임을 확인, 앱 코드 무관 |

---

## 🔍 AI 생성 결과 검토 기준

AI가 생성한 코드를 받을 때 다음 기준으로 검토했습니다.

| 검토 항목 | 확인 내용 |
|----------|----------|
| **기능 동작 여부** | 검색 → 프로필 표시 → 저장소 목록이 정상 동작하는가 |
| **화면 일치 여부** | 참고 이미지와 레이아웃·색상이 유사한가 |
| **코드 가독성** | 주석이 충분하고 변수명이 명확한가 |
| **에러 처리** | 404, 403 등 예외 상황을 처리하고 있는가 |
| **브라우저 호환** | 파일 직접 실행과 로컬 서버 실행 차이를 인지하는가 |
| **불필요한 코드** | 사용하지 않는 변수나 함수가 없는가 |

---

## 🔧 수정 요청 내용

| 횟수 | 문제 | 요청 내용 | 조치 |
|------|------|----------|------|
| 1차 | 참고 화면과 레이아웃 다름 | 이미지 첨부 후 "이 화면을 참고해 주세요" | 레이아웃 전면 재설계 |
| 2차 | 저장소 뱃지 폭이 행마다 달라 정렬 안 맞음 | "정렬이 필요해 보여. 고정크기로 해줘" | `flex: 0 0 130px` CSS 적용 |
| 3차 | 수정 사항이 화면에 반영되지 않음 | 재요청 반복 | 로컬 서버 실행 환경으로 전환 후 해결 |
| 4차 | 다크모드 추가 요청 | "다크모드로 변경할 수 있는 버튼이 있으면 좋겠어" | 토글 버튼 + CSS + localStorage 구현 |

---

## 📚 배운 점

1. **GitHub REST API 사용법**  
   `GET /users/{username}`, `GET /users/{username}/repos` 엔드포인트로 프로필과 저장소 정보를 가져올 수 있다.

2. **fetch + async/await 비동기 처리**  
   `Promise.all()`을 사용하면 두 API 요청을 동시에 보내 응답 속도를 줄일 수 있다.

3. **로컬 서버 vs 파일 직접 열기 차이**  
   `file:///` 경로로 직접 열면 CSS·JS 수정 사항이 캐시 문제로 반영되지 않는 경우가 있다.  
   **Live Server(`localhost` 주소) 환경에서 실행해야 변경 내용이 즉시 반영**된다.

4. **CSS Flexbox 고정 너비**  
   `width`만으로는 flex 컨텍스트에서 크기가 변할 수 있다.  
   `flex: 0 0 130px`을 사용하면 늘어나거나 줄어들지 않는 고정 크기를 보장할 수 있다.

5. **AI와 협업하는 방법**  
   AI는 빠르게 초안을 만들어주지만, 화면 비교·기능 검증·수정 요청은 개발자가 직접 해야 한다.  
   **구체적인 조건과 참고 이미지를 함께 제공할수록 원하는 결과에 빠르게 도달**할 수 있다.

---

## 📝 3줄 보고서

> **1.** GitHub REST API와 `fetch/async/await`를 활용해 사용자 검색·프로필·저장소 조회 기능을 순수 JavaScript로 구현했다.  
> **2.** AI 생성 코드를 검토하는 과정에서 로컬 서버 실행 환경의 중요성, CSS Flexbox 고정 너비 처리 방법을 직접 경험했다.  
> **3.** AI가 코드를 빠르게 생성하더라도 최종 검토·수정·판단은 반드시 개발자가 담당해야 함을 실감했다.

---

## 🚀 향후 개선 사항

- [ ] **검색 결과 페이지네이션** — 저장소를 5개 이상 불러오는 "더 보기" 버튼 추가
- [ ] **팔로워/팔로잉 목록 표시** — 별도 탭으로 팔로워·팔로잉 사용자 목록 구현
- [ ] **저장소 언어 필터** — 특정 프로그래밍 언어로 필터링하는 기능 추가
- [ ] **검색 기록 저장** — `localStorage`에 최근 검색한 사용자명 목록 유지
- [ ] **반응형 디자인 강화** — 모바일 화면에서 레이아웃 최적화
- [ ] **로딩 스피너** — API 응답 대기 중 애니메이션 표시
- [ ] **GitHub Token 관리 UI** — 설정 버튼으로 토큰을 안전하게 입력하는 화면 추가

---

## 📁 프로젝트 구조

```
ict5.14/
├── index.html        # 앱 HTML 구조 (검색창, 프로필, 저장소 영역)
├── style.css         # 스타일시트 (라이트/다크 모드 포함)
├── app.js            # GitHub API 호출 및 DOM 렌더링 로직
└── README.md         # 프로젝트 설명 문서
```

---

## 🌐 참고 자료

- [GitHub REST API 공식 문서](https://docs.github.com/en/rest)
- [MDN - Fetch API](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)
- [MDN - async/await](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Promises)
- [MDN - localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)

---

<p align="center">
  Made with 💙 by Vibe Coding Practice &nbsp;|&nbsp; GitHub REST API
</p>
