import React from "react";
import "../styles/components/projectDetails.scss";

const ProjectDetails = ({ onClose }) => {
  // Static content to match your screenshot; swap for dynamic later
  const data = {
    imageSrc: "/images/speaker-magali.jpg",
    imageAlt: "Portrait of Magali Rack",
    backLabel: "Back to Speakers",
    title: "STUDIO SAGE",
    subtitle: "Magali Rack, founder of Studio Sage",
    description:
      "Magali Rack worked in marketing before founding Studio Sage in 2019, which specializes in meditation. A long-term yoga and meditation aficionado, Magali responds to the growing demand for meditation and its interdisciplinary offshoots. She revisits meditation and movement by incorporating her passion for music, light and experience. The studio’s goal is to democratize meditation by offering an accessible, modern and transformative approach to a clientele eager for personal development.",
    socials: [
      { label: "FACEBOOK", href: "#" },
      { label: "LINKEDIN", href: "#" },
      { label: "INSTAGRAM", href: "#" },
    ],
    footnote: "Bilingual (FR & EN)",
    sectionKicker: "Coaching",
    productName: "RECHARGE",
    ctaLabel: "Learn More",
  };

  return (
    <section className="project-details" aria-label="Project details">
      <div className="project-details__media">
        <img
          src={data.imageSrc}
          alt={data.imageAlt}
          className="project-details__img"
        />
      </div>

      <div className="project-details__panel">
        <header className="project-details__header">
          <button
            className="project-details__back"
            type="button"
            onClick={onClose}
          >
            {data.backLabel}
          </button>
          <button
            className="project-details__close"
            type="button"
            aria-label="Close details"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <main className="project-details__main">
          <h1 className="project-details__title">{data.title}</h1>
          <p className="project-details__subtitle">{data.subtitle}</p>

          <p className="project-details__desc">{data.description}</p>

          <nav className="project-details__socials" aria-label="Social links">
            {data.socials.map((s) => (
              <a key={s.label} href={s.href} className="project-details__social">
                {s.label}
              </a>
            ))}
          </nav>
        </main>

        <div className="project-details__divider" role="separator" />

        <section
          className="project-details__cta"
          aria-label="Coaching product highlight"
        >
          <p className="project-details__footnote">{data.footnote}</p>
          <p className="project-details__kicker">{data.sectionKicker}</p>
          <h2 className="project-details__product">{data.productName}</h2>
          <button className="project-details__button" type="button">
            {data.ctaLabel}
          </button>
        </section>
      </div>
    </section>
  );
};

export default ProjectDetails;
