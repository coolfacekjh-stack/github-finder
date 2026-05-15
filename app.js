/* =====================================================
   GitHub Finder - app.js
   OOP(객체지향) 방식으로 설계된 3개의 클래스
   - GithubAPI : GitHub REST API 비동기 통신 담당
   - UI        : DOM 조작 및 화면 렌더링 담당
   - App       : 전체 흐름 제어 (컨트롤러)
   ===================================================== */


/* =====================================================
   1️⃣ GithubAPI 클래스
   GitHub REST API와의 모든 비동기 통신을 담당합니다.
   - fetch + async/await 사용
   - 오류 상태 코드에 따른 예외 처리
   ===================================================== */
class GithubAPI {

  constructor() {
    // API 기본 URL과 공통 헤더를 생성자에서 설정합니다.
    this.baseURL = 'https://api.github.com';

    // Personal Access Token (없으면 시간당 60회 제한)
    // 필요 시 'ghp_xxxx' 형태의 토큰을 여기에 입력하세요.
    const token = '';

    this.headers = token
      ? { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }
      : { Accept: 'application/vnd.github.v3+json' };
  }

  /**
   * 공통 fetch 메서드 - 모든 API 요청의 기반이 됩니다.
   * @param {string} endpoint - baseURL 뒤에 붙을 경로
   * @returns {Promise<any>} - JSON 파싱된 응답 데이터
   */
  async #request(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: this.headers
    });

    if (response.status === 404) {
      throw new Error('사용자를 찾을 수 없습니다. 사용자명을 다시 확인해 주세요.');
    }
    if (response.status === 403) {
      throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.');
    }
    if (!response.ok) {
      throw new Error(`오류가 발생했습니다. (HTTP ${response.status})`);
    }

    return response.json();
  }

  /**
   * 사용자 프로필 정보를 가져옵니다.
   * GET /users/{username}
   * @param {string} username
   */
  async getUser(username) {
    return this.#request(`/users/${username}`);
  }

  /**
   * 사용자의 저장소 목록을 가져옵니다.
   * GET /users/{username}/repos?sort=updated&per_page=5
   * @param {string} username
   */
  async getRepos(username) {
    return this.#request(`/users/${username}/repos?sort=updated&per_page=5`);
  }

  /**
   * 사용자의 최근 공개 이벤트를 가져옵니다. (잔디밭용)
   * GET /users/{username}/events/public?per_page=100
   * @param {string} username
   */
  async getEvents(username) {
    try {
      return await this.#request(`/users/${username}/events/public?per_page=100`);
    } catch {
      // 이벤트 조회 실패 시 빈 배열 반환 (잔디밭 비표시로 처리)
      return [];
    }
  }
}


/* =====================================================
   2️⃣ UI 클래스
   모든 DOM 조작과 화면 렌더링을 담당합니다.
   - 프로필 카드, 저장소 목록, 잔디밭, 스피너, 다크모드
   ===================================================== */
class UI {

  constructor() {
    // 자주 사용하는 DOM 요소를 미리 참조해 둡니다.
    this.statusMessage  = document.getElementById('status-message');
    this.spinner        = document.getElementById('spinner');
    this.resultSection  = document.getElementById('result-section');

    // 프로필 관련 요소
    this.profileAvatar  = document.getElementById('profile-avatar');
    this.profileLink    = document.getElementById('profile-github-link');
    this.statRepos      = document.getElementById('stat-repos');
    this.statGists      = document.getElementById('stat-gists');
    this.statFollowers  = document.getElementById('stat-followers');
    this.statFollowing  = document.getElementById('stat-following');
    this.profileCompany = document.getElementById('profile-company');
    this.profileBlog    = document.getElementById('profile-blog');
    this.profileLocation= document.getElementById('profile-location');
    this.profileCreated = document.getElementById('profile-created');

    // 잔디밭 관련 요소
    this.gardenGrid     = document.getElementById('garden-grid');
    this.gardenPeriod   = document.getElementById('garden-period');

    // 저장소 목록
    this.reposList      = document.getElementById('repos-list');

    // 다크모드 버튼
    this.darkToggleBtn  = document.getElementById('dark-toggle');
  }

  // ── 스피너 제어 ──────────────────────────────────────

  /** 로딩 스피너를 표시합니다. */
  showSpinner() {
    this.spinner.classList.remove('hidden');
  }

