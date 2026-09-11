/* Hero-frame chrome shared by every poster: corner meta and the one
   headline. Pure SVG, SSR-safe; 7% safe area inside the 1000 viewBox. */
const META = { fontFamily: "Inter, 'Inter Fallback', sans-serif", fontSize: 28, fontWeight: 500, letterSpacing: 3 };

export default function PosterFrame({ n, headline, tone = "ink" }) {
  const cls = `sp-f-${tone}`;
  return (
    <g>
      <text x="70" y="96" className={cls} {...META}>{`SCS·0${n}`}</text>
      <text x="930" y="96" textAnchor="end" className={cls} {...META}>2026</text>
      <text x="930" y="930" textAnchor="end" className={cls} {...META}>PDX</text>
      <text
        data-p="headline"
        x="70"
        y="930"
        className={cls}
        fontFamily="Inter, 'Inter Fallback', sans-serif"
        fontSize="72"
        fontWeight="700"
        letterSpacing="-2.5"
      >
        {headline}
      </text>
    </g>
  );
}
