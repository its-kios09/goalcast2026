import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTopTeams, predictMatch } from '../lib/api'

const TEAMS = [
  'France','Argentina','Spain','England','Brazil','Germany',
  'Portugal','Morocco','Senegal','Netherlands','Colombia','Turkey',
  'Nigeria','Egypt','Croatia','USA','Japan','Australia'
]

function StatCard({ label, value, sub, color }: any) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color: color || '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function ProbBar({ hw, d, aw }: any) {
  return (
    <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', width: 140, margin: '6px auto' }}>
      <div style={{ width: `${hw * 100}%`, background: '#1D9E75' }} />
      <div style={{ width: `${d * 100}%`, background: '#d1d5db' }} />
      <div style={{ width: `${aw * 100}%`, background: '#ef4444' }} />
    </div>
  )
}

export default function Predictions() {
  const [home, setHome] = useState('Morocco')
  const [away, setAway] = useState('France')

  const { data: top } = useQuery({ queryKey: ['top'], queryFn: getTopTeams })
  const { data: match } = useQuery({
    queryKey: ['match', home, away],
    queryFn: () => predictMatch(home, away),
    enabled: true
  })

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>FIFA World Cup 2026</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>AI-powered match predictions</h1>
        <p style={{ fontSize: 14, color: '#6b7280' }}>Elo ratings built from all international results since 1990</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, margin: '24px 0' }}>
        <StatCard label="Teams rated" value="48" sub="Expanded 2026 format" />
        <StatCard label="Matches analyzed" value="50k+" sub="Since 1990" />
        <StatCard label="Top Elo" value={top?.[0]?.team || '...'} sub={`${top?.[0]?.elo || ''} pts`} color="#1D9E75" />
        <StatCard label="African nations" value="9" sub="Historic high" color="#BA7517" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Match predictor</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <select value={home} onChange={e => setHome(e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}>
              {TEAMS.map(t => <option key={t}>{t}</option>)}
            </select>
            <span style={{ color: '#9ca3af', fontWeight: 600 }}>vs</span>
            <select value={away} onChange={e => setAway(e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}>
              {TEAMS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {match && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{match.home}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#1D9E75' }}>{Math.round(match.home_win * 100)}%</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Elo {match.home_elo}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Draw</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#6b7280' }}>{Math.round(match.draw * 100)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{match.away}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#ef4444' }}>{Math.round(match.away_win * 100)}%</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>Elo {match.away_elo}</div>
                </div>
              </div>
              <ProbBar hw={match.home_win} d={match.draw} aw={match.away_win} />
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Top 10 by Elo rating</div>
          {top?.slice(0, 10).map((t: any, i: number) => (
            <div key={t.team} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 9 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < 3 ? '#1D9E75' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: i < 3 ? '#fff' : '#6b7280' }}>{i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.team}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ height: 4, borderRadius: 2, background: '#1D9E75', width: `${((t.elo - 1600) / 500) * 80}px` }} />
                <span style={{ fontSize: 13, color: '#6b7280', minWidth: 36 }}>{t.elo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
