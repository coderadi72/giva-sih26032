# KisanSetu — SIH Procurement Prototype

React + Vite frontend with a separate Node.js + Express backend.

## Folder structure

```text
farmer_procurement_prototype/
├── src/
│   ├── main.jsx
│   └── styles.css
├── server/
│   ├── index.js
│   └── data.js
├── package.json
└── index.html
```

## Run frontend

Open terminal in this folder:

```bash
npm install
npm run dev
```

Then open the Vite localhost URL.

## Run backend

Open a second terminal in the same folder:

```bash
npm run server
```

API runs at:

```text
http://localhost:5000
```

Test:

```text
http://localhost:5000/api/health
http://localhost:5000/api/farmers/FR-20481
http://localhost:5000/api/centres
http://localhost:5000/api/payments/FR-20481
```

## Demo queue API

Decrease queue at Sehore:

```bash
curl -X POST http://localhost:5000/api/demo/queue -H "Content-Type: application/json" -d "{\"centreId\":\"C001\",\"delta\":-5}"
```

Increase queue:

```bash
curl -X POST http://localhost:5000/api/demo/queue -H "Content-Type: application/json" -d "{\"centreId\":\"C001\",\"delta\":20}"
```

## Important

This is a hackathon prototype. Government procurement data and APIs are simulated. For a real deployment, use only authorized government APIs/data-sharing mechanisms and proper authentication/privacy controls.

## KisanSetu v2 features
- Live-demo mandi queue polling (10 second refresh)
- Crop-wise seller queue counts
- Slot timing and alert controls
- Centre opening/closing time and Kisan Assistant demo
- Market price search cards
- Farmer feedback submission API
- Fertilizer catalog and purchase-flow demo
- Clear separation between simulated prototype data and future authorized integrations
