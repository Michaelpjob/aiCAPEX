// ============================================================
// aiCAPEX — Shared data module
// Loaded by both index.html (Sankey) and calls.html (Calls grid).
// Exposes globals so plain <script src=> loads work; no bundler needed.
// ============================================================

// Spender CapEx by year ($B). 2023-2025 reported; 2026 current guidance; 2027-2029 projections.
const spenderCapex = {
  Microsoft:  [28.1, 44.5, 64.6, 190, 225, 250, 270],
  Amazon:     [48.3, 85.8, 142.4, 200, 220, 240, 255],
  Alphabet:   [32.3, 52.5, 91.4, 185, 230, 260, 285],
  Meta:       [28.1, 39.2, 72.2, 135, 165, 185, 195],
  Oracle:     [8.7,  6.9,  21.2, 50,  75,  90,  100],
  CoreWeave:  [0.5,  4,    14,   33,  50,  65,  75],
  xAI:        [0,    1,    8,    20,  32,  40,  45],
  Stargate:   [0,    0,    0,    35,  60,  45,  30]
};

const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029];

// Spending waterfall (% per year). Silicon-heavy shift over time.
const waterfall = {
  2023: { Land:3, "Utility/Grid":4, "Power Gen":3, Electrical:12, Cooling:9, Shell:13, Networking:7, Servers:12, GPUs:22, Memory:5, DCIM:2, Water:4, Commission:4 },
  2024: { Land:3, "Utility/Grid":5, "Power Gen":3, Electrical:11, Cooling:9, Shell:11, Networking:7, Servers:11, GPUs:28, Memory:5, DCIM:2, Water:3, Commission:2 },
  2025: { Land:2, "Utility/Grid":5, "Power Gen":4, Electrical:11, Cooling:9, Shell:9,  Networking:7, Servers:10, GPUs:32, Memory:6, DCIM:2, Water:3, Commission:0 },
  2026: { Land:2, "Utility/Grid":5, "Power Gen":4, Electrical:10, Cooling:8, Shell:7,  Networking:7, Servers:10, GPUs:34, Memory:8, DCIM:2, Water:3, Commission:0 },
  2027: { Land:2, "Utility/Grid":6, "Power Gen":4, Electrical:10, Cooling:9, Shell:6,  Networking:7, Servers:10, GPUs:35, Memory:7, DCIM:2, Water:3, Commission:0 },
  2028: { Land:2, "Utility/Grid":6, "Power Gen":5, Electrical:10, Cooling:9, Shell:5,  Networking:8, Servers:10, GPUs:35, Memory:7, DCIM:2, Water:3, Commission:0 },
  2029: { Land:2, "Utility/Grid":6, "Power Gen":5, Electrical:10, Cooling:9, Shell:5,  Networking:8, Servers:10, GPUs:34, Memory:7, DCIM:2, Water:3, Commission:1 }
};

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

