/* ===================================================
   GitHub Finder - app.js
   GitHub REST API를 호출하여 사용자 정보를 표시합니다.
   =================================================== */

// ── API 설정 ─────────────────────────────────────────
const GITHUB_API_BASE = 'https://api.github.com';

// Personal Access Token (Rate Limit 증가: 시간당 5000회)
// 토큰이 없으면 빈 문자열로 두세요 (시간당 60회 제한)
const TOKEN = ''; // 예: 'ghp_xxxxxxxxxxxxxxxxxxxx'

const HEADERS = TOKEN
  ? { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  : { Accept: 'application/vnd.github.v3+json' };

// ── DOM 요소 선택 ──────────────────────────────────────
const searchForm       = document.getElementById('search-form');
const searchInput      = document.getElementById('search-input');
const statusMessage    = document.getElementById('status-message');
const resultSection    = document.getElementById('result-section');

// 프로필 관련
const profileAvatar    = document.getElementById('profile-avatar');
const profileGithubLink= document.getElementById('profile-github-link');
const statRepos        = document.getElementById('stat-repos');
const statGists        = document.getElementById('stat-gists');
const statFollowers    = document.getElementById('stat-followers');
const statFollowing    = document.getElementById('stat-following');
const profileCompany   = document.getElementById('profile-company');
const profileBlog      = document.getElementById('profile-blog');
const profileLocation  = document.getElementById('profile-location');
const profileCreated   = document.getElementById('profile-created');

// 저장소 관련
const reposList        = document.getElementById('repos-list');

// ── 유틸리티 함수 ──────────────────────────────────────

/**
 * 상태 메시지를 표시합니다.
 * @param {string} msg    표시할 텍스트
 * @param {boolean} isError 에러 스타일 여부
 */
function showStatus(msg, isError = false) {
  statusMessage.textContent = msg;
  statusMessage.className = 'status-message' + (isError ? ' error' : '');
}

/** 상태 메시지를 초기화합니다. */
function clearStatus() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';
}

/** 결과 영역을 숨깁니다. */
function hideResult() {
  resultSection.classList.add('hidden');
}

/** 결과 영역을 표시합니다. */
function showResult() {
  resultSection.classList.remove('hidden');
}

/**
 * ISO 날짜 문자열을 한국어 포맷으로 변환합니다.
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── API 호출 함수 ──────────────────────────────────────

/**
 * 사용자 프로필 정보를 가져옵니다.
 * GET /users/{username}
 * @param {string} username
 * @returns {Promise<Object>}
 */
async function fetchUserProfile(username) {
  const res = await fetch(`${GITHUB_API_BASE}/users/${username}`, { headers: HEADERS });
  if (res.status === 404) throw new Error(`"${username}" 사용자를 찾을 수 없습니다.`);
  if (res.status === 403) throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.');
  if (!res.ok) throw new Error(`오류가 발생했습니다. (HTTP ${res.status})`);
  return res.json();
}

/**
 * 사용자의 최근 저장소 목록을 가져옵니다.
 * GET /users/{username}/repos?sort=updated&per_page=5
 * @param {string} username
 * @returns {Promise<Array>}
 */
async function fetchUserRepos(username) {
  const res = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=5`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error('저장소 목록을 가져오는데 실패했습니다.');
  return res.json();
}

// ── 렌더링 함수 ────────────────────────────────────────

/**
 * 사용자 프로필 정보를 화면에 렌더링합니다.
 * @param {Object} user  GitHub API 응답 객체
 */
function renderProfile(user) {
  // 아바타 & GitHub 링크
  profileAvatar.src    = user.avatar_url || '';
  profileAvatar.alt    = `${user.login}의 프로필 이미지`;
  profileGithubLink.href = user.html_url || '#';

  // 통계 뱃지
  statRepos.textContent     = user.public_repos ?? 0;
  statGists.textContent     = user.public_gists ?? 0;
  statFollowers.textContent = user.followers ?? 0;
  statFollowing.textContent = user.following ?? 0;

  // 상세 정보
  profileCompany.textContent  = user.company  || 'null';
  profileLocation.textContent = user.location || 'null';
  profileCreated.textContent  = user.created_at ? user.created_at : '-';

  // 블로그/웹사이트
  if (user.blog) {
    const blogUrl = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
    profileBlog.href        = blogUrl;
    profileBlog.textContent = user.blog;
  } else {
    profileBlog.href        = '#';
    profileBlog.textContent = 'null';
  }
}

/**
 * 저장소 목록을 화면에 렌더링합니다.
 * @param {Array} repos  GitHub API 응답 배열
 */
function renderRepos(repos) {
  reposList.innerHTML = ''; // 기존 목록 초기화

  if (repos.length === 0) {
    reposList.innerHTML = '<li style="padding:16px 20px;color:#888;">공개 저장소가 없습니다.</li>';
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

    reposList.appendChild(li);
  });
}

// ── 메인 검색 로직 ─────────────────────────────────────

/**
 * 사용자명으로 프로필과 저장소를 검색합니다.
 * @param {string} username
 */
async function searchUser(username) {
  // 초기화
  hideResult();
  clearStatus();
  showStatus('🔍 검색 중입니다...');

  try {
    // 프로필과 저장소를 병렬로 요청
    const [user, repos] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepos(username)
    ]);

    // 화면 렌더링
    renderProfile(user);
    renderRepos(repos);

    clearStatus();
    showResult();

  } catch (err) {
    hideResult();
    showStatus(err.message, true);
  }
}

// ── 이벤트 리스너 ──────────────────────────────────────

// 다크모드 토글 버튼
const darkToggleBtn = document.getElementById('dark-toggle');

// 버튼 클릭 시 body에 .dark 클래스를 추가/제거합니다.
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark');
  darkToggleBtn.textContent = isDark ? '☀️' : '🌙';
  // localStorage에 선택 저장 → 새로고침해도 유지됩니다.
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

darkToggleBtn.addEventListener('click', toggleDarkMode);

// 페이지 로드 시 저장된 테마를 불러와 적용합니다.
(function applyStoredTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    darkToggleBtn.textContent = '☀️';
  }
})();

// 검색 폼 이벤트
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지

  const username = searchInput.value.trim();

  if (!username) {
    showStatus('사용자명을 입력해 주세요.', true);
    return;
  }

  searchUser(username);
});
