import styles from './Styleguide.module.css';

type TypeStep = {
  name: string;
  range: string;
  className: string;
  sample: string;
};

const TYPE_STEPS: readonly TypeStep[] = [
  { name: 'Display', range: '58 to 132 px', className: 'text-display', sample: 'Made to understand you' },
  { name: 'Heading 1', range: '48 to 84 px', className: 'text-h1', sample: 'The collection' },
  { name: 'Heading 2', range: '36 to 56 px', className: 'text-h2', sample: 'Which size is right for you' },
  { name: 'Heading 3', range: '26 to 34 px', className: 'text-h3', sample: 'Rose Atelier' },
  { name: 'Lead', range: '21 to 26 px', className: 'text-lead', sample: 'Smoke and resin, warmed on skin.' },
  {
    name: 'Body',
    range: '16 to 18 px',
    className: 'text-body',
    sample:
      'Niyal starts by listening. Tell us what you reach for and what you avoid, and we compose a fragrance around the person who will wear it.',
  },
  { name: 'Small', range: '14 to 15 px', className: 'text-small', sample: 'Your order opens in WhatsApp, ready to send.' },
  { name: 'Label', range: '12 to 13 px', className: 'text-label', sample: 'Heart notes' },
];

export const TypeSection = () => (
  <section data-surface="light" className={styles.band} aria-labelledby="type-heading">
    <h2 id="type-heading" className={styles.sectionHeading}>
      Type
    </h2>
    <dl className={styles.typeScale}>
      {TYPE_STEPS.map((step) => (
        <div key={step.name} className={styles.typeStep}>
          <dt className="text-small text-muted">
            {step.name}, {step.range}
          </dt>
          <dd className={step.className}>{step.sample}</dd>
        </div>
      ))}
    </dl>
  </section>
);
