import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8008'

export const api = axios.create({ baseURL: BASE })

export const getTopTeams = () => api.get('/predict/top').then(r => r.data)
export const predictMatch = (home: string, away: string) => api.get(`/predict/match?home=${home}&away=${away}`).then(r => r.data)
export const getMarketDivergence = () => api.get('/market/divergence').then(r => r.data)
export const getAfricaIndex = () => api.get('/africa/breakout-index').then(r => r.data)
export const getUpsets = () => api.get('/upsets/top10').then(r => r.data)
export const getClimateRisk = (venue: string) => api.get(`/upsets/african-climate-risk?venue=${venue}`).then(r => r.data)
export const simulateTournament = (iterations = 1000) => api.get(`/simulate/tournament?iterations=${iterations}`).then(r => r.data)
export const simulateMatch = (home: string, away: string) => api.get(`/simulate/match?home=${home}&away=${away}`).then(r => r.data)
