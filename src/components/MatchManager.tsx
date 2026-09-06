import { useState, type FormEvent } from 'react';
import { Match, DistanceMeters, Player, Team } from '../types';
import {
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Flag,
  Play,
  RotateCcw,
} from 'lucide-react';

interface MatchManagerProps {
  currentMatch: Match;
  matchesList: Match[];
  onSelectMatch: (match: Match) => void;
  onCreateMatch: (matchData: Partial<Match>) => Promise<any>;
  onFinishMatch: () => Promise<any>;
  onResetDemo: () => void;
}

export default function MatchManager({
  currentMatch,
  matchesList,
  onSelectMatch,
  onCreateMatch,
  onFinishMatch,
  onResetDemo,
}: MatchManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states
  const [matchName, setMatchName] = useState<string>('National Championship — Singles');
  const [matchDate, setMatchDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [location, setLocation] = useState<string>('Center Court 1');
  const [targetScore, setTargetScore] = useState<number>(13);
  const [initialDistance, setInitialDistance] = useState<DistanceMeters>('7m');

  // Team A
  const [teamAName, setTeamAName] = useState<string>('INDONESIA');
  const [playersAStr, setPlayersAStr] = useState<string>('Heri, Muhlizi, Topan');

  // Team B
  const [teamBName, setTeamBName] = useState<string>('THAILAND');
  const [playersBStr, setPlayersBStr] = useState<string>('Thanakorn, Ratchata, Sarawut');

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const playersA: Player[] = playersAStr
        .split(',')
        .map((p, idx) => ({
          id: `p_a_${Date.now()}_${idx}`,
          name: p.trim() || `Player A${idx + 1}`,
          teamId: 'team_custom_a',
          role: idx === 0 ? 'POINTER' : idx === 1 ? 'SHOOTER' : 'MILIEU',
          number: idx + 1,
        }))
        .filter((p) => p.name.length > 0);

      const playersB: Player[] = playersBStr
        .split(',')
        .map((p, idx) => ({
          id: `p_b_${Date.now()}_${idx}`,
          name: p.trim() || `Player B${idx + 1}`,
          teamId: 'team_custom_b',
          role: idx === 0 ? 'POINTER' : idx === 1 ? 'SHOOTER' : 'MILIEU',
          number: idx + 1,
        }))
        .filter((p) => p.name.length > 0);

      const teamA: Team = {
        id: 'team_custom_a',
        name: teamAName.trim() || 'Team A',
        color: '#ED2939',
        players: playersA,
      };

      const teamB: Team = {
        id: 'team_custom_b',
        name: teamBName.trim() || 'Team B',
        color: '#0055A5',
        players: playersB,
      };

      await onCreateMatch({
        name: matchName,
        date: matchDate,
        location,
        targetScore,
        currentDistance: initialDistance,
        teamA,
        teamB,
      });

      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create match:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
              Match Setup & Records
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create new petanque competition matches, register teams, and review match history
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onResetDemo}
            title="Muat ulang seluruh 3 data pertandingan standar (Tabel 1.1 Triple Men, Mixed Triple, dan SEA Games)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#002395]" />
            <span>Muat Ulang 3 Match Standar</span>
          </button>

          <button
            id="btn-open-create-match"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-[#002395] hover:bg-[#001b70] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Match</span>
          </button>
        </div>
      </div>

      {/* Active Match Card */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
              CURRENT ACTIVE MATCH
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Status: {currentMatch.status}
            </span>
          </div>

          {currentMatch.status === 'LIVE' && (
            <button
              onClick={onFinishMatch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Conclude / Finish Match</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <h3 className="text-lg font-bold font-['Outfit']">{currentMatch.name}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {currentMatch.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentMatch.location}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 bg-slate-800 p-2.5 rounded-md border border-slate-700">
            <div className="text-right">
              <span className="text-xs font-bold uppercase text-[#002395] bg-blue-100/10 px-1.5 py-0.5 rounded block truncate">
                {currentMatch.teamA.name}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {currentMatch.scoreA}
              </span>
            </div>
            <span className="text-xl font-mono text-slate-500">:</span>
            <div className="text-left">
              <span className="text-xs font-bold uppercase text-[#ED2939] bg-red-100/10 px-1.5 py-0.5 rounded block truncate">
                {currentMatch.teamB.name}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {currentMatch.scoreB}
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-0.5">
            <p>
              Target Score: <strong className="text-white">{currentMatch.targetScore} pts</strong>
            </p>
            <p>
              Current End: <strong className="text-white">End {currentMatch.currentEndNumber}</strong>
            </p>
            <p>
              Total Actions:{' '}
              <strong className="text-green-400 font-mono">
                {currentMatch.actions.length} throws
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Available Matches List */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
              Daftar Semua Pertandingan ({matchesList.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Klik kartu pertandingan untuk berpindah atau melihat analisisnya</span>
          </div>
        </div>

        {matchesList.length < 3 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs text-amber-800">
            <span>
              ℹ️ Browser Anda baru memuat {matchesList.length} pertandingan. Tersedia 3 pertandingan resmi (Tabel 1.1 Triple Men, Mixed Triple, dan SEA Games).
            </span>
            <button
              onClick={onResetDemo}
              className="px-3 py-1 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 transition-colors"
            >
              Muat Semua 3 Match
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {matchesList.map((m) => {
            const isSelected = m.id === currentMatch.id;
            const isDisertasiMen = m.id === 'match_triple_men_20okt';
            const isDisertasiMixed = m.id === 'match_mixed_triple_26okt';
            const isSeaGames = m.id === 'match_demo_01';

            return (
              <div
                key={m.id}
                onClick={() => onSelectMatch(m)}
                className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/50 border-[#002395] ring-2 ring-[#002395] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isDisertasiMen
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : isDisertasiMixed
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : isSeaGames
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isDisertasiMen
                        ? 'Tabel 1.1 Disertasi'
                        : isDisertasiMixed
                        ? 'Mixed Triple Disertasi'
                        : isSeaGames
                        ? 'SEA Games Live Demo'
                        : m.category || 'Match'}
                    </span>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        m.status === 'LIVE'
                          ? 'bg-green-100 text-green-800 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mt-1 leading-snug">
                    {m.name}
                  </h4>

                  <div className="mt-2 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between items-center py-0.5">
                      <span className="truncate max-w-[140px] text-slate-800">{m.teamA.name}</span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 rounded">{m.scoreA}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="truncate max-w-[140px] text-slate-800">{m.teamB.name}</span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 rounded">{m.scoreB}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{m.actions.length} lemparan ({m.ends.length} end)</span>
                    <span className="font-mono">{m.date}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2">
                  {isSelected ? (
                    <div className="w-full py-1.5 px-3 bg-[#002395] text-white rounded text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sedang Aktif Dipilih</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMatch(m);
                      }}
                      className="w-full py-1.5 px-3 bg-slate-100 hover:bg-[#002395] text-slate-700 hover:text-white rounded text-xs font-bold text-center transition-colors"
                    >
                      Buka Pertandingan Ini
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE MATCH MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-xl border border-slate-200 p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Create Petanque Match
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Match Name</label>
                <input
                  type="text"
                  required
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#002395] focus:border-[#002395]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#002395] focus:border-[#002395]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Score</label>
                  <input
                    type="number"
                    min="1"
                    max="21"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#002395] focus:border-[#002395]"
                  />
                </div>
              </div>

              {/* Team A setup */}
              <div className="p-3 rounded-md border border-blue-200 bg-blue-50/40 space-y-2">
                <span className="font-bold text-[#002395] uppercase text-[11px] block">
                  Team A (Primary side)
                </span>
                <input
                  type="text"
                  placeholder="Team A Name (e.g. INDONESIA)"
                  required
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-md px-3 py-1.5 text-slate-900 font-bold"
                />
                <input
                  type="text"
                  placeholder="Athletes (comma separated, e.g. Heri, Muhlizi, Topan)"
                  required
                  value={playersAStr}
                  onChange={(e) => setPlayersAStr(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-md px-3 py-1.5 text-slate-800"
                />
              </div>

              {/* Team B setup */}
              <div className="p-3 rounded-md border border-red-200 bg-red-50/40 space-y-2">
                <span className="font-bold text-[#ED2939] uppercase text-[11px] block">
                  Team B (Secondary side)
                </span>
                <input
                  type="text"
                  placeholder="Team B Name (e.g. THAILAND)"
                  required
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className="w-full bg-white border border-red-200 rounded-md px-3 py-1.5 text-slate-900 font-bold"
                />
                <input
                  type="text"
                  placeholder="Athletes (comma separated, e.g. Thanakorn, Ratchata, Sarawut)"
                  required
                  value={playersBStr}
                  onChange={(e) => setPlayersBStr(e.target.value)}
                  className="w-full bg-white border border-red-200 rounded-md px-3 py-1.5 text-slate-800"
                />
              </div>

              {/* Initial Distance for End 1 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Initial Distance for End 1
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['6m', '7m', '8m', '9m'] as DistanceMeters[]).map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setInitialDistance(d)}
                      className={`py-1.5 rounded-md font-bold text-xs border ${
                        initialDistance === d
                          ? 'bg-[#002395] text-white border-[#002395]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="create-match-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-2 bg-[#002395] hover:bg-[#001b70] text-white font-bold rounded-md text-xs shadow-xs transition-colors"
                >
                  Start Match & Launch Scorer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
