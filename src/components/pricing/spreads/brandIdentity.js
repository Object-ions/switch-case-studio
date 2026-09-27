/* Brand Identity package board art (2026-09-26): what each tier buys, drawn
   on the studio's own brand. Every tile is a 400x300 SVG in the brand-book
   language (cream page, ink lines, the site palette), shown as a row
   thumbnail on the board (PackageBoard.js). Deliverables only, never
   process steps. Fill classes come from servicePoster.scss (sp-f-*) plus
   the lilac/lavender/blue extras in packageBoard.scss (tsp-f-*). */
import { SANS, DISPLAY, Wordmark, Burst, Mark, gridPath, Chip, Lines } from "./artKit";

export const SWATCHES = [
  { name: "Cream", hex: "#fef7ed", cls: "sp-f-cream", stroke: true },
  { name: "Lilac", hex: "#dbaae2", cls: "tsp-f-lilac" },
  { name: "Terra", hex: "#f06637", cls: "sp-f-terra" },
  { name: "Mint", hex: "#79ccb6", cls: "sp-f-mint" },
  { name: "Ink", hex: "#141414", cls: "sp-f-ink" },
];

/* ── Tier 1: Logo & Style Guide ── */
const LogoArt = () => (
  <>
    <rect x="30" y="28" width="340" height="176" rx="10" className="sp-f-ink" />
    <Wordmark x="60" y="44" width="280" height="144" />
    {["AI", "SVG", "PNG", "JPG"].map((f, i) => (
      <Chip key={f} x={30 + i * 88} w={76} y={230} label={f} />
    ))}
  </>
);
const PaletteArt = () => (
  <>
    {SWATCHES.map((s, i) => (
      <g key={s.name} transform={`translate(${30 + i * 70} 36)`}>
        <rect width="60" height="140" rx="8" className={s.cls} stroke={s.stroke ? "#141414" : "none"} strokeWidth="3" />
        <text x="30" y="184" textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" className="sp-f-ink">
          {s.name}
        </text>
        <text x="30" y="212" textAnchor="middle" fontFamily={SANS} fontSize="15" fontWeight="500" className="sp-f-ink" fillOpacity="0.6">
          {s.hex}
        </text>
      </g>
    ))}
  </>
);
const TypeArt = () => (
  <>
    <text x="110" y="160" textAnchor="middle" fontFamily={DISPLAY} fontSize="112" fontWeight="700" className="sp-f-ink">
      Aa
    </text>
    <text x="290" y="160" textAnchor="middle" fontFamily={SANS} fontSize="112" fontWeight="500" letterSpacing="-5" className="sp-f-ink">
      Aa
    </text>
    <path d="M200 40V210" className="sp-s-ink" strokeWidth="3" />
    <text x="110" y="232" textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" className="sp-f-ink">
      SCS Display
    </text>
    <text x="110" y="256" textAnchor="middle" fontFamily={SANS} fontSize="15" fontWeight="500" className="sp-f-ink" fillOpacity="0.6">
      Headlines
    </text>
    <text x="290" y="232" textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" className="sp-f-ink">
      Inter
    </text>
    <text x="290" y="256" textAnchor="middle" fontFamily={SANS} fontSize="15" fontWeight="500" className="sp-f-ink" fillOpacity="0.6">
      Everything else
    </text>
  </>
);
// One page: logo, swatches, type, three rules of guidance.
const Page = ({ x, y, w = 176, h = 236 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <rect x="16" y="16" width={w - 32} height="56" rx="4" className="sp-f-ink" />
    <Wordmark x="28" y="22" width={w - 56} height="44" />
    {SWATCHES.map((s, i) => (
      <rect key={s.name} x={16 + i * 30} y="86" width="24" height="24" rx="3" className={s.cls} stroke={s.stroke ? "#141414" : "none"} strokeWidth="2" />
    ))}
    <text x="16" y="156" fontFamily={DISPLAY} fontSize="40" fontWeight="700" className="sp-f-ink">
      Aa
    </text>
    <text x="70" y="156" fontFamily={SANS} fontSize="36" fontWeight="500" className="sp-f-ink">
      Aa
    </text>
    <Lines x={16} y={178} widths={[w - 32, w - 60, w - 44]} h={6} gap={14} opacity="0.35" />
  </g>
);
const SheetArt = () => <Page x={112} y={32} />;

/* ── Tier 2: Brand Starter Kit ── */
const MoodArt = () => (
  <>
    <rect x="30" y="30" width="108" height="112" className="sp-f-ink" />
    <path d={gridPath(30, 30, 108, 112, 27)} className="sp-s-cream" strokeOpacity="0.25" strokeWidth="1.5" />
    <rect x="146" y="30" width="108" height="112" className="tsp-f-lilac" />
    <Burst x={200} y={86} r={38} className="sp-f-terra" />
    <rect x="262" y="30" width="108" height="112" className="sp-f-terra" />
    <text x="316" y="106" textAnchor="middle" fontFamily={DISPLAY} fontSize="58" fontWeight="700" className="sp-f-cream">
      Sc
    </text>
    <rect x="30" y="150" width="108" height="112" className="sp-f-mint" />
    <text x="84" y="222" textAnchor="middle" fontFamily={SANS} fontSize="54" fontWeight="500" className="sp-f-ink">
      {"{ }"}
    </text>
    <rect x="146" y="150" width="108" height="112" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <Lines x={162} y={176} widths={[76, 56, 68, 40]} gap={18} opacity="0.35" />
    <rect x="262" y="150" width="108" height="112" className="tsp-f-blue" />
    <text x="316" y="216" textAnchor="middle" fontFamily={SANS} fontSize="34" fontWeight="800" className="sp-f-cream">
      2026
    </text>
    <g transform="translate(224 128) rotate(-6)">
      <rect x="-64" y="-16" width="128" height="32" rx="16" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
      <text y="6" textAnchor="middle" fontFamily={SANS} fontSize="16" fontWeight="700" className="sp-f-ink">
        playful, precise
      </text>
    </g>
  </>
);
const Phone = ({ x, y, cls, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width="104" height="190" rx="14" className={cls} stroke="#141414" strokeWidth="3" />
    {children}
  </g>
);
const SocialArt = () => (
  <>
    <Phone x={34} y={56} cls="sp-f-ink">
      <Lines x={14} y={26} widths={[70, 52]} h={10} gap={18} className="tsp-f-lav" />
      <Burst x={52} y={126} r={30} className="tsp-f-lilac" />
    </Phone>
    <Phone x={148} y={40} cls="tsp-f-lilac">
      <Wordmark x="12" y="30" width="80" height="60" />
      <Lines x={14} y={116} widths={[76, 60, 68]} h={7} gap={15} opacity="0.5" />
      <rect x="14" y="160" width="46" height="14" rx="7" className="sp-f-ink" />
    </Phone>
    <Phone x={262} y={56} cls="sp-f-terra">
      <text x="14" y="70" fontFamily={SANS} fontSize="30" fontWeight="800" className="sp-f-cream">
        Ship
      </text>
      <text x="14" y="104" fontFamily={SANS} fontSize="30" fontWeight="800" className="sp-f-cream">
        it.
      </text>
      <rect x="14" y="152" width="76" height="20" rx="10" className="sp-f-cream" />
    </Phone>
  </>
);
const CardArt = () => (
  <>
    <g transform="translate(206 150) rotate(-8)">
      <rect x="-120" y="-70" width="240" height="140" rx="8" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
      <text x="-96" y="-22" fontFamily={SANS} fontSize="22" fontWeight="700" className="sp-f-ink">
        Moses
      </text>
      <text x="-96" y="2" fontFamily={SANS} fontSize="14" fontWeight="500" className="sp-f-ink" fillOpacity="0.65">
        Brand Strategist
      </text>
      <text x="-96" y="46" fontFamily={SANS} fontSize="13" fontWeight="500" className="sp-f-ink" fillOpacity="0.65">
        hello@switchcasestudio.com
      </text>
      <Mark x={78} y={-20} r={30} />
    </g>
    <g transform="translate(150 180) rotate(6)">
      <rect x="-120" y="-70" width="240" height="140" rx="8" className="sp-f-ink" />
      <Wordmark x="-80" y="-56" width="160" height="112" />
    </g>
  </>
);
const GuideArt = () => (
  <>
    <rect x="132" y="56" width="176" height="220" className="sp-f-cream" stroke="#141414" strokeWidth="3" transform="rotate(4 220 166)" />
    <rect x="122" y="46" width="176" height="220" className="sp-f-cream" stroke="#141414" strokeWidth="3" transform="rotate(-3 210 156)" />
    <g transform="translate(112 36)">
      <rect width="176" height="220" className="sp-f-ink" />
      <Wordmark x="24" y="24" width="128" height="80" />
      <text x="20" y="150" fontFamily={SANS} fontSize="20" fontWeight="700" className="sp-f-cream">
        Brand guide
      </text>
      <Lines x={20} y={168} widths={[120, 90]} h={6} gap={14} className="sp-f-cream" opacity="0.5" />
    </g>
    <Chip x={252} y={236} w={72} label="PDF" />
  </>
);

/* ── Tier 3: Brand System & Launch ── */
const SystemArt = () => (
  <>
    <rect x="30" y="34" width="200" height="110" rx="8" className="sp-f-ink" />
    <Wordmark x="50" y="42" width="160" height="94" />
    <rect x="30" y="156" width="200" height="110" rx="8" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <Wordmark x="50" y="164" width="160" height="94" />
    <rect x="242" y="34" width="128" height="232" rx="8" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <Mark x={306} y={150} r={54} />
  </>
);
const PatternsArt = () => (
  <>
    <rect x="30" y="30" width="340" height="240" className="sp-f-ink" />
    <path d={gridPath(30, 30, 340, 240, 34)} className="sp-s-cream" strokeOpacity="0.22" strokeWidth="1.5" />
    <Burst x={100} y={100} r={54} className="tsp-f-blue">
      <text y="9" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="800" className="sp-f-cream" transform="rotate(-12)">
        2026
      </text>
    </Burst>
    <g transform="translate(232 82) rotate(-6)">
      <rect x="-86" y="-24" width="172" height="48" rx="24" className="sp-f-terra" />
      <text y="9" textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="800" className="sp-f-cream">
        #switchcase
      </text>
    </g>
    <g transform="translate(300 194) rotate(8)">
      <path d="M-46 40V-14A46 46 0 0 1 46 -14V40Z" className="sp-f-terra" />
      <text y="6" textAnchor="middle" fontFamily={DISPLAY} fontSize="28" fontWeight="700" className="sp-f-cream">
        Switch
      </text>
      <text y="32" textAnchor="middle" fontFamily={DISPLAY} fontSize="28" fontWeight="700" className="sp-f-cream">
        Case
      </text>
    </g>
    <g transform="translate(130 206) rotate(-4)">
      <rect x="-70" y="-26" width="140" height="52" rx="10" className="sp-f-mint" />
      <text y="10" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="500" className="sp-f-ink">
        {"{ }"}
      </text>
    </g>
  </>
);
const DeckArt = () => (
  <>
    <rect x="66" y="52" width="320" height="180" rx="6" className="tsp-f-lilac" stroke="#141414" strokeWidth="3" />
    <rect x="30" y="76" width="320" height="180" rx="6" className="sp-f-ink" />
    <text x="54" y="150" fontFamily={SANS} fontSize="34" fontWeight="700" letterSpacing="-1" className="sp-f-cream">
      Design, code
    </text>
    <text x="54" y="190" fontFamily={SANS} fontSize="34" fontWeight="700" letterSpacing="-1" className="sp-f-cream">
      {"& AI."}
    </text>
    <text x="54" y="234" fontFamily={SANS} fontSize="14" fontWeight="500" className="tsp-f-lav">
      Switch Case Studio
    </text>
    <Mark x={300} y={166} r={34} />
  </>
);
const HomeArt = () => (
  <>
    <rect x="30" y="30" width="340" height="240" rx="8" className="sp-f-ink" />
    <path d="M30 66H370" className="sp-s-cream" strokeOpacity="0.2" strokeWidth="2" />
    <circle cx="50" cy="48" r="5" className="sp-f-cream" />
    <circle cx="68" cy="48" r="5" className="sp-f-cream" />
    <circle cx="86" cy="48" r="5" className="sp-f-cream" />
    <path d={gridPath(30, 66, 340, 204, 34)} className="sp-s-cream" strokeOpacity="0.12" strokeWidth="1.5" />
    <rect x="290" y="82" width="64" height="20" rx="4" fill="none" className="tsp-s-lav" strokeWidth="2" />
    <Wordmark x="110" y="96" width="180" height="90" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={54 + i * 104} y="204" width="92" height="50" rx="4" className={["sp-f-cream", "sp-f-mint", "sp-f-terra"][i]} />
    ))}
  </>
);

