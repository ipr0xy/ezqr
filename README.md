## EZ QR – Create and share UPI payment QR codes, fast

EZ QR is a lightweight React + TypeScript app to generate, preview, save, and share UPI payment QR codes for your products or services. It works great on mobile (installable PWA style), stores your items locally (no backend), and lets your customers scan and pay instantly with any UPI app.

### Key features
- Create UPI QR codes with payee name, UPI ID, amount (optional), description, and payment note
- Live QR preview and currency formatting
- Save multiple QR codes locally (client‑side only) and manage them later
- Share or download a high‑quality PNG with your QR, title, note, and UPI ID
- Enable/disable QR codes without deleting
- Mobile‑first UI with a bottom navigation bar

### Tech stack
- React 18 + TypeScript, Vite
- Tailwind CSS (utility‑first styling)
- React Router v6
- Zustand (client‑side state with persistence)
- react-qr-code for QR rendering

---

## Getting started (local development)

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm 9+

### Clone and install
```bash
git clone https://github.com/ipr0xy/ezqr.git
cd ezqr
npm ci
```

### Run the app
```bash
npm run dev
```
Then open `http://localhost:5173`.

Tip: The dev server is also available on your LAN for quick device testing.

### Type‑check and build
```bash
# Type‑check only
npm run type-check

# Production build
npm run build

# Preview the production build locally
npm run preview
```

Build output is emitted to `dist/`.

---

## Project structure (high level)

```
src/
  components/
    Layout/           # App shell & bottom navigation
    QRCode/           # QR preview/display components
    ui/               # Reusable UI primitives (button, card, input)
  screens/
    Dashboard/        # Overview & quick actions
    Items/            # Create, list, and view an item’s QR
    Profile/          # About & how it works
  store/              # Zustand store with local persistence
  utils/              # Validation, QR generator, share/download helpers
```

---

## Usage notes
- Amount is optional. If left empty, UPI apps typically allow manual amount entry after scanning.
- All items are stored in your browser’s storage (Zustand persist). No data leaves your device.
- Sharing and downloading use client‑side canvas rendering for consistent, crisp PNG output.

### UPI QR payload rules
The app generates a UPI deeplink like:
```
upi://pay?pa=<upiId>&pn=<payeeName>&am=<amount>&tn=<note>&cu=INR
```
Input is validated and sanitized before encoding.

---

## Deploying

### Netlify (recommended)
1) Connect the GitHub repo
2) Build command: `npm run build`
3) Publish directory: `dist`

Vite is auto‑detected. No extra Netlify config is required.

### GitHub Pages
You can host the `dist/` folder with any static hosting provider. If using GH Pages, ensure correct base path or custom domain.

---

## Development tips
- Mobile testing: open the site from your phone via the LAN address Vite prints, or use Chrome DevTools device emulation.
- If you see long content hidden behind the bottom nav, ensure the page container uses `min-h-[100dvh]` and has enough bottom padding or scrollable content (`flex-1 overflow-y-auto`).
- If you add new inputs to the item form, update validation in `src/utils/validation.ts` and generation in `src/utils/qrGenerator.ts`.

---

## Contributing
Issues and PRs are welcome. Please run:
```bash
npm run type-check
npm run build
```
before submitting changes.

## License
MIT
