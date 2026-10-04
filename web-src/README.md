# Aathma Bandhu – Web App

React (Vite) web version of the `GovServiceApp` Expo/React Native app. It has the same
screens, flow, colours and images. It runs on dummy data by default, so no backend is needed.

## Run locally

Requires Node.js 18+.

```bash
cd AtmaBandhuWeb
npm install
npm run dev        # http://localhost:3000
npm run build      # production build -> dist/
npm run preview    # serve dist/ on http://localhost:8080
```

## Responsive

Works on every screen size, from flip/fold cover screens (tested at 260px and 280px wide) through phones,
unfolded foldables, tablets and desktop, in portrait and landscape. There is no horizontal scrolling, and notches are handled with safe-area padding.
Form content is capped at 480px and centred, so wide screens keep the phone proportions.

## Demo accounts (mock mode)

The full presentation dataset is described in **[DEMO_ACCOUNTS.md](DEMO_ACCOUNTS.md)**: 25 citizens, 20 officers across 10 departments,
72 open and 38 resolved complaints, about 320 notifications, Aadhaar numbers for live sign-up, and a demo script. Key logins:

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Citizen user | `user@aathmabandhu.in` | `User@123` | Logs in to Home |
| Citizen user | `priya@aathmabandhu.in` | `Priya@123` | Logs in to Home |
| Agent | `suresh.agent@aathmabandhu.in` | `Agent@123` | Accepted by the API, but the app only lets `user_type_id 2` in (same as mobile) |

**Sign Up → Verify:** enter a mock Aadhaar number, e.g. `123456789`, and press **Verify**. This fills in the name and
mobile number (from the list in `src/api/dummyData.js`).

**Forgot password:** there is no email server in mock mode, so the OTP is shown in the alert and printed to the browser console.

**Reset the demo data:** run `atmaResetDemoData()` in the browser console.

## Mock vs live backend

| Variable | Default | Meaning |
|----------|---------|---------|
| `VITE_API_MODE` | `mock` | `mock` = in-browser dummy backend, `live` = real API |
| `VITE_API_URL` | `http://localhost:5000` | Base URL of `GovServiceAppBackend` when `live` |

Copy `.env.example` to `.env` to change these. They are baked in at build time.

`src/api/mockServer.js` implements every route in `GovServiceAppBackend` (`/auth`, `/user`,
`/complaint`, `/agent`, `/notification`) with the same request and response shapes and status codes.

## Structure

```
src/
  api/          client.js (axios, mock/live switch), mockServer.js, dummyData.js
  components/   Field*, LoginButton, Button, HalfButton, PasswordToggle, Alert, CustomDrawer
  constants/    COLORS, IMGS, ROUTES (same names as the mobile app)
  navigation/   HomeLayout (header + drawer + bottom tab)
  screens/      auth/* (GetStarted, Login, SignUp, ForgotPassword, VerifyOTP, Splash), home/Home
  store.jsx     replaces pullstate stores
```

## Deploy to DigitalOcean

**Option A – App Platform (static site, cheapest):**
1. Push the repo to GitHub.
2. Edit `.do/app.yaml` (`github.repo`, `branch`).
3. `doctl apps create --spec AtmaBandhuWeb/.do/app.yaml`. You can also create the app in the dashboard with
   source dir `AtmaBandhuWeb`, build `npm install && npm run build`, output `dist`, and catch-all `index.html`.

**Option B – Droplet / container:**
```bash
docker build -t atma-bandhu-web ./AtmaBandhuWeb
docker run -d -p 80:8080 --restart unless-stopped atma-bandhu-web
```
For the live API, pass `--build-arg VITE_API_MODE=live --build-arg VITE_API_URL=https://api.example.com`.