export const TILES = {
  logo: { label: "Logo files", Art: LogoArt },
  palette: { label: "Color palette", Art: PaletteArt },
  type: { label: "Type", Art: TypeArt },
  sheet: { label: "1-page brand sheet", Art: SheetArt },
  mood: { label: "Mood board", Art: MoodArt },
  social: { label: "Social templates", Art: SocialArt },
  card: { label: "Business card", Art: CardArt },
  guide: { label: "Brand guide", Art: GuideArt },
  system: { label: "Logo system", Art: SystemArt },
  patterns: { label: "Design patterns", Art: PatternsArt },
  deck: { label: "Presentation template", Art: DeckArt },
  home: { label: "Homepage direction", Art: HomeArt },
};

/* Per tier (keys are the tier names in pricingData.json):
   `tiles`     deliverables this tier introduces (one board row each);
   `inherits`  the tier whose tiles it also carries;
   `notes`     where the data grades a deliverable, the grade shown in the
               cell (every note paraphrases that tier's own `includes`);
   `for`       who it is for, in the tier description's own words;
   `process`   how we get there, the steps that are not deliverables. */
export const TIERS = {
  "Logo & Style Guide": {
    for: "Solo entrepreneurs and micro-businesses",
    tiles: ["logo", "palette", "type", "sheet"],
    notes: { logo: "AI, SVG, PNG, JPG", palette: "Basic", type: "Pairing" },
    process: ["Discovery call and creative brief", "2–3 logo concepts, 1 round of refinements"],
  },
  "Brand Starter Kit": {
    inherits: "Logo & Style Guide",
    for: "Small businesses defining their voice",
    tiles: ["mood", "social", "card", "guide"],
    notes: { palette: "Expanded", type: "Type system", social: "5–7 posts and stories", guide: "Basic, PDF" },
    process: ["Brand questionnaire and strategy mini-workshop", "Logo design, multiple directions", "Naming and tagline support, optional"],
  },
  "Brand System & Launch": {
    inherits: "Brand Starter Kit",
    for: "Growing or rebranding businesses",
    tiles: ["system", "patterns", "deck", "home"],
    notes: { palette: "Custom", type: "Type system", social: "Plus marketing collateral", guide: "15+ pages" },
    process: ["In-depth discovery and positioning workshop", "Competitive and visual audit"],
    // "Seen in": a shipped case study whose brand scope matches this package
    // (owner's call, 2026-09-26). The other two packages have none yet.
    examples: [{ slug: "my-challah-dealer", label: "My Challah Dealer" }],
  },
};

/* Board sections (PackageBoard.js): rows derived from the tiles and the
   inherits chain above, so this module keeps its authoring as "what each
   tier adds". A cell is the tier's note for that tile, or true. */
const NAMES = Object.keys(TIERS);
const tilesOf = (name) => [...(TIERS[name].inherits ? tilesOf(TIERS[name].inherits) : []), ...TIERS[name].tiles];
export const SECTIONS = [
  {
    id: "packages",
    title: "What's in each package",
    unit: "package",
    tiers: NAMES,
    rows: NAMES.flatMap((name) => TIERS[name].tiles).map((id) => ({
      id,
      label: TILES[id].label,
      Art: TILES[id].Art,
      cells: Object.fromEntries(
        NAMES.filter((n) => tilesOf(n).includes(id)).map((n) => [n, (TIERS[n].notes && TIERS[n].notes[id]) || true]),
      ),
    })),
  },
];
export const NOTE = "Shown on our own brand. Yours is built from scratch.";
