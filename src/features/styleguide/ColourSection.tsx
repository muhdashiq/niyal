import { contrastRatio } from './contrast';
import styles from './Styleguide.module.css';
import { useResolvedTokens } from './useResolvedTokens';

type Surface = 'dark' | 'light';

type ContrastPair = {
  label: string;
  foreground: string;
  background: string;
  minimum: number;
};

const TEXT_MINIMUM = 4.5;
const UI_MINIMUM = 3;

const SWATCH_TOKENS = [
  '--surface',
  '--surface-raised',
  '--text',
  '--text-muted',
  '--accent-text',
  '--accent-fill',
  '--accent-fill-hover',
  '--accent-edge',
  '--on-accent',
  '--line',
  '--line-strong',
  '--line-accent',
  '--focus',
  '--error',
] as const;

const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { label: 'Text', foreground: '--text', background: '--surface', minimum: TEXT_MINIMUM },
  { label: 'Text, raised', foreground: '--text', background: '--surface-raised', minimum: TEXT_MINIMUM },
  { label: 'Muted text', foreground: '--text-muted', background: '--surface', minimum: TEXT_MINIMUM },
  { label: 'Muted text, raised', foreground: '--text-muted', background: '--surface-raised', minimum: TEXT_MINIMUM },
  { label: 'Price', foreground: '--accent-text', background: '--surface', minimum: TEXT_MINIMUM },
  { label: 'Price, raised', foreground: '--accent-text', background: '--surface-raised', minimum: TEXT_MINIMUM },
  { label: 'Button label', foreground: '--on-accent', background: '--accent-fill', minimum: TEXT_MINIMUM },
  { label: 'Button label, hover', foreground: '--on-accent', background: '--accent-fill-hover', minimum: TEXT_MINIMUM },
  { label: 'Error message', foreground: '--error', background: '--surface', minimum: TEXT_MINIMUM },
  { label: 'Primary button edge', foreground: '--accent-edge', background: '--surface', minimum: UI_MINIMUM },
  { label: 'Ghost button outline', foreground: '--line-strong', background: '--surface', minimum: UI_MINIMUM },
  { label: 'Focus ring', foreground: '--focus', background: '--surface', minimum: UI_MINIMUM },
];

const SurfacePalette = ({ surface }: { surface: Surface }) => {
  const { scopeRef, resolved } = useResolvedTokens(SWATCH_TOKENS);

  return (
    <div ref={scopeRef} data-surface={surface} className={styles.panel}>
      <h3>{surface === 'dark' ? 'Dark surface' : 'Light surface'}</h3>

      <ul className={styles.swatches}>
        {SWATCH_TOKENS.map((token) => (
          <li key={token}>
            <div className={styles.chip} style={{ backgroundColor: `var(${token})` }} />
            <p className={`text-small ${styles.token}`}>{token}</p>
            <p className={`text-small text-muted ${styles.numeric}`}>{resolved[token]}</p>
          </li>
        ))}
      </ul>

      <table className={styles.contrast}>
        <caption className="text-small text-muted">WCAG AA contrast, read from the live tokens</caption>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => (
            <ContrastRow
              key={pair.label}
              pair={pair}
              foreground={resolved[pair.foreground]}
              background={resolved[pair.background]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

type ContrastRowProps = {
  pair: ContrastPair;
  foreground: string | undefined;
  background: string | undefined;
};

const ContrastRow = ({ pair, foreground, background }: ContrastRowProps) => {
  if (!foreground || !background) return null;
  const ratio = contrastRatio(foreground, background);

  return (
    <tr>
      <td>
        <span className={styles.sample} style={{ color: foreground, backgroundColor: background }}>
          Aa
        </span>
      </td>
      <th scope="row">{pair.label}</th>
      <td className={styles.numeric}>{ratio.toFixed(2)}:1</td>
      <td className={ratio >= pair.minimum ? 'text-muted' : styles.failing}>
        {ratio >= pair.minimum ? `Passes ${pair.minimum}` : `Fails ${pair.minimum}`}
      </td>
    </tr>
  );
};

export const ColourSection = () => (
  <section aria-labelledby="colour-heading">
    <div data-surface="light" className={styles.band}>
      <h2 id="colour-heading">Colour</h2>
    </div>
    <div className={styles.split}>
      <SurfacePalette surface="dark" />
      <SurfacePalette surface="light" />
    </div>
  </section>
);
