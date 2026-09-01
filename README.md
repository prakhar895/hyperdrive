[README (1).md](https://github.com/user-attachments/files/31287016/README.1.md)
# HyperDrive

An interactive marketing and configurator site for a fictional electric hypercar, built as a frontend engineering exercise.

**Live site:** [View the site](https://hyperdrive-chi.vercel.app)

---

## Screenshots

### Showroom
<img width="1079" height="1779" alt="hyperdrive-chi vercel app__trim=base paint=obsidian wheels=carbon-22 interior=alcantara aero=true" src="https://github.com/user-attachments/assets/e5592e49-1007-4be9-b75d-97b330737f73" />


### Configurator
<img width="1079" height="2936" alt="hyperdrive-chi vercel app__trim=base paint=obsidian wheels=carbon-22 interior=alcantara aero=true (1)" src="https://github.com/user-attachments/assets/7e081925-8637-4c93-a388-85b1dce1df95" />


### Performance telemetry
<img width="1079" height="4158" alt="hyperdrive-chi vercel app__trim=base paint=obsidian wheels=carbon-22 interior=alcantara aero=true (2)" src="https://github.com/user-attachments/assets/db6a92a2-3e6c-4e81-88af-1fca5cd9ecaa" />


### Trim comparison
<img width="1079" height="2433" alt="hyperdrive-chi vercel app__trim=base paint=obsidian wheels=carbon-22 interior=alcantara aero=true (3)" src="https://github.com/user-attachments/assets/ae292b9c-02bb-4aff-a223-6d0dff177838" />


---

## Overview

HyperDrive is a single-page application presenting a concept vehicle across four sections: a full-bleed showroom hero, a live paint and wheel configurator, a performance telemetry view with interactive charts, and a trim comparison table.

The project was built around a strict design system, a dark showroom palette with a single accent colour, condensed grotesque headlines, and monospace tabular figures for all numeric specifications.

---

## Vehicle rendering

The most interesting technical decision in the project is how the vehicle is rendered.

Rather than swapping a separate image for every paint colour, the car is a **layered composite**. A single photographic render is decomposed into five aligned layers, and paint colour is applied by writing CSS custom properties consumed by those layers:

| Layer | Role | Blend mode |
|---|---|---|
| `base.webp` | Neutral grayscale render | — |
| `paint-mask.webp` | Alpha mask driving paint coverage | `multiply` |
| `wheel-mask.webp` | Wheel finish mask | `multiply` |
| `specular.webp` | Highlights and reflections | `screen` |
| `lights.webp` | Emissive headlight and tail light | `screen` |

Changing the paint writes three custom properties, `--paint-base`, `--paint-highlight` and `--paint-gloss`, and nothing else. No image is swapped, no component re-renders, and no layout is triggered, so configuration changes are instant with zero cumulative layout shift.

The paint mask is a continuous gradient rather than a hard-edged region. Bright painted surfaces take full colour, true blacks (tyres, glass, carbon fibre) take almost none, and everything between transitions smoothly, so there are no visible mask boundaries at any paint colour.

---

## Tech stack

- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- Deployed on **Vercel**

No animation library, no charting library, no 3D library.

---

## Features

**Configurator**
- Eight paint finishes with distinct gloss characteristics
- Live price derived from configuration rather than stored
- Configuration serialised to the URL query string for shareable builds
- Last configuration persisted to `localStorage`, with URL taking precedence

**Charts**
- Rendered as inline SVG for full control over labelling
- Series labelled directly on the plot rather than via a legend
- Each series distinguishable by line weight and dash pattern as well as colour
- Visually hidden data table as an accessible fallback, linked with `aria-describedby`

**Comparison table**
- Semantic `<table>` with `<th scope="col">` and `<th scope="row">`
- Sticky header via `position: sticky` on `th`, not a duplicated floating element
- Transforms to stacked cards on mobile rather than horizontal scrolling
- Boolean cells carry a visually hidden text label

**Accessibility**
- Full ARIA tabs pattern with roving tabindex and arrow-key navigation
- Hotspot markers are real buttons, keyboard reachable in reading order
- Visible focus rings throughout
- WCAG AA contrast
- All motion wrapped in `prefers-reduced-motion` checks

---

## Running locally

```bash
git clone https://github.com/prakhar895/hyperdrive.git
cd hyperdrive
npm install
npm run dev
```

No API keys, no environment variables, no backend, no external services. The vehicle composite is served from public/, so the app makes zero third-party network requests at runtime.

To build for production:

```bash
npm run build
npm run preview
```

---

## Structure

```
public/
└── vehicle/
    ├── base.webp            Neutral grayscale render
    ├── paint-mask.webp      Alpha mask driving paint coverage
    ├── wheel-mask.webp      Wheel finish mask
    ├── specular.webp        Highlights and reflections
    └── lights.webp          Emissive headlight and tail light
src/
├── data/
│   ├── paints.ts            Eight finishes with gloss characteristics
│   ├── trims.ts             Trim levels, specifications, pricing
│   └── telemetry.ts         Acceleration, power and torque series
├── context/
│   └── ConfigContext.tsx    Configuration state, URL and localStorage sync
├── components/
│   ├── VehicleRenderer.tsx  Layered composite, paint via CSS variables
│   ├── Showroom.tsx         Full-bleed hero with hotspot buttons
│   ├── Configurator.tsx     Paint, wheel, interior and aero controls
│   ├── PriceSummary.tsx     Price derived from configuration
│   ├── Telemetry.tsx        Tab pattern wrapping the chart views
│   ├── LineChart.tsx        Inline SVG chart with direct series labels
│   ├── DataTable.tsx        Visually hidden accessible chart fallback
│   └── TrimTable.tsx        Sticky-header table, stacked cards on mobile
├── App.tsx                  Section order and wiring
└── main.tsx                 Entry point
```

---

## Notes

Fictional concept vehicle. Built as a frontend engineering exercise.
