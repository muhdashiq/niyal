import { useId } from 'react';
import { useLocale } from '../i18n/LocaleProvider';
import type { BottleSize, Perfume } from '../types';
import styles from './BottleArt.module.css';

type BottleArtProps = {
  perfume: Pick<Perfume, 'name' | 'accent' | 'image'>;
  size: BottleSize;
  decorative?: boolean; // true when text beside the bottle already names it
  priority?: boolean; // true for a photo that's the main thing on screen at load
};

type Proportions = { width: number; height: number; cap: number };

// Scales applied to the 100 ml drawing below. Transforms alone change the size,
// so switching sizes is a plain CSS transition.
const PROPORTIONS: Record<BottleSize, Proportions> = {
  30: { width: 0.8, height: 0.58, cap: 0.82 },
  50: { width: 0.88, height: 0.72, cap: 0.88 },
  90: { width: 0.96, height: 0.9, cap: 0.96 },
  100: { width: 1, height: 1, cap: 1 },
};

const BODY_HEIGHT = 190;
const LABEL_RISE = 68;

const OUTER_BODY = '48,94 152,94 166,108 166,270 152,284 48,284 34,270 34,108';
const FRONT_TABLE = '60,112 140,112 148,120 148,254 140,262 60,262 52,254 52,120';
const AIR_SPACE = '52,102 148,102 158,112 158,128 42,128 42,112';
const LIQUID = '42,128 158,128 158,258 148,268 52,268 42,258';

type Facet = { points: string; tone: 'white' | 'black'; opacity: number };

// The cut glass, lit from the top left.
const FACETS: readonly Facet[] = [
  { points: '48,94 152,94 140,112 60,112', tone: 'white', opacity: 0.2 },
  { points: '152,94 166,108 148,120 140,112', tone: 'white', opacity: 0.08 },
  { points: '166,108 166,270 148,254 148,120', tone: 'black', opacity: 0.18 },
  { points: '166,270 152,284 140,262 148,254', tone: 'black', opacity: 0.26 },
  { points: '152,284 48,284 60,262 140,262', tone: 'black', opacity: 0.16 },
  { points: '48,284 34,270 52,254 60,262', tone: 'white', opacity: 0.05 },
  { points: '34,270 34,108 52,120 52,254', tone: 'white', opacity: 0.08 },
  { points: '34,108 48,94 60,112 52,120', tone: 'white', opacity: 0.28 },
];

const BRASS_STOPS = [
  { offset: '0%', color: '#6f5428' },
  { offset: '16%', color: '#c7a468' },
  { offset: '32%', color: '#f0dfb7' },
  { offset: '50%', color: '#b8934f' },
  { offset: '74%', color: '#8a6a32' },
  { offset: '90%', color: '#d4b57e' },
  { offset: '100%', color: '#7a5a23' },
];

const useBottleDescription = (name: string, size: BottleSize) => {
  const { t, formatSize } = useLocale();
  return t.common.bottle(name, formatSize(size));
};

