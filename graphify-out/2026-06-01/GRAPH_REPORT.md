# Graph Report - .  (2026-05-25)

## Corpus Check
- 87 files · ~351,920 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 242 nodes · 299 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Package & Dependencies|Package & Dependencies]]
- [[_COMMUNITY_Hero & Branding|Hero & Branding]]
- [[_COMMUNITY_UI Utilities & Pages|UI Utilities & Pages]]
- [[_COMMUNITY_Brand Assets|Brand Assets]]
- [[_COMMUNITY_Interactive Components|Interactive Components]]
- [[_COMMUNITY_Portfolio Projects|Portfolio Projects]]
- [[_COMMUNITY_Work Section UI|Work Section UI]]
- [[_COMMUNITY_Cursor Animation|Cursor Animation]]
- [[_COMMUNITY_Project Grid & Effects|Project Grid & Effects]]
- [[_COMMUNITY_Pricing & Services|Pricing & Services]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_Testimonials Section|Testimonials Section]]
- [[_COMMUNITY_Value Proposition|Value Proposition]]
- [[_COMMUNITY_Build Scripts|Build Scripts]]
- [[_COMMUNITY_Dev Config|Dev Config]]
- [[_COMMUNITY_Claude Settings|Claude Settings]]

## God Nodes (most connected - your core abstractions)
1. `Switch Case Studio (Boutique Web Design & Dev Studio)` - 11 edges
2. `useReducedMotion()` - 10 edges
3. `scripts` - 6 edges
4. `Switch Case Studio README` - 6 edges
5. `Public Index HTML (SPA Entry Point)` - 6 edges
6. `Switch Case Studio Starburst Logo Icon` - 6 edges
7. `MacBook Frame Mockup Asset` - 5 edges
8. `useBentoSpotlight()` - 4 edges
9. `PROJECT_LINKS` - 4 edges
10. `Zahav Med Spa (Client Project)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Ori – Team Member Portrait (B&W)` --references--> `Switch Case Studio (Boutique Web Design & Dev Studio)`  [INFERRED]
  public/images/ori.jpg → README.md
- `Maritime – For Your Special Time (Client Project)` --references--> `Switch Case Studio (Boutique Web Design & Dev Studio)`  [INFERRED]
  public/projects/maritime/maritime-cover-tile.webp → README.md
- `Open Graph Social Share Image` --references--> `Switch Case Studio (Boutique Web Design & Dev Studio)`  [EXTRACTED]
  public/images/og/og.png → README.md
- `Zahav Med Spa (Client Project)` --references--> `Switch Case Studio (Boutique Web Design & Dev Studio)`  [INFERRED]
  public/projects/zahav/zahav-cover-tile.webp → README.md
- `Jelly Belly Wiki (Client Project)` --references--> `Switch Case Studio (Boutique Web Design & Dev Studio)`  [INFERRED]
  public/projects/jelly-belly-wiki/jelly-belly-wiki-cover-tile.webp → README.md

## Hyperedges (group relationships)
- **Switch Case Studio Favicon Icon Set** — favicon_16x16, favicon_32x32, favicon_android_192, favicon_android_512, favicon_apple_touch [INFERRED 0.95]
- **Switch Case Studio Portfolio Projects** — zahav_med_spa, maritime_project, jelly_belly_wiki_project [INFERRED 0.95]
- **Consistent Cover Tile Visual System (Black Background + Centered Brand Mark)** — crimson_crimson_cover_tile, sha_design_studio_sha_design_studio_cover_tile, jo_marketing_11_jo_marketing_11_cover_tile, creatuwheels_creatuwheels_cover_tile, prodani_prodani_cover_tile, birth_of_venus_birth_of_venus_cover_tile, florida_energy_assistance_florida_energy_assistance_cover_tile, concept_cover_tile_pattern [INFERRED 0.95]
- **Portfolio Case Study Projects with Cover + Long-form Assets** — crimson_crimson_cover_tile, crimson_long, jo_marketing_11_jo_marketing_11_cover_tile, jo_marketing_11_long, prodani_prodani_cover_tile, prodani_long, birth_of_venus_birth_of_venus_cover_tile, birth_of_venus_long, florida_energy_assistance_florida_energy_assistance_cover_tile, florida_energy_assistance_long, concept_project_case_study [INFERRED 0.95]
- **Web Presentation Mockup Assets for Project Showcasing** — mockups_macbook_frame, concept_device_mockup, concept_project_case_study [INFERRED 0.85]