// Supplier shares per segment (within-segment %). Slight evolution year-over-year.
// Source: Dell'Oro, IDC Ethernet Tracker, market research synthesis.
function shares(year) {
  const t = (year - 2023) / 6;
  return {
    GPUs: {
      "NVIDIA":      lerp(0.92, 0.68, t),
      "AMD":         lerp(0.04, 0.13, t),
      "Custom ASIC (Broadcom et al.)": lerp(0.02, 0.13, t),
      "Intel/Other": lerp(0.02, 0.06, t)
    },
    Memory: {
      "SK Hynix":  lerp(0.50, 0.55, t),
      "Samsung":   lerp(0.35, 0.20, t),
      "Micron":    lerp(0.15, 0.25, t)
    },
    Networking: {
      "Arista":           0.20,
      "Cisco":            lerp(0.30, 0.18, t),
      "NVIDIA Networking":lerp(0.05, 0.30, t),
      "Broadcom":         0.13,
      "Coherent":         0.06,
      "Lumentum":         0.04,
      "Innolight":        0.05,
      "Other Optics":     lerp(0.17, 0.04, t)
    },
    Servers: {
      "Quanta (ODM)": 0.27,
      "Dell":         0.20,
      "Wiwynn":       0.14,
      "Foxconn":      0.12,
      "Supermicro":   0.08,
      "HPE":          0.06,
      "Inspur":       0.07,
      "Other ODM":    0.06
    },
    Electrical: {
      "Schneider Electric": 0.20,
      "Vertiv":             0.18,
      "Eaton":              0.16,
      "ABB":                0.12,
      "Siemens":            0.10,
      "Legrand/Hubbell":    0.08,
      "Other Electrical":   0.16
    },
    Cooling: {
      "Vertiv":           0.18,
      "Schneider Electric":0.18,
      "Johnson Controls": 0.12,
      "Trane":            0.10,
      "Carrier":          0.08,
      "Modine":           0.05,
      "CoolIT/Asetek":    0.06,
      "Other Thermal":    0.23
    },
    "Power Gen": {
      "Caterpillar":   0.30,
      "Cummins":       0.25,
      "GE Vernova":    0.20,
      "Rolls-Royce":   0.08,
      "Other Gen":     0.17
    },
    "Utility/Grid": {
      "GE Vernova":      0.22,
      "Quanta Services": 0.18,
      "Siemens Energy":  0.15,
      "MYR/MasTec":      0.10,
      "Hubbell":         0.07,
      "Utilities (Constellation, NextEra, etc.)": 0.28
    },
    Shell: {
      "Turner":         0.18,
      "DPR":            0.12,
      "Mortenson":      0.10,
      "AECOM":          0.08,
      "Fluor":          0.06,
      "Holder":         0.05,
      "Whiting-Turner": 0.05,
      "Jacobs":         0.04,
      "EMCOR/Comfort Sys": 0.10,
      "Other Builders": 0.22
    },
    Water: {
      "Xylem":     0.22,
      "Flowserve": 0.14,
      "Pentair":   0.10,
      "Watts":     0.06,
      "Mueller":   0.06,
      "Ferguson":  0.10,
      "Other Fluid": 0.32
    },
    DCIM: {
      "Schneider Electric": 0.25,
      "Honeywell":          0.18,
      "Johnson Controls":   0.12,
      "Other DCIM":         0.45
    },
    Land: {
      "Land Developers": 1.00
    },
    Commission: {
      "Commissioning Firms": 1.00
    }
  };
}

// Color palettes — keys must match segment / spender names above.
const segmentColor = {
  GPUs:           "#ff6b6b",
  Memory:         "#fa5252",
  Servers:        "#fab005",
  Networking:     "#4dabf7",
  Electrical:     "#ffd43b",
  Cooling:        "#74c0fc",
  "Power Gen":    "#ffa94d",
  "Utility/Grid": "#9775fa",
  Shell:          "#69db7c",
  Water:          "#3bc9db",
  DCIM:           "#e599f7",
  Land:           "#868e96",
  Commission:     "#adb5bd"
};

const spenderColor = {
  Microsoft: "#00bcf2",
  Amazon:    "#ff9900",
  Alphabet:  "#34a853",
  Meta:      "#1877f2",
  Oracle:    "#f80000",
  CoreWeave: "#ff5e2b",
  xAI:       "#ffffff",
  Stargate:  "#a78bfa"
};

// Convenience helpers shared by both pages.
function totalCapexForYear(year) {
  const yi = years.indexOf(year);
  if (yi < 0) return 0;
  return Object.values(spenderCapex).reduce((a, arr) => a + arr[yi], 0);
}

function segmentSpendForYear(year, segment) {
  const total = totalCapexForYear(year);
  const w = waterfall[year];
  if (!w || w[segment] == null) return 0;
  return total * (w[segment] / 100);
}

// Expose as window globals for plain <script> loading.
if (typeof window !== 'undefined') {
  window.AICAPEX = {
    spenderCapex, years, waterfall, shares, lerp,
    segmentColor, spenderColor,
    totalCapexForYear, segmentSpendForYear
  };
}
