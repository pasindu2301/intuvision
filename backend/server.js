const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)
const host = process.env.HOST || '127.0.0.1'
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const allowedOrigins = [
  frontendOrigin,
  'https://intuvision.pro',
  'https://www.intuvision.pro',
]
const adminPassword = process.env.ADMIN_PASSWORD || ''

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const publishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const publicSupabaseKey = publishableKey || serviceRoleKey

if (!supabaseUrl || !publicSupabaseKey) {
  throw new Error(
    'Missing Supabase credentials. Set SUPABASE_URL and one key.',
  )
}

const publicSupabase = createClient(supabaseUrl, publicSupabaseKey)
const adminSupabase = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('CORS origin not allowed'))
    },
  }),
)
app.use(express.json())

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

// ── Public: join waitlist ─────────────────────────────────────────────────────
app.post('/api/waitlist', async (req, res) => {
  try {
    const { name = '', email = '', company = '', message = '' } = req.body || {}

    const safeName    = normalizeText(name)
    const safeEmail   = normalizeText(email).toLowerCase()
    const safeCompany = normalizeText(company)
    const safeMessage = normalizeText(message)

    // ── Validation ────────────────────────────────────────────────────────────
    if (!safeName || !safeEmail || !safeMessage) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    if (!/^\S+@\S+\.\S+$/.test(safeEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    const payload = {
      name:    safeName,
      email:   safeEmail,
      company: safeCompany || null,
      message: safeMessage,
      source:  'intuvision',
    }

    // ── BUG FIX: drop .select('id').single() ─────────────────────────────────
    // Chaining .select().single() after .insert() triggers a SELECT under the
    // hood. If the anon RLS policy only grants INSERT (not SELECT), Supabase
    // returns an error even though the row was saved successfully, making every
    // submission look like a failure. Just call .insert() on its own.
    const { error } = await publicSupabase.from('waitlist_customers').insert(payload)

    if (error) {
      // Table missing
      if (
        error.message?.includes("Could not find the table 'public.waitlist_customers'") ||
        error.code === '42P01'
      ) {
        return res.status(500).json({
          error:
            'Supabase table waitlist_customers is missing. Run backend/supabase_waitlist.sql in the Supabase SQL Editor.',
        })
      }
      // Duplicate email (unique constraint violation)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'This email is already on the waitlist.' })
      }
      // Any other Supabase / Postgres error
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json({ success: true })
  } catch (err) {
    console.error('Unexpected error in POST /api/waitlist:', err)
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
})

// ── Admin auth middleware ─────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-password']
  if (!adminPassword || token !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  return next()
}

// ── Admin: list waitlist entries ──────────────────────────────────────────────
app.get('/api/admin/waitlist', requireAdmin, async (req, res) => {
  try {
    if (!adminSupabase) {
      return res.status(500).json({
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY in backend .env for admin actions.',
      })
    }

    const { data, error } = await adminSupabase
      .from('waitlist_customers')
      .select('id, name, email, company, message, source, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase select error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.json({ data })
  } catch (err) {
    console.error('Unexpected error in GET /api/admin/waitlist:', err)
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
})

// ── Admin: delete waitlist entry ──────────────────────────────────────────────
app.delete('/api/admin/waitlist/:id', requireAdmin, async (req, res) => {
  try {
    if (!adminSupabase) {
      return res.status(500).json({
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY in backend .env for admin actions.',
      })
    }

    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'Entry id is required.' })
    }

    const { data, error } = await adminSupabase
      .from('waitlist_customers')
      .delete()
      .eq('id', id)
      .select('id, email')
      .maybeSingle()

    if (error) {
      console.error('Supabase delete error:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ error: 'Waitlist entry not found.' })
    }

    return res.json({ success: true, deleted: data })
  } catch (err) {
    console.error('Unexpected error in DELETE /api/admin/waitlist/:id:', err)
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
})

app.delete('/api/admin/waitlist/by-email/:email', requireAdmin, async (req, res) => {
  try {
    if (!adminSupabase) {
      return res.status(500).json({
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY in backend .env for admin actions.',
      })
    }

    const rawEmail = decodeURIComponent(req.params.email || '')
    const email = normalizeText(rawEmail).toLowerCase()
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }

    const { data, error } = await adminSupabase
      .from('waitlist_customers')
      .delete()
      .eq('email', email)
      .select('id, email')

    if (error) {
      console.error('Supabase delete-by-email error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.json({ success: true, deletedCount: data?.length || 0 })
  } catch (err) {
    console.error('Unexpected error in DELETE /api/admin/waitlist/by-email/:email:', err)
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
})

// ── Server startup with port-retry ───────────────────────────────────────────
function startServer(preferredPort) {
  // Only allow one retry to avoid silent port-stacking
  const server = app.listen(preferredPort, host, () => {
    console.log(`Backend listening on http://${host}:${preferredPort}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\n❌ Port ${preferredPort} is already in use.\n` +
        `   Run: taskkill /F /IM node.exe  (Windows)\n` +
        `   Then restart with: npm run dev\n`
      )
      process.exit(1)  // Exit instead of silently retrying
    }
    console.error('Failed to start backend server:', err)
    process.exit(1)
  })
}

startServer(port)