  /** 로딩 스피너를 숨깁니다. */
  hideSpinner() {
    this.spinner.classList.add('hidden');
  }

  // ── 상태 메시지 제어 ──────────────────────────────────

  /**
   * 상태 메시지를 표시합니다.
   * @param {string}  msg     - 표시할 텍스트
   * @param {boolean} isError - true이면 빨간 에러 스타일
   */
  showStatus(msg, isError = false) {
    this.statusMessage.textContent = msg;
    this.statusMessage.className = 'status-message' + (isError ? ' error' : '');
  }

  /** 상태 메시지를 초기화합니다. */
  clearStatus() {
    this.statusMessage.textContent = '';
    this.statusMessage.className = 'status-message';
  }

  // ── 결과 영역 제어 ────────────────────────────────────

  showResult()  { this.resultSection.classList.remove('hidden'); }
  hideResult()  { this.resultSection.classList.add('hidden'); }

  // ── 프로필 렌더링 ─────────────────────────────────────

  /**
   * 사용자 프로필 정보를 화면에 표시합니다.
   * @param {Object} user - GithubAPI.getUser()가 반환한 사용자 객체
   */
  renderProfile(user) {
    this.profileAvatar.src  = user.avatar_url || '';
    this.profileAvatar.alt  = `${user.login}의 프로필 이미지`;
    this.profileLink.href   = user.html_url   || '#';

    this.statRepos.textContent     = user.public_repos ?? 0;
    this.statGists.textContent     = user.public_gists ?? 0;
    this.statFollowers.textContent = user.followers    ?? 0;
    this.statFollowing.textContent = user.following    ?? 0;

    this.profileCompany.textContent  = user.company  || 'null';
    this.profileLocation.textContent = user.location || 'null';
    this.profileCreated.textContent  = user.created_at || '-';

    if (user.blog) {
      const url = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
      this.profileBlog.href        = url;
      this.profileBlog.textContent = user.blog;
    } else {
      this.profileBlog.href        = '#';
      this.profileBlog.textContent = 'null';
    }
  }

  // ── 저장소 목록 렌더링 ────────────────────────────────

  /**
   * 저장소 목록을 화면에 표시합니다.
   * @param {Array} repos - GithubAPI.getRepos()가 반환한 배열
   */
  renderRepos(repos) {
    this.reposList.innerHTML = '';

    if (!repos.length) {
      this.reposList.innerHTML =
        '<li style="padding:16px 20px;color:#888;">공개 저장소가 없습니다.</li>';
      return;
    }

    repos.forEach(repo => {
      const li = document.createElement('li');
      li.className = 'repo-item';
      li.innerHTML = `
        <div class="repo-item__name">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            ${repo.name}
          </a>
        </div>
        <div class="repo-item__badges">
          <span class="badge badge--blue">Stars: ${repo.stargazers_count ?? 0}</span>
          <span class="badge badge--gray">Watchers: ${repo.watchers_count ?? 0}</span>
          <span class="badge badge--green">Forks: ${repo.forks_count ?? 0}</span>
        </div>
      `;
      this.reposList.appendChild(li);
    });
  }

  // ── 잔디밭 렌더링 ─────────────────────────────────────

