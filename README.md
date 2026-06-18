# KMG HSE Digital Ecosystem

Информационная система «Охрана труда» / «Еңбекті қорғау» / Occupational Safety Information System
АО НК «КазМунайГаз» · `hse.kmg.kz`

A redesigned web platform that reproduces the look & feel of `hse.kmg.kz` and implements the
business processes described in the technical specification (`KMG_HSE_TZ_для_разработчика`).
It is **trilingual (Қазақша / Русский / English)** and is populated with the **real incident
data** provided (Журнал НС 2020–2026, Қорғау EBD база, предиктивная аналитика).

## Features

- **3 languages** with instant switching (header dropdown) — KZ / RU / EN, persisted in `localStorage`.
- **12 modules** matching the spec, grouped in a collapsible icon sidebar:
  - 09 · Command Center — consolidated real-time dashboard (KPIs, charts, AI insights)
  - 01 · Policies & OHSMS (PDCA cycle, compliance matrix)
  - 02 · Қорғау — safety observations (real EBD data: 39 521 cards, by-subsidiary register)
  - 03 · **Incidents** — full accident journal with real data (311 records), filters, charts,
    and detailed incident cards
  - 04 · Industrial Safety (HPF / ОПО)
  - 04.1 · Contractors (A/B/C/D HSE rating)
  - 06 · Action Management (CAPA, sources, overdue escalation)
  - 06.1 · Audit
  - 07 · e-Permit to Work
  - 08 · Road Safety (uses real vehicle-accident data)
  - 10 · KPI Forms
  - AI · Predictive Analytics — real Q2–Q3 2026 forecast by subsidiary (ARI / ИНР model)

## Real data

The `src/data/*.json` files are generated from the provided Excel workbooks:

| File | Source workbook |
| --- | --- |
| `incidents.json` | `Журнал НС 16.06.26.xlsx` → sheet `НС 2020-2025` (311 incidents, normalized) |
| `korgau.json` / `korgau_summary.json` | `Коргау_EBD_Расширенная_База_2023_2026.xlsx` |
| `forecast.json` | `Коргау_ИНР_Предиктивная_Аналитика_2026.xlsx` |
| `classifier.json` | bilingual RU/KZ incident-type classifier |

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

Login screen accepts any credentials (demo) — just click **Sign in**.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · React Router · Recharts.
