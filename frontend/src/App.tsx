import { useState } from 'react'
import Predictions from './pages/Predictions'
import Simulator from './pages/Simulator'
import AfricaFocus from './pages/AfricaFocus'
import MarketEdge from './pages/MarketEdge'

const TABS = ['Predictions', 'Simulator', 'Africa Focus', 'Market Edge']

export default function App() {
  const [tab, setTab] = useState('Predictions')

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 17 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D9E75' }} />
          GoalCast 2026
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, background: tab === t ? '#1D9E75' : 'transparent', color: tab === t ? '#fff' : '#6b7280' }}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {tab === 'Predictions' && <Predictions />}
        {tab === 'Simulator' && <Simulator />}
        {tab === 'Africa Focus' && <AfricaFocus />}
        {tab === 'Market Edge' && <MarketEdge />}
      </div>
    </div>
  )
}
