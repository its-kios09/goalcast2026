import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAfricaIndex, getClimateRisk } from '../lib/api'

const VENUES = ['Vancouver', 'New York', 'Dallas', 'Seattle', 'Boston', 'Miami', 'Los Angeles']

function ShockBadge({ type }: { type: string | null }) {
  if (!type) return <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#f3f4f6', color: '#6b7280' }}>no shock</span>
  const cold = type === 'cold_shock'
  return <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: cold ? '#eff6ff' : '#fff7ed', color: cold ? '#1d4ed8' : '#c2410c' }}>{cold ? 'cold shock' : 'warm shock'}</span>
}

export default function AfricaFocus() {
  const [venue, setVenue] = useState('Vancouver')
  const { data: index } = useQuery({ queryKey: ['africa'], queryFn: getAfricaIndex })
  const { data: climate } = useQuery({ queryKey: ['climate', venue], queryFn: () => getClimateRisk(venue) })

  const top = index?.teams?.[0]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#BA7517', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Africa 2026</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>The African breakout index</h1>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 540 }}>9 African nations qualify in 2026 — a historic high. The expanded 48-team format creates 2.4x more semifinal paths than 2022.</p>
      </div>

      {top && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#166534', fontWeight: 600, marginBottom: 4 }}>GoalCast top African pick</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#15803d' }}>{top.team}</div>
          <div style={{ fontSize: 14, color: '#166534', marginTop: 4 }}>
            Elo {top.elo} · {top.semifinal_prob}% semifinal probability · market edge +{(top.market_edge * 100).toFixed(1)}%
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Breakout index ranking</div>
          {index?.teams?.map((t: any, i: number) => (
            <div key={t.team} style={{ padding: '10px 0', borderBottom: i < index.teams.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? '#1D9E75' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: i === 0 ? '#fff' : '#6b7280' }}>{i + 1}</div>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{t.team}</span>
                  <ShockBadge type={t.climate_shock} />
                </div>
                <span style={{ fontSize: 13, color: '#1D9E75', fontWeight: 600 }}>{t.semifinal_prob}%</span>
              </div>
              <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#1D9E75', width: `${(t.breakout_score / 0.55) * 100}%`, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11, color: '#9ca3af' }}>
                <span>Elo {t.elo}</span>
                <span>Venue: {t.projected_venue}</span>
                {t.climate_penalty > 0 && <span style={{ color: '#ef4444' }}>-{(t.climate_penalty * 100).toFixed(0)}% penalty</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600 }}>Climate risk by venue</div>
            <select value={venue} onChange={e => setVenue(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}>
              {VENUES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          {climate?.map((t: any, i: number) => (
            <div key={t.team} style={{ padding: '10px 0', borderBottom: i < climate.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t.team}</span>
                  <ShockBadge type={t.shock_type} />
                </div>
                <span style={{ fontSize: 13, color: t.shock_type ? '#ef4444' : '#6b7280' }}>
                  {t.delta > 0 ? '+' : ''}{t.delta}°C
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{t.insight}</div>
              {t.win_rate_penalty > 0 && (
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>
                  Win rate penalty: -{(t.win_rate_penalty * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
