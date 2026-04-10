import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { simulateTournament, simulateMatch } from '../lib/api'

const TEAMS = [
  'France','Argentina','Spain','England','Brazil','Germany',
  'Portugal','Morocco','Senegal','Netherlands','Colombia','Turkey',
  'Nigeria','Egypt','Croatia','USA','Japan','Australia'
]

export default function Simulator() {
  const [iterations, setIterations] = useState(1000)
  const [runTournament, setRunTournament] = useState(false)
  const [home, setHome] = useState('Morocco')
  const [away, setAway] = useState('France')
  const [runMatch, setRunMatch] = useState(false)

  const { data: tournament, isFetching: tFetching } = useQuery({
    queryKey: ['simulate-tournament', iterations],
    queryFn: () => simulateTournament(iterations),
    enabled: runTournament
  })

  const { data: match, isFetching: mFetching } = useQuery({
    queryKey: ['simulate-match', home, away],
    queryFn: () => simulateMatch(home, away),
    enabled: runMatch
  })

  const probs = tournament?.win_probabilities || {}
  const topTeams = Object.entries(probs).slice(0, 15) as [string, number][]
  const maxProb = topTeams[0]?.[1] || 1

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Monte Carlo</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Tournament simulator</h1>
        <p style={{ fontSize: 14, color: '#6b7280' }}>Simulate the full 48-team bracket thousands of times to estimate win probabilities.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Tournament simulation</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Iterations: {iterations.toLocaleString()}</div>
            <input type="range" min={100} max={10000} step={100} value={iterations}
              onChange={e => setIterations(Number(e.target.value))}
              style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              <span>100</span><span>faster ← → more accurate</span><span>10,000</span>
            </div>
          </div>
          <button
            onClick={() => { setRunTournament(false); setTimeout(() => setRunTournament(true), 50) }}
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {tFetching ? 'Simulating...' : 'Run simulation'}
          </button>

          {topTeams.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Win probability — top 15</div>
              {topTeams.map(([team, prob], i) => (
                <div key={team} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 16 }}>{i + 1}</span>
                      <span style={{ fontWeight: i < 3 ? 600 : 400 }}>{team}</span>
                    </div>
                    <span style={{ color: i === 0 ? '#1D9E75' : '#6b7280', fontWeight: 600 }}>{prob}%</span>
                  </div>
                  <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: i === 0 ? '#1D9E75' : i < 3 ? '#34d399' : '#d1d5db', width: `${(prob / maxProb) * 100}%`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Head-to-head simulator</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <select value={home} onChange={e => setHome(e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}>
              {TEAMS.map(t => <option key={t}>{t}</option>)}
            </select>
            <span style={{ color: '#9ca3af', fontWeight: 600 }}>vs</span>
            <select value={away} onChange={e => setAway(e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}>
              {TEAMS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setRunMatch(false); setTimeout(() => setRunMatch(true), 50) }}
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: '#1a1a1a', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
            {mFetching ? 'Simulating...' : 'Simulate 1,000 matches'}
          </button>

          {match && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#166534', marginBottom: 4 }}>{match.home}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#15803d' }}>{match[match.home]}%</div>
                  <div style={{ fontSize: 12, color: '#166534' }}>win rate</div>
                </div>
                <div style={{ background: '#fef2f2', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: '#991b1b', marginBottom: 4 }}>{match.away}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>{match[match.away]}%</div>
                  <div style={{ fontSize: 12, color: '#991b1b' }}>win rate</div>
                </div>
              </div>
              <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                <div style={{ background: '#1D9E75', width: `${match[match.home]}%` }} />
                <div style={{ background: '#ef4444', flex: 1 }} />
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                Based on {match.iterations.toLocaleString()} simulated matches
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>How it works</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              Each simulation uses Elo win probability to determine match outcomes. Over thousands of iterations, the distribution converges to a reliable probability estimate — capturing the inherent randomness of football.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