const BottleIllustration = ({ perfume, size, decorative }: BottleArtProps) => {
  const description = useBottleDescription(perfume.name, size);
  const uniqueId = useId().replace(/:/g, '');
  const gradient = (name: string) => `${uniqueId}-${name}`;
  const proportions = PROPORTIONS[size];
  const capDrop = BODY_HEIGHT * (1 - proportions.height);
  const labelDrop = LABEL_RISE * (1 - proportions.height);

  return (
    <svg
      className={styles.bottle}
      viewBox="0 0 200 300"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : description}
    >
      <defs>
        <radialGradient id={gradient('shadow')}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gradient('cast')}>
          <stop offset="0%" stopColor={perfume.accent} stopOpacity="0.75" />
          <stop offset="100%" stopColor={perfume.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gradient('sheen')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id={gradient('depth')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="35%" stopColor="#fff" stopOpacity="0" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id={gradient('roundness')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="22%" stopColor="#000" stopOpacity="0" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={gradient('sliver')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gradient('brass')} x1="0" y1="0" x2="1" y2="0">
          {BRASS_STOPS.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <clipPath id={gradient('table')}>
          <polygon points={FRONT_TABLE} />
        </clipPath>
      </defs>

      <g className={styles.shadow} style={{ transform: `scaleX(${proportions.width})` }}>
        <ellipse cx="100" cy="284" rx="84" ry="8" fill={`url(#${gradient('shadow')})`} />
        {/* Light passing through tinted glass throws a little of its colour onto the surface. */}
        <ellipse cx="116" cy="287" rx="74" ry="7" fill={`url(#${gradient('cast')})`} />
      </g>

      <g
        className={styles.body}
        style={{ transform: `scale(${proportions.width}, ${proportions.height})` }}
      >
        <polygon points={OUTER_BODY} fill={perfume.accent} fillOpacity="0.3" />
        <polygon points={OUTER_BODY} fill={`url(#${gradient('sheen')})`} />
        <polygon points={AIR_SPACE} fill={perfume.accent} fillOpacity="0.16" />

        <polygon points={LIQUID} fill={perfume.accent} />
        <polygon points={LIQUID} fill={`url(#${gradient('depth')})`} />
        <polygon points={LIQUID} fill={`url(#${gradient('roundness')})`} />
        <line x1="42" y1="128" x2="158" y2="128" stroke="#fff" strokeOpacity="0.65" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <rect x="42" y="129" width="116" height="4" fill="#000" fillOpacity="0.1" />

        {FACETS.map((facet) => (
          <polygon
            key={facet.points}
            points={facet.points}
            fill={facet.tone === 'white' ? '#fff' : '#000'}
            fillOpacity={facet.opacity}
            stroke="#fff"
            strokeOpacity="0.2"
            strokeWidth="0.75"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <g clipPath={`url(#${gradient('table')})`}>
          <polygon points="66,112 100,112 74,262 40,262" fill="#fff" fillOpacity="0.1" />
          <polygon points="106,112 114,112 88,262 80,262" fill="#fff" fillOpacity="0.07" />
        </g>

        <rect x="38" y="114" width="3" height="146" fill={`url(#${gradient('sliver')})`} />
        <rect x="160" y="124" width="1.5" height="96" fill={`url(#${gradient('sliver')})`} opacity="0.5" />
        <polygon
          points={OUTER_BODY}
          fill="none"
          stroke="#000"
          strokeOpacity="0.28"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      <g
        className={styles.label}
        style={{ transform: `translateY(${labelDrop}px) scale(${proportions.width})` }}
      >
        <rect x="68" y="196" width="64" height="40" rx="1" fill="#f7f0e3" fillOpacity="0.95" />
        <rect x="70.5" y="198.5" width="59" height="35" fill="none" stroke={perfume.accent} strokeWidth="0.6" />
        <text x="100" y="215.5" textAnchor="middle" className={styles.labelName}>
          {perfume.name}
        </text>
        <text x="100" y="226" textAnchor="middle" className={styles.labelSize}>
          {size} ml
        </text>
      </g>

      <g
        className={styles.cap}
        style={{ transform: `translateY(${capDrop}px) scale(${proportions.cap})` }}
      >
        <rect x="85" y="84" width="30" height="10" fill={perfume.accent} fillOpacity="0.55" />
        <rect x="85" y="84" width="30" height="10" fill={`url(#${gradient('sheen')})`} />
        <rect x="81" y="76" width="38" height="9" fill={`url(#${gradient('brass')})`} />
        <rect x="81" y="84" width="38" height="1" fill="#000" fillOpacity="0.35" />
        <path d="M76 20h48l4 4v52H72V24z" fill={`url(#${gradient('brass')})`} />
        <path d="M76 20h48l4 4H72z" fill="#fff" fillOpacity="0.32" />
        <rect x="72" y="24" width="10" height="52" fill="#000" fillOpacity="0.14" />
        <rect x="118" y="24" width="10" height="52" fill="#000" fillOpacity="0.2" />
        <rect x="88" y="27" width="4" height="46" fill={`url(#${gradient('sliver')})`} />
        <rect x="72" y="75" width="56" height="1" fill="#000" fillOpacity="0.35" />
      </g>
    </svg>
  );
};

export const BottleArt = ({ perfume, size, decorative, priority }: BottleArtProps) => {
  const description = useBottleDescription(perfume.name, size);

  if (!perfume.image) {
    return <BottleIllustration perfume={perfume} size={size} decorative={decorative} />;
  }

  return (
    <img
      className={styles.photo}
      src={`${import.meta.env.BASE_URL}${perfume.image.replace(/^\//, '')}`}
      alt={decorative ? '' : description}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