## Communities (19 total, 3 thin omitted)

### Community 0 - "Package & Dependencies"
Cohesion: 0.06
Nodes (31): browserslist, development, production, dependencies, @emailjs/browser, @fortawesome/free-brands-svg-icons, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome (+23 more)

### Community 1 - "Hero & Branding"
Cohesion: 0.10
Nodes (16): Hero(), HERO_COLORS, HERO_SHAPES, STRINGS, WelcomeTyped(), LEGAL_LINKS, PRICING_LINKS, PROJECT_LINKS (+8 more)

### Community 2 - "UI Utilities & Pages"
Cohesion: 0.07
Nodes (3): faqs, socials, root

### Community 3 - "Brand Assets"
Cohesion: 0.12
Nodes (23): Favicon 16x16 – Lavender Starburst Icon, Favicon 32x32 – Lavender Starburst Icon, Android Chrome Icon 192x192 – Lavender Starburst, Android Chrome Icon 512x512 – Lavender Starburst, Apple Touch Icon – Lavender Starburst, Ori – Team Member Portrait (B&W), Jelly Belly Wiki – Portfolio Cover Tile, Jelly Belly Wiki – Full Page Screenshot (+15 more)

### Community 4 - "Interactive Components"
Cohesion: 0.12
Nodes (3): DEFAULT_VIEWPORT, ProjectPage(), useImagePreload()

### Community 5 - "Portfolio Projects"
Cohesion: 0.24
Nodes (16): Birth of Venus Cover Tile, Birth of Venus Website Full-Page Screenshot, Cover Tile Design Pattern (Black Background + Centered Logo), Device Mockup for Web Presentation, Portfolio Case Study Project, Creatuwheels Cover Tile, Crimson Equities Cover Tile, Crimson Equities Full-Page Screenshot (+8 more)

### Community 7 - "Cursor Animation"
Cohesion: 0.20
Nodes (5): CursorWave, DEFAULT_COLORS, DEFAULT_SHAPES, getScsStarPath(), tracePath()

### Community 8 - "Project Grid & Effects"
Cohesion: 0.36
Nodes (7): ProjectsTiles(), Tile(), useBentoParticles(), useBentoSpotlight(), createParticle(), setGlowVars(), spotlightThresholds()

### Community 9 - "Pricing & Services"
Cohesion: 0.28
Nodes (4): PricingGuide(), servicesIndex, slugToServiceId, services

### Community 10 - "PWA Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 12 - "Value Proposition"
Cohesion: 0.25
Nodes (6): STEP_PRESETS, STEPS, ValueProp(), BRAND_PALETTE, DEFAULTS, WaveShader

### Community 14 - "Build Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, eject, postinstall, start, test

### Community 16 - "Dev Config"
Cohesion: 0.50
Nodes (3): ignoreUnimported, ignoreUnresolved, ignoreUnused

## Knowledge Gaps
- **76 isolated node(s):** `ignoreUnresolved`, `ignoreUnimported`, `ignoreUnused`, `name`, `version` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useReducedMotion()` connect `Hero & Branding` to `Interactive Components`, `Work Section UI`, `Project Grid & Effects`, `Testimonials Section`, `Value Proposition`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `scripts` connect `Build Scripts` to `Package & Dependencies`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `Portfolio Case Study Project` (e.g. with `Crimson Equities Full-Page Screenshot` and `JO-11 Marketing Full-Page Screenshot`) actually correct?**
  _`Portfolio Case Study Project` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Switch Case Studio (Boutique Web Design & Dev Studio)` (e.g. with `Zahav Med Spa (Client Project)` and `Maritime – For Your Special Time (Client Project)`) actually correct?**
  _`Switch Case Studio (Boutique Web Design & Dev Studio)` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `Cover Tile Design Pattern (Black Background + Centered Logo)` (e.g. with `Crimson Equities Cover Tile` and `SHA Design Studio Cover Tile`) actually correct?**
  _`Cover Tile Design Pattern (Black Background + Centered Logo)` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ignoreUnresolved`, `ignoreUnimported`, `ignoreUnused` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._