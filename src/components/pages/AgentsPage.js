import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import agents from '../../data/agents.json';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/agentsPage.scss';

/* The pipeline diagram is deliberately built from DOM nodes, not an SVG.
   A fixed-viewBox diagram either crops or shrinks its labels below legibility
   on a phone; this reflows to a single column and the labels stay real text
   (selectable, translatable, readable by a screen reader).

   It shows the SHAPE of the system — request in, agent, tool, published
   artifact, notification back — and nothing about where any of it lives. */
const PIPELINE = [
  { step: 'Request', detail: 'A message from Moses, or a scheduled run' },
  { step: 'Agent', detail: 'Reads its brief, picks the topic, does the work' },
  { step: 'Tools', detail: 'Generation app, workflow engine, our repository' },
  { step: 'Artifact', detail: 'An article, a packet of drafts, a rendered video' },
  { step: 'Human', detail: 'Nothing publishes to a client surface unapproved' },
];

const AgentsPage = () => {
  /* Header AND cards use the GSAP house reveal rather than motion/react
     variants: motion's initial="hidden" is server-rendered, so the cards
     would ship with opacity:0 baked into the static HTML — and the cards ARE
     the proof this page exists to show.

     ONE hook call covering both, never two. usePageHeaderReveal holds its
     first-load detection in MODULE-level latches, so a second call on the
     same page reads the latch the first call just set, concludes it is a
     client navigation, and hides its targets at hydration — the exact flash
     the hook was written to avoid. Verified: two calls left the cards at
     opacity 0. Widen the selector instead. */
  const pageRef = useRef(null);
  usePageHeaderReveal(pageRef, '.page-head-animate, .agents-page__card');

  return (
    <>
      <Seo
        title="Our Agents — Switch Case Studio"
        description="We run our own AI agents on our own hardware. Here is what each one does, what it runs on, and what it has actually produced — with the parts we cannot prove left out."
        path="/agents"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Our Agents — Switch Case Studio',
          url: 'https://switchcasestudio.com/agents',
          description:
            'The AI agents Switch Case Studio runs in-house: what each does, what it runs on, and what it has produced.',
          publisher: {
            '@type': 'Organization',
            name: 'Switch Case Studio',
            url: 'https://switchcasestudio.com',
          },
        }}
      />

      <article className="agents-page" aria-label="Our agents" ref={pageRef}>
        <header className="agents-page__header">
          <p className="agents-page__kicker page-head-animate">In-house AI</p>
          <h1 className="agents-page__title page-head-animate">
            The agents that run this studio
          </h1>
          <p className="agents-page__lede page-head-animate">
            Most agencies that sell AI automation cannot show you one running. We
            can: these two work here every week, on hardware we own, and the
            output is on this site.
          </p>
        </header>

        {/* ── Agent cards ── */}
        <section className="agents-page__grid" aria-label="Agents">
          {agents.map((agent) => (
            <div key={agent.id} className="agents-page__card">
              <div className="agents-page__card-head">
                <span className="agents-page__card-emoji" aria-hidden="true">
                  {agent.emoji}
                </span>
                <div>
                  <h2 className="agents-page__card-name">{agent.name}</h2>
                  <p className="agents-page__card-role">{agent.role}</p>
                </div>
              </div>

              <p className="agents-page__card-summary">{agent.summary}</p>

              <ul className="agents-page__card-list">
                {agent.does.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <dl className="agents-page__specs">
                <div>
                  <dt>Model</dt>
                  <dd>{agent.model}</dd>
                </div>
                <div>
                  <dt>Runs on</dt>
                  <dd>{agent.runsOn}</dd>
                </div>
              </dl>

              <p className="agents-page__proof">
                <span className="agents-page__proof-label">
                  {agent.proof.label}
                </span>
                {agent.proof.text}
                {agent.proof.url && (
                  <a
                    className="agents-page__proof-link"
                    href={agent.proof.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {agent.proof.urlLabel || 'View the code'}
                  </a>
                )}
              </p>
            </div>
          ))}
        </section>

        {/* ── How the work flows ── */}
        <section className="agents-page__section" aria-label="How the work flows">
          <h2 className="agents-page__h2">How the work flows</h2>
          <p className="agents-page__body">
            The same five steps whether the output is an article, a week of
            social drafts, or a rendered video. The interesting part is the last
            one.
          </p>

          <ol className="agents-page__pipeline">
            {PIPELINE.map((node, i) => (
              <li className="agents-page__node" key={node.step}>
                <span className="agents-page__node-index" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="agents-page__node-step">{node.step}</span>
                <span className="agents-page__node-detail">{node.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── The honest part ── */}
        <section className="agents-page__section" aria-label="What we do not claim">
          <h2 className="agents-page__h2">What we are not claiming</h2>
          <p className="agents-page__body">
            An agents page is an easy place to invent numbers, so here is what is
            missing and why.
          </p>
          <ul className="agents-page__plain-list">
            <li>
              <strong>No hours-saved figure.</strong> We asked both agents
              directly and neither could evidence one, so there isn&apos;t a
              number here. When we have a measured one, it will say how it was
              measured.
            </li>
            <li>
              <strong>Approval is not automated away.</strong> Both agents draft
              far more than they publish. The social engine is explicitly locked
              to draft-only.
            </li>
            <li>
              <strong>Beau&apos;s articles are committed under a human name</strong>{' '}
              because a person reviews them before they go out — which is also
              why this page tells you that rather than letting you find it in the
              commit log.
            </li>
          </ul>
        </section>

        {/* ── Related proof ── */}
        <section className="agents-page__section" aria-label="See it yourself">
          <h2 className="agents-page__h2">See it yourself</h2>
          <ul className="agents-page__plain-list">
            <li>
              The workflow that drafts our social posts is a{' '}
              <Link to="/blog/the-social-content-engine-we-run-has-no-ai-in-it">
                free download
              </Link>{' '}
              — the real one, with our content swapped for templates.
            </li>
            <li>
              Beau&apos;s articles are on{' '}
              <Link to="/blog">the blog</Link>. Seven of the eight are his.
            </li>
          </ul>
        </section>

        <BookCallCta />
      </article>
    </>
  );
};

export default AgentsPage;
