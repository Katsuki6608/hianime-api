import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { hiAnimeRoutes } from '../src/routes/routes'

const app = new Hono()

app.get('/ping', (c) => c.json({ status: 'ok' }))
app.route('/api', hiAnimeRoutes) // agar routes.ts ke andar already /v2/hianime/home defined hai

export default handle(app)
