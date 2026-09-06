import { useState, useMemo } from 'react';
import {
  Match,
  DistanceMeters,
  ActionType,
  ActionResult,
  Player,
  ThrowAction,
  PointingTechnique,
  ShootingTechnique,
} from '../types';
import { DISTANCES, calculateEndBouleCounts } from '../lib/calculations';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Flag,
  ArrowRight,
  Target,
  Trophy,
  History,
} from 'lucide-react';

interface MobileScorerProps {
  match: Match;
  onRecordAction: (actionData: Partial<ThrowAction>) => Promise<any>;
  onDeleteAction: (actionId: string) => Promise<any>;
  onCompleteEnd: (
    endNumber: number,
    scoreA: number,
    scoreB: number,
    nextDistance: string
  ) => Promise<any>;
  onFinishMatch: () => Promise<any>;
}

export default function MobileScorer({
  match,
  onRecordAction,
  onDeleteAction,
  onCompleteEnd,
  onFinishMatch,
}: MobileScorerProps) {
  // Active throw selection states
  const [selectedTeamId, setSelectedTeamId] = useState<string>(match.teamA.id);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    match.teamA.players[0]?.id || ''
  );
  const [actionType, setActionType] = useState<ActionType>('POINTING');
  const [distance, setDistance] = useState<DistanceMeters>(match.currentDistance || '8m');
  const [result, setResult] = useState<ActionResult>('SUCCESS');
  const [isCarreau, setIsCarreau] = useState<boolean>(false);
  const [distanceToJackCm, setDistanceToJackCm] = useState<string>('20');
  const [customCmInput, setCustomCmInput] = useState<boolean>(false);

  // Sub-teknik Pointing & Shooting sesuai Bab II Hal 17-21 Proposal Disertasi Rasyono
  const [pointingTechnique, setPointingTechnique] = useState<PointingTechnique>('ROLLING');
  const [shootingTechnique, setShootingTechnique] = useState<ShootingTechnique>('IRON');

  // End completion modal/drawer
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [endPointsTeamA, setEndPointsTeamA] = useState<number>(0);
  const [endPointsTeamB, setEndPointsTeamB] = useState<number>(0);
  const [nextEndDistance, setNextEndDistance] = useState<DistanceMeters>('8m');

  // Status feedback
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  // Live End Boule Tracking (Triples: 6 boules per team per end)
  const bouleCounts = useMemo(() => {
    return calculateEndBouleCounts(
      match.actions,
      match.currentEndNumber,
      match.teamA.id,
      match.teamB.id,
      6
    );
  }, [match.actions, match.currentEndNumber, match.teamA.id, match.teamB.id]);

  // Available players based on selected team
  const currentTeam = selectedTeamId === match.teamA.id ? match.teamA : match.teamB;
  const opposingTeam = selectedTeamId === match.teamA.id ? match.teamB : match.teamA;

  // Selected player object
  const selectedPlayer = currentTeam.players.find((p) => p.id === selectedPlayerId);

  // Throws for selected player in this end
  const selectedPlayerEndThrows = useMemo(() => {
    if (!selectedPlayer) return [];
    return match.actions.filter(
      (a) => a.endNumber === match.currentEndNumber && a.playerId === selectedPlayer.id
    );
  }, [match.actions, match.currentEndNumber, selectedPlayer]);

  // Recent throws for current end
  const currentEndActions = match.actions.filter(
    (a) => a.endNumber === match.currentEndNumber
  );
  const lastAction = currentEndActions[currentEndActions.length - 1];

  // Quick select team & auto pick first player
  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    const targetTeam = teamId === match.teamA.id ? match.teamA : match.teamB;
    if (targetTeam.players.length > 0) {
      setSelectedPlayerId(targetTeam.players[0].id);
    }
  };

  // Submit recorded action
  const handleSaveAction = async () => {
    if (!selectedPlayer) return;
    setSubmitting(true);

    try {
      const parsedDistCm =
        actionType === 'POINTING' && distanceToJackCm
          ? parseFloat(distanceToJackCm)
          : undefined;

      const calculatedBouleNumber = (selectedPlayerEndThrows.length + 1) as 1 | 2;

      await onRecordAction({
        endNumber: match.currentEndNumber,
        teamId: selectedTeamId,
        playerId: selectedPlayer.id,
        playerName: selectedPlayer.name,
        actionType,
        distance,
        result,
        scoreValue: result === 'SUCCESS' ? 1 : 0,
        bouleNumber: calculatedBouleNumber <= 2 ? calculatedBouleNumber : 2,
        carreau: actionType === 'SHOOTING' && result === 'SUCCESS' ? isCarreau : false,
        pointingTechnique: actionType === 'POINTING' ? pointingTechnique : undefined,
        shootingTechnique: actionType === 'SHOOTING' ? shootingTechnique : undefined,
        distanceToJackCm: !isNaN(parsedDistCm as number) ? parsedDistCm : undefined,
      });

      // Show brief tactile confirmation
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1200);

      // Reset specific throw-dependent states, keep team and distance ready
      if (actionType === 'SHOOTING') {
        setIsCarreau(false);
      }
    } catch (err) {
      console.error('Failed to record action:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishEndSubmit = async () => {
    setSubmitting(true);
    try {
      await onCompleteEnd(
        match.currentEndNumber,
        endPointsTeamA,
        endPointsTeamB,
        nextEndDistance
      );
      setShowEndModal(false);
      setEndPointsTeamA(0);
      setEndPointsTeamB(0);
      setDistance(nextEndDistance);
    } catch (err) {
      console.error('Failed to complete end:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-16 px-3 sm:px-4">
      {/* Top Scorer Header: Matchup & Score (Professional Polish White Card) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Scoring Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2">
            {match.status === 'LIVE' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIVE END {match.currentEndNumber} ({match.currentDistance})
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                MATCH FINISHED
              </span>
            )}
          </div>
        </div>

        {/* Live Score Board with High-Contrast Digits */}
        <div className="grid grid-cols-5 items-center gap-2 text-center">
          {/* Team A */}
          <div
            onClick={() => handleSelectTeam(match.teamA.id)}
            className={`col-span-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
              selectedTeamId === match.teamA.id
                ? 'bg-blue-50/70 border-[#002395] shadow-xs'
                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 uppercase truncate">
                {match.teamA.name}
              </p>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                {bouleCounts.teamA.thrown}/6 bosi
              </span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#002395] font-mono tracking-tight mt-0.5">
              {match.scoreA.toString().padStart(2, '0')}
            </p>
            {selectedTeamId === match.teamA.id ? (
              <span className="inline-block mt-1 text-[10px] font-bold text-[#002395] uppercase tracking-wider bg-blue-100/70 px-1.5 py-0.2 rounded">
                Active Turn
              </span>
            ) : (
              <span className="inline-block mt-1 text-[10px] text-slate-400">
                Tap to record
              </span>
            )}
          </div>

          {/* Center End info */}
          <div className="text-center font-mono">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              End
            </span>
            <span className="text-2xl font-black text-slate-800">
              {match.currentEndNumber}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 block">
              {bouleCounts.totalThrown}/12 bosi
            </span>
          </div>

          {/* Team B */}
          <div
            onClick={() => handleSelectTeam(match.teamB.id)}
            className={`col-span-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
              selectedTeamId === match.teamB.id
                ? 'bg-red-50/70 border-[#ED2939] shadow-xs'
                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 uppercase truncate">
                {match.teamB.name}
              </p>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                {bouleCounts.teamB.thrown}/6 bosi
              </span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#ED2939] font-mono tracking-tight mt-0.5">
              {match.scoreB.toString().padStart(2, '0')}
            </p>
            {selectedTeamId === match.teamB.id ? (
              <span className="inline-block mt-1 text-[10px] font-bold text-[#ED2939] uppercase tracking-wider bg-red-100/70 px-1.5 py-0.2 rounded">
                Active Turn
              </span>
            ) : (
              <span className="inline-block mt-1 text-[10px] text-slate-400">
                Tap to record
              </span>
            )}
          </div>
        </div>

        {/* End & Distance Info Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-500">
            <span>First to {match.targetScore} pts</span>
            <span>•</span>
            <span className="font-bold text-slate-700 font-mono">{match.currentDistance} Jack</span>
          </div>

          <button
            id="scorer-btn-finish-end"
            onClick={() => setShowEndModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-md text-xs transition-colors shadow-2xs"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Complete End {match.currentEndNumber}</span>
          </button>
        </div>
      </div>

      {/* Main Scorer Touch Interface */}
      <div className="space-y-4">
        {/* STEP 1: TEAM SELECTION TABS */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2.5">
            <div className="w-1 h-3.5 bg-[#002395]" />
            <span>1. Select Team</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="scorer-team-a"
              onClick={() => handleSelectTeam(match.teamA.id)}
              className={`py-3 px-3 rounded-lg font-bold text-sm text-center transition-all flex items-center justify-center gap-2 border ${
                selectedTeamId === match.teamA.id
                  ? 'bg-[#002395] text-white border-[#002395] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
              <span className="truncate">{match.teamA.name}</span>
            </button>

            <button
              id="scorer-team-b"
              onClick={() => handleSelectTeam(match.teamB.id)}
              className={`py-3 px-3 rounded-lg font-bold text-sm text-center transition-all flex items-center justify-center gap-2 border ${
                selectedTeamId === match.teamB.id
                  ? 'bg-[#ED2939] text-white border-[#ED2939] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
              <span className="truncate">{match.teamB.name}</span>
            </button>
          </div>
        </div>

        {/* STEP 2: PLAYER SELECTION */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-3.5 bg-[#002395]" />
              <span>2. Select Player ({currentTeam.name})</span>
            </label>
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <span>{selectedPlayer?.name || 'Select player'}</span>
              {selectedPlayer && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    selectedPlayerEndThrows.length >= 2
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Boule {Math.min(selectedPlayerEndThrows.length + 1, 2)} of 2
                  {selectedPlayerEndThrows.length >= 2 && ' (Limit)'}
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {currentTeam.players.map((player: Player) => {
              const isSelected = selectedPlayerId === player.id;
              const isTeamA = selectedTeamId === match.teamA.id;
              const playerThrowsThisEnd = match.actions.filter(
                (a) => a.endNumber === match.currentEndNumber && a.playerId === player.id
              ).length;

              return (
                <button
                  key={player.id}
                  id={`scorer-player-${player.id}`}
                  onClick={() => setSelectedPlayerId(player.id)}
                  className={`py-2.5 px-2 rounded-lg font-bold text-sm transition-all text-center flex flex-col items-center justify-center gap-0.5 border relative ${
                    isSelected
                      ? isTeamA
                        ? 'bg-[#002395] text-white border-[#002395] shadow-xs'
                        : 'bg-[#ED2939] text-white border-[#ED2939] shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] opacity-80 mb-0.5">
                    <span className="truncate">{player.role || 'Athlete'}</span>
                    <span className="font-mono font-bold">{playerThrowsThisEnd}/2</span>
                  </div>
                  <span className="text-sm font-black truncate w-full">{player.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3: ACTION TYPE & SUB-TECHNIQUE */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <div className="w-1 h-3.5 bg-[#002395]" />
              <span>3. Action Type & Teknik (RASTA Petanque)</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="scorer-action-pointing"
                onClick={() => {
                  setActionType('POINTING');
                  setIsCarreau(false);
                }}
                className={`py-3 px-3 rounded-lg font-black text-sm flex items-center justify-center gap-2 border transition-all ${
                  actionType === 'POINTING'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>POINTING</span>
              </button>

              <button
                id="scorer-action-shooting"
                onClick={() => setActionType('SHOOTING')}
                className={`py-3 px-3 rounded-lg font-black text-sm flex items-center justify-center gap-2 border transition-all ${
                  actionType === 'SHOOTING'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>SHOOTING</span>
              </button>
            </div>
          </div>

          {/* Sub-Technique Selector */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Sub-Teknik ({actionType === 'POINTING' ? 'Lemparan Pointing' : 'Lemparan Shooting'})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Bab II Hal 17-21</span>
            </div>

            {actionType === 'POINTING' ? (
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'ROLLING' as PointingTechnique, label: 'Rolling', desc: 'Menyusur / Gesur' },
                  { id: 'HALF_LOB' as PointingTechnique, label: 'Soft-Lob', desc: '1/2 Parabola' },
                  { id: 'HIGH_LOB' as PointingTechnique, label: 'High-Lob', desc: 'Parabola Tinggi' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPointingTechnique(item.id)}
                    className={`py-2 px-1.5 rounded-md border text-center transition-all ${
                      pointingTechnique === item.id
                        ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-black">{item.label}</span>
                    <span className="block text-[9px] opacity-80 truncate">{item.desc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'IRON' as ShootingTechnique, label: 'Au Fer', desc: 'Shot on Iron' },
                  { id: 'SHORT_SHOT' as ShootingTechnique, label: 'Short Shot', desc: 'Jatuh Depan Target' },
                  { id: 'GROUND_SHOT' as ShootingTechnique, label: 'Ground Shot', desc: 'Rasant / Menyusur' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setShootingTechnique(item.id)}
                    className={`py-2 px-1.5 rounded-md border text-center transition-all ${
                      shootingTechnique === item.id
                        ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-black">{item.label}</span>
                    <span className="block text-[9px] opacity-80 truncate">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STEP 4: DISTANCE SELECTION */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-3.5 bg-[#002395]" />
              <span>4. Target Distance</span>
            </label>
            <span className="text-[11px] font-bold text-[#002395] bg-blue-50 px-2 py-0.5 rounded">
              Current: {distance}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {DISTANCES.map((d) => (
              <button
                key={d}
                id={`scorer-distance-${d}`}
                onClick={() => setDistance(d)}
                className={`py-2.5 rounded-lg font-mono font-black text-sm text-center border transition-all ${
                  distance === d
                    ? 'bg-[#002395] text-white border-[#002395] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 5: RESULT ([ SUCCESS ] vs [ FAIL ]) */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2.5">
            <div className="w-1 h-3.5 bg-[#002395]" />
            <span>5. Outcome Result</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="scorer-result-success"
              onClick={() => setResult('SUCCESS')}
              className={`py-3.5 px-4 rounded-lg font-black text-sm flex items-center justify-center gap-2 border transition-all ${
                result === 'SUCCESS'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>1 • BERHASIL</span>
            </button>

            <button
              id="scorer-result-fail"
              onClick={() => {
                setResult('FAIL');
                setIsCarreau(false);
              }}
              className={`py-3.5 px-4 rounded-lg font-black text-sm flex items-center justify-center gap-2 border transition-all ${
                result === 'FAIL'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>0 • GAGAL</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center font-mono">
            Nilai skor lemparan: <strong>1</strong> (Poin Masuk / Hit) atau <strong>0</strong> (Meleset / Out)
          </p>
        </div>

        {/* CONDITIONAL 1: SHOOTING QUALITY (CARREAU vs NON-CARREAU) */}
        {actionType === 'SHOOTING' && result === 'SUCCESS' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Shooting Quality (Target Replacement)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="scorer-carreau-yes"
                onClick={() => setIsCarreau(true)}
                className={`py-2.5 px-3 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  isCarreau
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <span>★ CARREAU (Direct Replace)</span>
              </button>

              <button
                id="scorer-carreau-no"
                onClick={() => setIsCarreau(false)}
                className={`py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                  !isCarreau
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <span>REGULAR HIT</span>
              </button>
            </div>
          </div>
        )}

        {/* CONDITIONAL 2: DISTANCE CONTROL (Boule to Jack in cm for Pointing) */}
        {actionType === 'POINTING' && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#002395]" />
                Distance Control (Boule to Jack: {distanceToJackCm || '0'} cm)
              </label>
              <button
                onClick={() => setCustomCmInput(!customCmInput)}
                className="text-[11px] font-bold text-[#002395] hover:underline"
              >
                {customCmInput ? 'Presets' : 'Custom input'}
              </button>
            </div>

            {customCmInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={distanceToJackCm}
                  onChange={(e) => setDistanceToJackCm(e.target.value)}
                  className="w-full bg-white border border-blue-300 rounded-md px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002395]"
                  placeholder="Distance in cm..."
                />
                <span className="text-xs font-bold text-blue-900">cm</span>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1.5">
                {['10', '20', '30', '50', '80'].map((cm) => (
                  <button
                    key={cm}
                    onClick={() => setDistanceToJackCm(cm)}
                    className={`py-2 rounded-md text-xs font-mono font-bold border transition-colors ${
                      distanceToJackCm === cm
                        ? 'bg-[#002395] text-white border-[#002395]'
                        : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    {cm} cm
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRIMARY SAVE ACTION BUTTON */}
        <div className="pt-2">
          <button
            id="scorer-btn-save-action"
            disabled={submitting}
            onClick={handleSaveAction}
            className={`w-full py-4 rounded-lg font-black text-base tracking-wider uppercase shadow-sm transition-all flex items-center justify-center gap-2.5 ${
              justSaved
                ? 'bg-green-600 text-white'
                : 'bg-[#002395] hover:bg-[#001c77] text-white active:scale-[0.99]'
            }`}
          >
            {justSaved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>THROW SAVED! READY FOR NEXT</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                <span>
                  SAVE THROW ({selectedPlayer?.name || 'Athlete'} · {actionType})
                </span>
              </>
            )}
          </button>
        </div>

        {/* RECENT THROWS FOR CURRENT END & UNDO BUTTON */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-[#002395]" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Throws in End {match.currentEndNumber} ({currentEndActions.length})
              </span>
            </div>

            {lastAction && (
              <button
                id="scorer-btn-undo"
                onClick={() => onDeleteAction(lastAction.id)}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo Last</span>
              </button>
            )}
          </div>

          {currentEndActions.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 text-center">
              No throws recorded yet in End {match.currentEndNumber}. Tap Save Throw above.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {[...currentEndActions].reverse().map((act) => {
                const isTeamA = act.teamId === match.teamA.id;
                return (
                  <div
                    key={act.id}
                    className="flex items-center justify-between text-xs p-2 rounded-md bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isTeamA ? 'bg-[#002395]' : 'bg-[#ED2939]'
                        }`}
                      />
                      <span className="font-bold text-slate-800">{act.playerName}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-1.5 py-0.2 rounded">
                        {act.actionType}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{act.distance}</span>
                      {act.carreau && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          CARREAU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                          act.result === 'SUCCESS'
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                      >
                        {act.result}
                      </span>
                      <button
                        onClick={() => onDeleteAction(act.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                        title="Delete this throw"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* END COMPLETION MODAL */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-lg p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#002395] rounded-xs" />
                <h3 className="font-bold text-base text-slate-900">
                  Complete End {match.currentEndNumber} Score
                </h3>
              </div>
              <button
                onClick={() => setShowEndModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 my-3">
              Record the points scored in this End by measuring boule proximity to the
              jack. Only one team can score points in an End.
            </p>

            {/* Team Points Inputs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center">
                <p className="text-xs font-bold text-slate-700 uppercase mb-1 truncate">
                  {match.teamA.name} Points
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEndPointsTeamA(Math.max(0, endPointsTeamA - 1))}
                    className="w-8 h-8 rounded-md bg-slate-200 font-bold text-slate-700 text-base hover:bg-slate-300"
                  >
                    -
                  </button>
                  <span className="font-mono text-2xl font-black text-[#002395] w-8">
                    {endPointsTeamA}
                  </span>
                  <button
                    onClick={() => {
                      setEndPointsTeamA(endPointsTeamA + 1);
                      setEndPointsTeamB(0); // Only one team scores in an end
                    }}
                    className="w-8 h-8 rounded-md bg-slate-200 font-bold text-slate-700 text-base hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-center">
                <p className="text-xs font-bold text-slate-700 uppercase mb-1 truncate">
                  {match.teamB.name} Points
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEndPointsTeamB(Math.max(0, endPointsTeamB - 1))}
                    className="w-8 h-8 rounded-md bg-slate-200 font-bold text-slate-700 text-base hover:bg-slate-300"
                  >
                    -
                  </button>
                  <span className="font-mono text-2xl font-black text-[#ED2939] w-8">
                    {endPointsTeamB}
                  </span>
                  <button
                    onClick={() => {
                      setEndPointsTeamB(endPointsTeamB + 1);
                      setEndPointsTeamA(0); // Only one team scores in an end
                    }}
                    className="w-8 h-8 rounded-md bg-slate-200 font-bold text-slate-700 text-base hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Next End Distance */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Set Distance for Next End (End {match.currentEndNumber + 1})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DISTANCES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setNextEndDistance(d)}
                    className={`py-2 rounded-md text-xs font-mono font-bold border transition-colors ${
                      nextEndDistance === d
                        ? 'bg-[#002395] text-white border-[#002395]'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                id="scorer-confirm-end-btn"
                disabled={submitting}
                onClick={handleFinishEndSubmit}
                className="flex-2 py-2.5 bg-[#002395] hover:bg-[#001c77] text-white font-bold rounded-md text-xs transition-colors shadow-xs"
              >
                Advance to End {match.currentEndNumber + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
