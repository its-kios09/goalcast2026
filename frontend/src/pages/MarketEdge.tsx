import { useQuery } from '@tanstack/react-query'
import { getMarketDivergence } from '../lib/api'

function EdgeBadge({ signal, pct }: { signal: string; pct: string }) {
  const colors: any = {
    undervalued: { bg: '#f0fdf4', color: '#166534' },
    overvalued: { bg: '#fef2f2', color: '#991b1b' },
    fair: { bg: '#f9fafb', color: '#6b7280' }
  }
  const c = colors[signal] || colors.fair
  return (
    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.color, fontWeight: 600 }}>
      {pct}
    </span>
  )
}

export default function MarketEdge() {
  const { data } = useQuery({ queryKey: ['market'], queryFn: getMarketDivergence })
  const divergence = data?.divergence || []
  const undervalued = divergence.filter((t: any) => t.signal === 'undervalued')
  const overvalued = divergence.filter((t: any) => t.signal === 'overvalued')

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Market divergence</div>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Where markets are wrong</h1>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 540 }}>
          GoalCast Elo model vs Polymarket odds. African teams are systematically undervalued — markets haven't updated for the 48-team format advantage.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Source</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Polymarket</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{data?.note}</div>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#166534', marginBottom: 4 }}>Undervalued teams</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#15803d' }}>{undervalued.length}</div>
          <div style={{ fontSize: 12, color: '#166534', marginTop: 2 }}>Model says buy</div>
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#991b1b', marginBottom: 4 }}>Overvalued teams</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#dc2626' }}>{overvalued.length}</div>
          <div style={{ fontSize: 12, color: '#991b1b', marginTop: 2 }}>Market overpricing</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Full divergence table</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>Model prob vs market prob</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 4, marginBottom: 8 }}>
            {['Team', 'Model', 'Market', 'Edge'].map(h => (
              <div key={h} style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>{h}</div>
            ))}
          </div>
          {divergence.map((t: any, i: number) => (
            <div key={t.team} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 4, padding: '8px 0', borderBottom: i < divergence.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{t.team}</span>
              <span style={{ fontSize: 13, color: '#1a1a1a' }}>{(t.model_prob * 100).toFixed(1)}%</span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{(t.market_prob * 100).toFixed(1)}%</span>
              <EdgeBadge signal={t.signal} pct={t.edge_pct} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 16, color: '#15803d' }}>Most undervalued</div>
            {undervalued.slice(0, 5).map((t: any, i: number) => (
              <div key={t.team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.team}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>market {(t.market_prob * 100).toFixed(0)}%</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>model {(t.model_prob * 100).toFixed(0)}%</span>
                  <EdgeBadge signal="undervalued" pct={t.edge_pct} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 16, color: '#dc2626' }}>Most overvalued</div>
            {overvalued.slice(0, 5).map((t: any, i: number) => (
              <div key={t.team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.team}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>market {(t.market_prob * 100).toFixed(0)}%</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>model {(t.model_prob * 100).toFixed(0)}%</span>
                  <EdgeBadge signal="overvalued" pct={t.edge_pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
