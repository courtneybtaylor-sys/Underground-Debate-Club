// Underground Debate Club - Main Application
// Router and Screen Management

const SCREENS = {
  HOME: 'home',
  SURFACE_GAME: 'surface_game',
  SCHOOL_PORTAL: 'school_portal',
  UNDERGROUND: 'underground',
  BATTLE: 'battle',
  RESULTS: 'results',
  LEADERBOARD: 'leaderboard'
};

let currentScreen = SCREENS.HOME;
let appState = {
  user: null,
  surface: null,
  selectedClass: null,
  selectedTopic: null,
  currentBattle: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  root.innerHTML = '';
  renderScreen(currentScreen);
});

// Screen Renderer
function renderScreen(screen) {
  const root = document.getElementById('root');
  root.innerHTML = '';
  currentScreen = screen;

  switch (screen) {
    case SCREENS.HOME:
      root.appendChild(createHomeScreen());
      break;
    case SCREENS.SURFACE_GAME:
      root.appendChild(createSurfaceGameScreen());
      break;
    case SCREENS.SCHOOL_PORTAL:
      root.appendChild(createSchoolPortalScreen());
      break;
    case SCREENS.UNDERGROUND:
      root.appendChild(createUndergroundScreen());
      break;
    case SCREENS.BATTLE:
      root.appendChild(createBattleScreen());
      break;
    case SCREENS.RESULTS:
      root.appendChild(createResultsScreen());
      break;
    case SCREENS.LEADERBOARD:
      root.appendChild(createLeaderboardScreen());
      break;
    default:
      root.appendChild(createHomeScreen());
  }
}

// Navigation helper
function navigateTo(screen, state = {}) {
  appState = { ...appState, ...state };
  renderScreen(screen);
}

// Screen Components
function createHomeScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  div.innerHTML = `
    <div class="container">
      <div class="flex-center" style="min-height: 100vh; flex-direction: column; gap: 32px;">
        <div style="text-align: center;">
          <h1 style="font-size: 4rem; margin-bottom: 16px;">UNDERGROUND</h1>
          <h2 style="color: var(--accent); margin-bottom: 24px;">DEBATE CLUB</h2>
          <p style="font-size: 1.1rem; color: var(--text-dark); max-width: 600px;">
            Master the art of argumentation across three dimensions. Choose your path.
          </p>
        </div>

        <div class="grid-3" style="width: 100%; max-width: 1000px; gap: 24px;">
          <!-- Surface Game -->
          <div class="card card-interactive" onclick="navigateTo('${SCREENS.SURFACE_GAME}')">
            <div style="text-align: center;">
              <h3 style="color: var(--accent); margin-bottom: 12px;">🎮 SURFACE GAME</h3>
              <p>Word-based speed rounds. Quick reflexes, rapid responses.</p>
              <div class="badge" style="margin-top: 16px;">Fast-Paced</div>
            </div>
          </div>

          <!-- School Portal -->
          <div class="card card-interactive" onclick="navigateTo('${SCREENS.SCHOOL_PORTAL}')">
            <div style="text-align: center;">
              <h3 style="color: var(--accent-warm); margin-bottom: 12px;">🏫 SCHOOL PORTAL</h3>
              <p>Structured class-based competitions. Earn credentials.</p>
              <div class="badge badge-success" style="margin-top: 16px;">Formal</div>
            </div>
          </div>

          <!-- Underground -->
          <div class="card card-interactive" onclick="navigateTo('${SCREENS.UNDERGROUND}')">
            <div style="text-align: center;">
              <h3 style="color: var(--text-light); margin-bottom: 12px;">🕶️ UNDERGROUND</h3>
              <p>Unrestricted full debates. Maximum depth and complexity.</p>
              <div class="badge badge-warning" style="margin-top: 16px;">Intense</div>
            </div>
          </div>
        </div>

        <button class="button button-primary" onclick="navigateTo('${SCREENS.LEADERBOARD}')">
          View Global Rankings
        </button>
      </div>
    </div>
  `;
  return div;
}

function createSurfaceGameScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  
  const modes = [
    {
      name: 'Quick Round',
      time: '1 min',
      rounds: 1,
      desc: 'Lightning fast single-round debate',
      difficulty: 'Easy',
      rewards: 100,
      icon: '⚡'
    },
    {
      name: 'Speed Duel',
      time: '3 min',
      rounds: 3,
      desc: 'Multi-round rapid-fire exchanges',
      difficulty: 'Medium',
      rewards: 300,
      icon: '💨'
    },
    {
      name: 'Rapid Fire',
      time: '5 min',
      rounds: 5,
      desc: 'Extended high-intensity debate',
      difficulty: 'Hard',
      rewards: 500,
      icon: '🔥'
    }
  ];
  
  const stats = {
    totalWins: 47,
    streak: 8,
    totalMatches: 156,
    winRate: 72,
    avgScore: 385,
    totalPoints: 18420
  };
  
  div.innerHTML = `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h1>⚡ Surface Game</h1>
          <p class="text-sm" style="color: var(--text-dark); margin-top: 8px;">Rapid-fire debate tournaments</p>
        </div>
        <button class="button button-secondary" onclick="navigateTo('${SCREENS.HOME}')">
          Back
        </button>
      </div>

      <!-- Player Stats Banner -->
      <div class="grid-3" style="margin-bottom: 32px; gap: 24px;">
        <div class="card" style="background: rgba(0, 212, 255, 0.05); border-color: var(--accent);">
          <p class="text-sm">Total Wins</p>
          <h2 style="color: var(--accent); margin-top: 8px;">${stats.totalWins}</h2>
          <div class="badge" style="margin-top: 8px; font-size: 0.8rem;">+3 this week</div>
        </div>
        <div class="card" style="background: rgba(34, 197, 94, 0.05); border-color: var(--success);">
          <p class="text-sm">Current Streak</p>
          <h2 style="color: var(--success); margin-top: 8px;">${stats.streak}</h2>
          <p class="text-sm" style="margin-top: 8px; color: var(--text-dark);">Highest: 12</p>
        </div>
        <div class="card" style="background: rgba(255, 107, 53, 0.05); border-color: var(--accent-warm);">
          <p class="text-sm">Win Rate</p>
          <h2 style="color: var(--accent-warm); margin-top: 8px;">${stats.winRate}%</h2>
          <p class="text-sm" style="margin-top: 8px; color: var(--text-dark);">From ${stats.totalMatches} matches</p>
        </div>
      </div>

      <div class="grid-2" style="gap: 32px;">
        <!-- Game Mode Selection -->
        <div class="flex-col gap-6">
          <div class="card">
            <h3 style="margin-bottom: 24px;">Select Game Mode</h3>
            <div class="flex-col gap-4">
              ${modes.map(mode => `
                <div class="card card-interactive" style="background: rgba(0, 212, 255, 0.03); cursor: pointer; padding: 20px;"
                     onclick="navigateTo('${SCREENS.BATTLE}', {selectedClass: 'surface', selectedTopic: '${mode.name.toLowerCase().replace(/\\s+/g, '-')}'})">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                      <h4 style="color: var(--accent); margin-bottom: 4px;">${mode.icon} ${mode.name}</h4>
                      <p class="text-sm" style="color: var(--text-dark);">${mode.desc}</p>
                    </div>
                    <span class="badge badge-warning">${mode.time}</span>
                  </div>
                  <div class="flex-between" style="margin-top: 12px;">
                    <div>
                      <span class="text-sm" style="color: var(--text-dark);">Difficulty: </span>
                      <span class="text-sm" style="color: ${mode.difficulty === 'Easy' ? 'var(--success)' : mode.difficulty === 'Medium' ? 'var(--warning)' : 'var(--error)'};">
                        ${mode.difficulty}
                      </span>
                    </div>
                    <div>
                      <span class="text-sm" style="color: var(--accent);">+${mode.rewards} pts</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Rules -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">How It Works</h3>
            <div class="flex-col gap-4">
              <div>
                <h4 style="color: var(--accent); margin-bottom: 4px; font-size: 0.95rem;">1. Choose Mode</h4>
                <p class="text-sm">Pick your difficulty and time limit</p>
              </div>
              <div class="divider"></div>
              <div>
                <h4 style="color: var(--accent); margin-bottom: 4px; font-size: 0.95rem;">2. Get Matched</h4>
                <p class="text-sm">Face an AI opponent of equal skill</p>
              </div>
              <div class="divider"></div>
              <div>
                <h4 style="color: var(--accent); margin-bottom: 4px; font-size: 0.95rem;">3. Debate</h4>
                <p class="text-sm">Rapid exchanges with live scoring</p>
              </div>
              <div class="divider"></div>
              <div>
                <h4 style="color: var(--accent); margin-bottom: 4px; font-size: 0.95rem;">4. Earn Rewards</h4>
                <p class="text-sm">Win points and climb the leaderboard</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Stats -->
        <div class="flex-col gap-6">
          <!-- Detailed Stats -->
          <div class="card">
            <h3 style="margin-bottom: 24px;">Your Performance</h3>
            <div class="flex-col gap-4">
              <div>
                <div class="flex-between" style="margin-bottom: 8px;">
                  <span class="text-sm">Average Score</span>
                  <span style="color: var(--accent); font-weight: bold;">${stats.avgScore}</span>
                </div>
                <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                  <div style="background: linear-gradient(90deg, var(--accent), #00a8cc); height: 100%; width: 77%;"></div>
                </div>
              </div>

              <div class="divider"></div>

              <div>
                <div class="flex-between" style="margin-bottom: 8px;">
                  <span class="text-sm">Total Points</span>
                  <span style="color: var(--accent-warm); font-weight: bold;">${stats.totalPoints.toLocaleString()}</span>
                </div>
                <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                  <div style="background: linear-gradient(90deg, var(--accent-warm), #ff5722); height: 100%; width: 92%;"></div>
                </div>
              </div>

              <div class="divider"></div>

              <div>
                <div class="flex-between" style="margin-bottom: 8px;">
                  <span class="text-sm">Matches Played</span>
                  <span style="color: var(--success); font-weight: bold;">${stats.totalMatches}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Achievements -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">🏆 Achievements</h3>
            <div class="flex-col gap-3">
              <div class="badge badge-success">Flawless Victory (3)</div>
              <div class="badge badge-warning">Speed Demon (5+)</div>
              <div class="badge badge-success">Unstoppable (10+)</div>
            </div>
          </div>

          <!-- Next Match Info -->
          <div class="card" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 212, 255, 0.05)); border-color: var(--success);">
            <h3 style="color: var(--success); margin-bottom: 12px;">Next Milestone</h3>
            <p style="margin-bottom: 12px; color: var(--text-dark);">50 Total Wins</p>
            <div style="background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
              <div style="background: linear-gradient(90deg, var(--success), #16a34a); height: 100%; width: 94%;"></div>
            </div>
            <p class="text-sm" style="color: var(--text-dark);">3 wins away!</p>
          </div>
        </div>
      </div>
    </div>
  `;
  return div;
}

function createSchoolPortalScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  
  const classes = [
    {
      name: 'AP Debate 101',
      teacher: 'Ms. Johnson',
      students: 25,
      enrolled: 12,
      assignments: 3,
      nextDeadline: 'Mar 5',
      grade: 'A-'
    },
    {
      name: 'Rhetoric 401',
      teacher: 'Mr. Chen',
      students: 20,
      enrolled: 8,
      assignments: 5,
      nextDeadline: 'Mar 8',
      grade: 'A'
    },
    {
      name: 'Advanced Argumentation',
      teacher: 'Dr. Williams',
      students: 15,
      enrolled: 6,
      assignments: 2,
      nextDeadline: 'Mar 10',
      grade: 'B+'
    }
  ];
  
  const selectedClass = classes[0];
  
  const leaderboard = [
    { rank: 1, name: 'Sarah Martinez', points: 2450, debates: 28 },
    { rank: 2, name: 'Alex Kumar', points: 2180, debates: 24 },
    { rank: 3, name: 'Jordan Lee', points: 1920, debates: 21 },
    { rank: 4, name: 'Emma Thompson', points: 1750, debates: 19 },
    { rank: 5, name: 'You', points: 1580, debates: 17 }
  ];
  
  div.innerHTML = `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h1>🏫 School Portal</h1>
          <p class="text-sm" style="color: var(--text-dark); margin-top: 8px;">Structured academic debate</p>
        </div>
        <button class="button button-secondary" onclick="navigateTo('${SCREENS.HOME}')">
          Back
        </button>
      </div>

      <div class="grid-2" style="gap: 32px;">
        <!-- Classes -->
        <div class="flex-col gap-6">
          <div class="card">
            <h3 style="margin-bottom: 16px;">Your Classes</h3>
            <div class="flex-col gap-3">
              ${classes.map(cls => `
                <div class="card card-interactive" style="background: rgba(255, 107, 53, 0.03); cursor: pointer; padding: 16px;"
                     onclick="navigateTo('${SCREENS.BATTLE}', {selectedClass: '${cls.name.replace(/\\s+/g, '-').toLowerCase()}'})">
                  <div style="margin-bottom: 12px;">
                    <h4 style="color: var(--accent-warm); margin-bottom: 4px;">${cls.name}</h4>
                    <p class="text-sm" style="color: var(--text-dark);">Teacher: ${cls.teacher}</p>
                  </div>
                  <div class="flex-between" style="gap: 12px; flex-wrap: wrap;">
                    <span class="text-sm">${cls.enrolled}/${cls.students} enrolled</span>
                    <span class="badge badge-warning">${cls.assignments} assignments</span>
                    <span class="text-sm" style="color: var(--success);">Grade: ${cls.grade}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">📅 Upcoming Deadlines</h3>
            <div class="flex-col gap-3">
              ${classes.map(cls => `
                <div style="padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: var(--radius); border-left: 3px solid var(--accent);">
                  <div class="flex-between" style="margin-bottom: 4px;">
                    <span class="text-sm font-weight: bold;">${cls.name}</span>
                    <span class="text-sm" style="color: var(--warning);">${cls.nextDeadline}</span>
                  </div>
                  <p class="text-sm" style="color: var(--text-dark);">Next debate assignment</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Leaderboard & Stats -->
        <div class="flex-col gap-6">
          <!-- Class Leaderboard -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">🏆 ${selectedClass.name} Rankings</h3>
            <div class="flex-col gap-2">
              <div class="flex-between" style="padding-bottom: 12px; border-bottom: 1px solid var(--border);">
                <p class="text-sm" style="color: var(--text-dark);">Rank</p>
                <p class="text-sm" style="color: var(--text-dark);">Student</p>
                <p class="text-sm" style="color: var(--text-dark);">Points</p>
              </div>
              ${leaderboard.map(entry => `
                <div class="flex-between" style="padding: 8px 0; ${entry.rank === 5 ? 'background: rgba(0, 212, 255, 0.05); padding: 8px 12px; border-radius: var(--radius);' : ''}">
                  <span style="color: ${entry.rank === 1 ? 'var(--warning)' : 'var(--text-dark)'}; font-weight: bold; width: 30px;">#${entry.rank}</span>
                  <span>${entry.name}</span>
                  <span style="color: var(--accent); font-weight: bold;">${entry.points}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Your Stats -->
          <div class="card" style="background: rgba(0, 212, 255, 0.05); border-color: var(--accent);">
            <h3 style="margin-bottom: 16px;">Your Stats</h3>
            <div class="flex-col gap-4">
              <div>
                <p class="text-sm" style="color: var(--text-dark); margin-bottom: 4px;">Class Rank</p>
                <h2 style="color: var(--accent);">#5 of 25</h2>
              </div>
              <div class="divider"></div>
              <div>
                <p class="text-sm" style="color: var(--text-dark); margin-bottom: 4px;">Class Points</p>
                <h2 style="color: var(--accent-warm);">1,580</h2>
              </div>
              <div class="divider"></div>
              <div>
                <p class="text-sm" style="color: var(--text-dark); margin-bottom: 4px;">Debates</p>
                <h2 style="color: var(--success);">17</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return div;
}

function createUndergroundScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  
  const topics = [
    { name: 'AI Consciousness', debates: 18, icon: '🤖', trend: 'up' },
    { name: 'Free Will vs Determinism', debates: 42, icon: '🧠', trend: 'stable' },
    { name: 'Economics & Society', debates: 7, icon: '💰', trend: 'down' },
    { name: 'Climate Ethics', debates: 34, icon: '🌍', trend: 'up' },
    { name: 'Privacy Rights', debates: 25, icon: '🔐', trend: 'stable' },
    { name: 'Space Exploration Policy', debates: 12, icon: '🚀', trend: 'up' }
  ];
  
  const trending = [
    { title: 'Should AI be regulated?', participants: 156, heat: 92 },
    { title: 'Universal Basic Income Efficacy', participants: 234, heat: 88 },
    { title: 'Consciousness in Animals', participants: 89, heat: 76 }
  ];
  
  div.innerHTML = `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h1>Underground Arena</h1>
          <p class="text-sm" style="color: var(--text-dark); margin-top: 8px;">Unrestricted intellectual combat</p>
        </div>
        <button class="button button-secondary" onclick="navigateTo('${SCREENS.HOME}')">
          Back
        </button>
      </div>

      <!-- Live Stats -->
      <div class="grid-3" style="margin-bottom: 32px; gap: 24px;">
        <div class="card" style="background: rgba(0, 212, 255, 0.05); border-color: var(--accent);">
          <p class="text-sm">Active Debates</p>
          <h2 style="color: var(--accent); margin-top: 8px;">142</h2>
          <p class="text-sm" style="margin-top: 4px; color: var(--text-dark);">+12 this hour</p>
        </div>
        <div class="card" style="background: rgba(255, 107, 53, 0.05); border-color: var(--accent-warm);">
          <p class="text-sm">Active Debaters</p>
          <h2 style="color: var(--accent-warm); margin-top: 8px;">847</h2>
          <p class="text-sm" style="margin-top: 4px; color: var(--text-dark);">Peak engagement</p>
        </div>
        <div class="card" style="background: rgba(34, 197, 94, 0.05); border-color: var(--success);">
          <p class="text-sm">Topics</p>
          <h2 style="color: var(--success); margin-top: 8px;">312</h2>
          <p class="text-sm" style="margin-top: 4px; color: var(--text-dark);">Expanding daily</p>
        </div>
      </div>

      <div class="grid-2" style="gap: 32px;">
        <!-- Topic Selection -->
        <div class="flex-col gap-6">
          <div class="card">
            <h3 style="margin-bottom: 16px;">Find a Debate</h3>
            <input type="text" class="input" placeholder="Search topics...">
          </div>

          <!-- Featured Topics -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">Featured Topics</h3>
            <div class="flex-col gap-3">
              ${topics.slice(0, 4).map(topic => `
                <div class="card card-interactive" style="background: rgba(0, 212, 255, 0.03); cursor: pointer; padding: 16px;"
                     onclick="navigateTo('${SCREENS.BATTLE}', {selectedClass: 'underground', selectedTopic: '${topic.name.toLowerCase().replace(/\\s+/g, '-')}', selectedTopicName: '${topic.name}'})">
                  <div class="flex-between">
                    <div class="flex-col" style="gap: 4px;">
                      <p style="font-size: 1.1rem; font-weight: 600;">${topic.name}</p>
                      <div class="flex" style="gap: 8px; align-items: center;">
                        <span class="badge">${topic.debates} debates</span>
                        <span class="text-sm" style="color: ${topic.trend === 'up' ? 'var(--success)' : topic.trend === 'down' ? 'var(--error)' : 'var(--text-dark)'};">
                          ${topic.trend === 'up' ? '↑ Trending' : topic.trend === 'down' ? '↓ Cooling' : '— Stable'}
                        </span>
                      </div>
                    </div>
                    <div style="font-size: 2rem;">${topic.icon}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- All Topics -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">All Topics</h3>
            <div class="flex-col gap-2">
              ${topics.map(topic => `
                <div class="flex-between" style="padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: var(--radius); cursor: pointer; transition: all 0.2s;"
                     onmouseover="this.style.borderLeft='3px solid var(--accent)'; this.style.paddingLeft='9px';"
                     onmouseout="this.style.borderLeft='none'; this.style.paddingLeft='12px';"
                     onclick="navigateTo('${SCREENS.BATTLE}', {selectedClass: 'underground', selectedTopic: '${topic.name.toLowerCase().replace(/\\s+/g, '-')}', selectedTopicName: '${topic.name}'})">
                  <span>${topic.name}</span>
                  <span class="text-sm" style="color: var(--accent);">${topic.debates}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Trending & Stats -->
        <div class="flex-col gap-6">
          <!-- Trending Debates -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">🔥 Trending Now</h3>
            <div class="flex-col gap-4">
              ${trending.map(t => `
                <div style="padding: 16px; background: rgba(255, 107, 53, 0.05); border: 1px solid var(--border); border-radius: var(--radius);">
                  <h4 style="margin-bottom: 12px; color: var(--accent-warm);">${t.title}</h4>
                  <div class="flex-between" style="margin-bottom: 12px;">
                    <span class="text-sm">${t.participants} participants</span>
                    <span class="badge badge-warning">Heat: ${t.heat}%</span>
                  </div>
                  <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, var(--accent-warm), #ff5722); height: 100%; width: ${t.heat}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card">
            <h3 style="margin-bottom: 16px;">Your Underground Stats</h3>
            <div class="flex-col gap-4">
              <div>
                <p class="text-sm" style="color: var(--text-dark); margin-bottom: 4px;">Debates Participated</p>
                <h3 style="color: var(--accent);">23</h3>
              </div>
              <div class="divider"></div>
              <div>
                <p class="text-sm" style="color: var(--text-dark); margin-bottom: 4px;">Win Rate</p>
                <h3 style="color: var(--success);">68%</h3>
              </div>
              <div class="divider"></div>
              <div>
                <p class="text-sm" style="color: var(--text-dark); margin-bottom: 4px;">Total Points</p>
                <h3 style="color: var(--accent-warm);">12,840</h3>
              </div>
            </div>
          </div>

          <!-- Create Topic -->
          <div class="card" style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 53, 0.05)); border-color: var(--accent);">
            <h3 style="margin-bottom: 12px;">Start Something New</h3>
            <p style="margin-bottom: 16px; color: var(--text-dark); font-size: 0.9rem;">Create a custom debate topic</p>
            <button class="button button-primary" style="width: 100%;">
              Create New Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  return div;
}

function createBattleScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  
  const debateId = Math.random().toString(36).substring(7);
  const topic = appState.selectedTopic || 'General Debate';
  
  let debateState = {
    round: 1,
    maxRounds: 5,
    userScore: 0,
    opponentScore: 0,
    userArguments: [],
    opponentArguments: [],
    isWaiting: false
  };
  
  const updateBattle = () => {
    renderBattleContent(debateId, debateState, topic);
  };
  
  window.submitArgument = async function() {
    const textarea = document.querySelector(`#debate-${debateId} textarea`);
    const argument = textarea.value.trim();
    
    if (!argument) {
      alert('Please enter an argument');
      return;
    }
    
    if (debateState.isWaiting) {
      alert('Waiting for opponent response');
      return;
    }
    
    debateState.isWaiting = true;
    debateState.userArguments.push(argument);
    textarea.value = '';
    updateBattle();
    
    try {
      // Call debate function
      const debateResponse = await fetch('/.netlify/functions/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userArgument: argument,
          topic: topic,
          debateContext: debateState.userArguments.map((arg, i) => ({
            role: i % 2 === 0 ? 'user' : 'assistant',
            content: arg
          })),
          round: debateState.round,
          debateMode: appState.selectedClass === 'surface' ? 'surface' : appState.selectedClass === 'school' ? 'school' : 'underground'
        })
      }).then(r => {
        if (!r.ok) throw new Error('Debate API error: ' + r.status);
        return r.json();
      });
      
      if (debateResponse.success && debateResponse.debateResponse) {
        debateState.opponentArguments.push(debateResponse.debateResponse.counterArgument);
        
        // Call scoring function
        const scoreResponse = await fetch('/.netlify/functions/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userArgument: argument,
            opponentArgument: debateResponse.debateResponse.counterArgument,
            topic: topic,
            scoringCriteria: ['logic', 'evidence', 'clarity', 'rebuttal'],
            debateMode: appState.selectedClass === 'surface' ? 'surface' : appState.selectedClass === 'school' ? 'school' : 'underground'
          })
        }).then(r => {
          if (!r.ok) throw new Error('Scoring API error: ' + r.status);
          return r.json();
        });
        
        if (scoreResponse.success && scoreResponse.scoringResult) {
          const result = scoreResponse.scoringResult;
          debateState.userScore += result.userScore?.total || 250;
          debateState.opponentScore += result.opponentScore?.total || 220;
          debateState.round += 1;
        }
      }
      
      debateState.isWaiting = false;
      
      if (debateState.round > debateState.maxRounds) {
        navigateTo('${SCREENS.RESULTS}', {
          currentBattle: {
            userScore: debateState.userScore,
            opponentScore: debateState.opponentScore,
            topic: topic,
            debateId: debateId
          }
        });
      } else {
        updateBattle();
      }
    } catch (error) {
      console.error('[v0] Debate error:', error);
      debateState.isWaiting = false;
      alert('Error processing debate: ' + error.message);
      updateBattle();
    }
  };
  
  const renderBattleContent = (id, state, topic) => {
    const battleDiv = document.getElementById(`debate-${id}`);
    if (!battleDiv) return;
    
    battleDiv.innerHTML = `
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h2 style="margin-bottom: 8px;">${topic}</h2>
            <p class="text-sm" style="color: var(--text-dark);">Debate ID: ${id}</p>
          </div>
          <button class="button button-secondary" onclick="navigateTo('${SCREENS.HOME}')">
            Exit
          </button>
        </div>

        <!-- Score Bar -->
        <div class="card" style="margin-bottom: 32px;">
          <div style="display: flex; gap: 16px; align-items: center;">
            <div style="flex: 1;">
              <div style="font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span>You</span>
                <span style="color: var(--accent);">${state.userScore}</span>
              </div>
              <div style="background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--accent), #00a8cc); height: 100%; width: ${Math.min(100, (state.userScore / (state.opponentScore || 1)) * 100)}%;"></div>
              </div>
            </div>
            <div style="width: 60px; text-align: center; color: var(--text-dark);">vs</div>
            <div style="flex: 1;">
              <div style="font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span style="color: var(--accent-warm);">${state.opponentScore}</span>
                <span>Opponent</span>
              </div>
              <div style="background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #ff5722, var(--accent-warm)); height: 100%; width: ${Math.min(100, (state.opponentScore / (state.userScore || 1)) * 100)}%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Round Status -->
        <div class="card" style="margin-bottom: 32px; background: rgba(0, 212, 255, 0.05); border-color: var(--accent);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p class="text-sm">Round ${state.round} of ${state.maxRounds}</p>
              <h3 style="color: var(--accent); margin-top: 8px;">Debate in Progress</h3>
            </div>
            <div style="text-align: right;">
              <p class="text-sm">Arguments Exchanged</p>
              <h3 style="color: var(--accent);">${state.userArguments.length}</h3>
            </div>
          </div>
        </div>

        <!-- Argument History -->
        ${state.userArguments.length > 0 ? `
          <div class="card" style="margin-bottom: 32px;">
            <h3 style="margin-bottom: 24px;">Argument History</h3>
            <div class="flex-col gap-4" style="max-height: 300px; overflow-y: auto;">
              ${state.userArguments.map((arg, i) => `
                <div>
                  <div style="font-weight: bold; color: var(--accent); margin-bottom: 8px; font-size: 0.9rem;">YOUR ROUND ${i + 1}</div>
                  <p style="padding: 12px; background: rgba(0, 212, 255, 0.05); border-left: 3px solid var(--accent); border-radius: 4px;">${arg}</p>
                </div>
                ${state.opponentArguments[i] ? `
                  <div>
                    <div style="font-weight: bold; color: var(--accent-warm); margin-bottom: 8px; margin-top: 12px; font-size: 0.9rem;">OPPONENT ROUND ${i + 1}</div>
                    <p style="padding: 12px; background: rgba(255, 107, 53, 0.05); border-left: 3px solid var(--accent-warm); border-radius: 4px;">${state.opponentArguments[i]}</p>
                  </div>
                ` : ''}
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Input Section -->
        <div class="grid-2" style="gap: 32px;">
          <div class="card">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: var(--accent);">YOUR ARGUMENT</h2>
              ${state.isWaiting ? '<p class="text-sm pulse" style="margin-top: 8px;">Processing...</p>' : ''}
            </div>
            <textarea id="debate-${id}-input" class="input" placeholder="Make your argument..." style="min-height: 200px; resize: vertical; font-family: monospace;" ${state.isWaiting || state.round > state.maxRounds ? 'disabled' : ''}></textarea>
            <button class="button button-primary" style="width: 100%; margin-top: 16px;" onclick="window.submitArgument()" ${state.isWaiting || state.round > state.maxRounds ? 'disabled' : ''}>
              ${state.isWaiting ? 'Processing...' : 'Submit Argument'}
            </button>
          </div>

          <!-- Opponent Status -->
          <div class="card">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: var(--accent-warm);">OPPONENT</h2>
            </div>
            ${state.isWaiting ? `
              <div class="pulse" style="padding: 24px; background: rgba(255, 107, 53, 0.1); border: 1px dashed var(--accent-warm); border-radius: var(--radius); text-align: center;">
                <p style="color: var(--text-dark); margin-bottom: 16px;">AI is crafting response...</p>
                <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid var(--accent-warm); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              </div>
            ` : `
              <div style="padding: 24px; background: rgba(255, 107, 53, 0.05); border: 1px solid var(--border); border-radius: var(--radius); text-align: center;">
                <p style="color: var(--text-dark);">Ready for next argument</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  };
  
  div.id = `debate-${debateId}`;
  renderBattleContent(debateId, debateState, topic);
  
  return div;
}

function createResultsScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  
  const battle = appState.currentBattle || {
    userScore: 450,
    opponentScore: 380,
    topic: 'General Debate',
    debateId: 'demo'
  };
  
  const isUserWinner = battle.userScore > battle.opponentScore;
  const scoreDiff = Math.abs(battle.userScore - battle.opponentScore);
  
  div.innerHTML = `
    <style>
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .result-header {
        animation: slideInDown 0.6s ease;
      }
      .score-display {
        font-size: 4rem;
        font-weight: 900;
        background: linear-gradient(135deg, var(--accent), #00a8cc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .spinner {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 3px solid var(--accent);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    </style>
    <div class="container">
      <div class="flex-center" style="min-height: 100vh; flex-direction: column; gap: 32px;">
        <div class="result-header" style="text-align: center;">
          <h1 style="color: ${isUserWinner ? 'var(--success)' : 'var(--error)'}; margin-bottom: 16px; font-size: 3.5rem;">
            ${isUserWinner ? '✓ YOU WIN!' : 'OPPONENT WINS'}
          </h1>
          <p style="font-size: 1.1rem; color: var(--text-dark); margin-bottom: 8px;">
            ${isUserWinner ? 'Exceptional argumentation!' : 'Strong debate performance'}
          </p>
          <p class="text-sm" style="color: rgba(224, 224, 224, 0.6);">${battle.topic}</p>
        </div>

        <!-- Final Scores -->
        <div class="grid-2" style="max-width: 900px; width: 100%; gap: 24px;">
          <div class="card" style="background: ${isUserWinner ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-color: ${isUserWinner ? 'var(--success)' : 'var(--error)'};">
            <div style="text-align: center;">
              <p class="text-sm" style="color: var(--text-dark); margin-bottom: 12px;">YOUR FINAL SCORE</p>
              <div class="score-display">${battle.userScore}</div>
              ${isUserWinner ? '<div class="badge badge-success" style="margin-top: 16px; justify-content: center;">Winner</div>' : ''}
            </div>
          </div>

          <div class="card" style="background: rgba(255, 107, 53, 0.1); border-color: var(--accent-warm);">
            <div style="text-align: center;">
              <p class="text-sm" style="color: var(--text-dark); margin-bottom: 12px;">OPPONENT FINAL SCORE</p>
              <div style="font-size: 4rem; font-weight: 900; color: var(--accent-warm);">${battle.opponentScore}</div>
              ${!isUserWinner ? '<div class="badge badge-warning" style="margin-top: 16px; justify-content: center;">Winner</div>' : ''}
            </div>
          </div>
        </div>

        <!-- Score Differential -->
        <div class="card" style="width: 100%; max-width: 900px; background: rgba(0, 212, 255, 0.05); border-color: var(--accent);">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
            <div>
              <p class="text-sm" style="color: var(--text-dark);">Score Differential</p>
              <h2 style="color: var(--accent); margin-top: 8px;">+${scoreDiff} points</h2>
            </div>
            <div style="text-align: right;">
              <p class="text-sm" style="color: var(--text-dark);">Debate ID</p>
              <p style="font-family: monospace; color: var(--accent); margin-top: 4px;">${battle.debateId}</p>
            </div>
          </div>
        </div>

        <!-- Detailed Breakdown -->
        <div class="card" style="width: 100%; max-width: 900px;">
          <h3 style="margin-bottom: 24px;">Performance Breakdown</h3>
          <div class="flex-col gap-4">
            <div>
              <div class="flex-between" style="margin-bottom: 8px;">
                <span>Logic & Reasoning</span>
                <span style="color: var(--accent);">Strong</span>
              </div>
              <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--accent), #00a8cc); height: 100%; width: 85%;"></div>
              </div>
            </div>

            <div>
              <div class="flex-between" style="margin-bottom: 8px;">
                <span>Evidence Quality</span>
                <span style="color: var(--accent);">Solid</span>
              </div>
              <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--accent), #00a8cc); height: 100%; width: 75%;"></div>
              </div>
            </div>

            <div>
              <div class="flex-between" style="margin-bottom: 8px;">
                <span>Rebuttal Strength</span>
                <span style="color: var(--accent-warm);">Good</span>
              </div>
              <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--accent-warm), #ff5722); height: 100%; width: 68%;"></div>
              </div>
            </div>

            <div>
              <div class="flex-between" style="margin-bottom: 8px;">
                <span>Clarity</span>
                <span style="color: var(--success);">Excellent</span>
              </div>
              <div style="background: rgba(0, 0, 0, 0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--success), #16a34a); height: 100%; width: 92%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
          <button class="button button-primary" onclick="navigateTo('${SCREENS.HOME}')">
            Back to Home
          </button>
          <button class="button button-warm" onclick="navigateTo('${SCREENS.BATTLE}')">
            Play Again
          </button>
          <button class="button button-secondary" onclick="navigateTo('${SCREENS.LEADERBOARD}')">
            View Rankings
          </button>
        </div>
      </div>
    </div>
  `;
  return div;
}

function createLeaderboardScreen() {
  const div = document.createElement('div');
  div.className = 'fade-in';
  
  const globalRankings = [
    { rank: 1, name: 'Echo Prime', points: 12840, wins: 156, streak: 12, region: 'Global' },
    { rank: 2, name: 'Logic Master', points: 11250, wins: 142, streak: 8, region: 'North America' },
    { rank: 3, name: 'Rhetoric King', points: 10920, wins: 138, streak: 15, region: 'Europe' },
    { rank: 4, name: 'Debate Phoenix', points: 10100, wins: 121, streak: 5, region: 'Asia' },
    { rank: 5, name: 'Argument Scholar', points: 9850, wins: 118, streak: 9, region: 'Global' },
    { rank: 6, name: 'Discourse Master', points: 9420, wins: 112, streak: 3, region: 'South America' },
    { rank: 7, name: 'Logic Sage', points: 8950, wins: 107, streak: 11, region: 'Europe' },
    { rank: 8, name: 'Debate Wizard', points: 8680, wins: 104, streak: 7, region: 'North America' }
  ];
  
  const yourRank = {
    rank: 347,
    name: 'Your Username',
    points: 4280,
    wins: 52,
    streak: 6,
    region: 'North America'
  };
  
  div.innerHTML = `
    <style>
      .rank-badge {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.9rem;
      }
      .rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; }
      .rank-2 { background: linear-gradient(135deg, #C0C0C0, #808080); color: #fff; }
      .rank-3 { background: linear-gradient(135deg, #CD7F32, #8B4513); color: #fff; }
      .rank-default { background: var(--border); color: var(--text-light); }
    </style>
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <h1>🏆 Global Rankings</h1>
        <button class="button button-secondary" onclick="navigateTo('${SCREENS.HOME}')">
          Back
        </button>
      </div>

      <!-- Your Rank -->
      <div class="card" style="margin-bottom: 32px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 53, 0.05)); border: 2px solid var(--accent);">
        <div class="flex-between" style="align-items: center;">
          <div class="flex-between" style="gap: 24px; flex: 1;">
            <div class="rank-badge rank-default" style="width: 48px; height: 48px; font-size: 1.2rem;">#${yourRank.rank}</div>
            <div>
              <h3 style="color: var(--accent);">${yourRank.name}</h3>
              <p class="text-sm" style="color: var(--text-dark); margin-top: 4px;">${yourRank.region}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="color: var(--accent-warm);">${yourRank.points.toLocaleString()}</h2>
            <p class="text-sm" style="color: var(--text-dark);">points</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom: 32px;">
        <div class="flex-between" style="flex-wrap: wrap; gap: 16px;">
          <h3>Top Debaters</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="button" style="padding: 8px 16px; background: var(--accent); color: var(--primary); border-radius: var(--radius); border: none; cursor: pointer; font-size: 0.85rem;">All Time</button>
            <button class="button" style="padding: 8px 16px; background: transparent; color: var(--accent); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; font-size: 0.85rem;">This Month</button>
            <button class="button" style="padding: 8px 16px; background: transparent; color: var(--accent); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; font-size: 0.85rem;">This Week</button>
          </div>
        </div>
      </div>

      <!-- Leaderboard Table -->
      <div class="card">
        <div class="flex-col gap-2" style="overflow-x: auto;">
          <!-- Header -->
          <div class="flex-between" style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: var(--radius); font-weight: bold; margin-bottom: 8px;">
            <div style="flex: 0.5;">Rank</div>
            <div style="flex: 2;">Name</div>
            <div style="flex: 1; text-align: right;">Points</div>
            <div style="flex: 1; text-align: right;">Wins</div>
            <div style="flex: 1; text-align: right;">Streak</div>
            <div style="flex: 1.5; text-align: right;">Region</div>
          </div>

          <!-- Rankings -->
          ${globalRankings.map(entry => `
            <div class="flex-between" style="padding: 12px 16px; background: rgba(0, 0, 0, 0.15); border-radius: var(--radius); margin-bottom: 8px; border-left: 3px solid ${entry.rank === 1 ? '#FFD700' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'var(--accent)'};">
              <div style="flex: 0.5;">
                <div class="rank-badge ${entry.rank <= 3 ? 'rank-' + entry.rank : 'rank-default'}">${entry.rank}</div>
              </div>
              <div style="flex: 2; font-weight: 600;">${entry.name}</div>
              <div style="flex: 1; text-align: right; color: var(--accent); font-weight: bold;">${entry.points.toLocaleString()}</div>
              <div style="flex: 1; text-align: right; color: var(--success);">${entry.wins}</div>
              <div style="flex: 1; text-align: right;">
                <span class="badge badge-success">${entry.streak}🔥</span>
              </div>
              <div style="flex: 1.5; text-align: right; color: var(--text-dark); font-size: 0.9rem;">${entry.region}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Stats Section -->
      <div class="grid-3" style="margin-top: 32px; gap: 24px;">
        <div class="card">
          <h3 style="margin-bottom: 12px;">Highest Streak</h3>
          <h2 style="color: var(--accent-warm);">15 🔥</h2>
          <p class="text-sm" style="margin-top: 8px; color: var(--text-dark);">Rhetoric King</p>
        </div>
        <div class="card">
          <h3 style="margin-bottom: 12px;">Most Debates</h3>
          <h2 style="color: var(--success);">1,248</h2>
          <p class="text-sm" style="margin-top: 8px; color: var(--text-dark);">Echo Prime</p>
        </div>
        <div class="card">
          <h3 style="margin-bottom: 12px;">Highest Average</h3>
          <h2 style="color: var(--accent);">445</h2>
          <p class="text-sm" style="margin-top: 8px; color: var(--text-dark);">Points per debate</p>
        </div>
      </div>
    </div>
  `;
  return div;
}