  /**
   * 최근 90일간의 활동 히트맵(잔디밭)을 그립니다.
   * @param {Array} events - GithubAPI.getEvents()가 반환한 이벤트 배열
   */
  renderContributionGarden(events) {
    this.gardenGrid.innerHTML = '';

    const DAYS = 91; // 오늘 포함 91일 (약 13주)

    // ─ 1단계: 날짜별 이벤트 수 집계 ───────────────────
    const countMap = {};
    events.forEach(event => {
      const date = event.created_at.slice(0, 10); // 'YYYY-MM-DD' 형태로 자름
      countMap[date] = (countMap[date] || 0) + 1;
    });

    // ─ 2단계: 활동 레벨 결정 함수 ─────────────────────
    // count에 따라 0~4 레벨을 반환합니다.
    const getLevel = (count) => {
      if (!count) return 0;
      if (count <= 1)  return 1;
      if (count <= 3)  return 2;
      if (count <= 6)  return 3;
      return 4;
    };

    // ─ 3단계: 오늘부터 91일 전까지 날짜 배열 생성 ─────
    const today = new Date();
    const dates = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d);
    }

    // 기간 레이블 업데이트
    const start = dates[0].toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    const end   = dates[dates.length - 1].toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    this.gardenPeriod.textContent = `(${start} ~ ${end})`;

    // ─ 4단계: 주(week) 단위로 그리드 셀 생성 ──────────
    // 첫째 날의 요일(0=일요일)만큼 빈 셀로 채웁니다.
    let weekCol = document.createElement('div');
    weekCol.className = 'garden-week';

    const firstDayOfWeek = dates[0].getDay(); // 0(일) ~ 6(토)
    for (let p = 0; p < firstDayOfWeek; p++) {
      const empty = document.createElement('span');
      empty.className = 'garden-cell';
      empty.dataset.level = '0';
      empty.style.opacity = '0'; // 보이지 않는 빈 칸
      weekCol.appendChild(empty);
    }

    dates.forEach((date, index) => {
      const dateStr = date.toISOString().slice(0, 10);
      const count   = countMap[dateStr] || 0;
      const level   = getLevel(count);

      const cell = document.createElement('span');
      cell.className       = 'garden-cell';
      cell.dataset.level   = level;
      cell.title           = `${dateStr}: ${count}개의 이벤트`;

      weekCol.appendChild(cell);

      // 토요일(6)이거나 마지막 날이면 주 컬럼 추가
      if (date.getDay() === 6 || index === dates.length - 1) {
        this.gardenGrid.appendChild(weekCol);
        weekCol = document.createElement('div');
        weekCol.className = 'garden-week';
      }
    });
  }

  // ── 다크모드 제어 ─────────────────────────────────────

  /** 다크모드를 토글합니다. */
  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    this.darkToggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  /** 저장된 테마를 불러와 적용합니다. */
  applyStoredTheme() {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
      this.darkToggleBtn.textContent = '☀️';
    }
  }
}


/* =====================================================
   3️⃣ App 클래스
   전체 앱의 흐름을 제어하는 컨트롤러입니다.
   - GithubAPI와 UI 인스턴스를 연결합니다.
   - 이벤트 리스너를 등록하고 검색 흐름을 관리합니다.
   ===================================================== */
class App {

  constructor() {
    // GithubAPI와 UI 클래스의 인스턴스를 생성합니다.
    this.api = new GithubAPI();
    this.ui  = new UI();

    // 초기 설정을 실행합니다.
    this.init();
  }

  /** 초기 설정: 저장된 테마 적용 + 이벤트 리스너 등록 */
  init() {
    // 이전에 선택한 다크/라이트 테마를 복원합니다.
    this.ui.applyStoredTheme();

    // 검색 폼 이벤트
    document.getElementById('search-form')
      .addEventListener('submit', (e) => {
        e.preventDefault(); // 폼 기본 새로고침 방지
        const username = document.getElementById('search-input').value.trim();
        if (!username) {
          this.ui.showStatus('사용자명을 입력해 주세요.', true);
          return;
        }
        this.search(username);
      });

    // 다크모드 토글 버튼 이벤트
    document.getElementById('dark-toggle')
      .addEventListener('click', () => this.ui.toggleDarkMode());
  }

  /**
   * 사용자명으로 프로필·저장소·이벤트를 검색하여 화면에 표시합니다.
   * @param {string} username - 검색할 GitHub 사용자 아이디
   */
  async search(username) {
    // ── 1단계: 화면 초기화 & 스피너 표시 ──────────────
    this.ui.hideResult();
    this.ui.clearStatus();
    this.ui.showSpinner();

    try {
      // ── 2단계: 3개 API 요청을 병렬로 실행 ────────────
      // Promise.all로 동시에 요청해 응답 속도를 최소화합니다.
      const [user, repos, events] = await Promise.all([
        this.api.getUser(username),    // 프로필
        this.api.getRepos(username),   // 저장소 목록
        this.api.getEvents(username)   // 활동 이벤트 (잔디밭용)
      ]);

      // ── 3단계: 스피너 숨기고 결과 렌더링 ─────────────
      this.ui.hideSpinner();
      this.ui.renderProfile(user);
      this.ui.renderRepos(repos);
      this.ui.renderContributionGarden(events);
      this.ui.showResult();

    } catch (err) {
      // API 오류 발생 시 스피너를 숨기고 에러 메시지 표시
      this.ui.hideSpinner();
      this.ui.hideResult();
      this.ui.showStatus(err.message, true);
    }
  }
}


/* =====================================================
   앱 시작
   DOM이 완전히 로드된 후 App 인스턴스를 생성합니다.
   ===================================================== */
const app = new App();
