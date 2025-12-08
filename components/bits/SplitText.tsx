import { useRef, useEffect, useState, useMemo, useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type SplitType = 'chars' | 'words' | 'lines' | 'chars,words' | 'chars,lines' | 'words,lines' | 'chars,words,lines';
type HtmlTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface AnimationProps {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotation?: number;
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitType;
  from?: AnimationProps;
  to?: AnimationProps;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties['textAlign'];
  tag?: HtmlTag;
  onLetterAnimationComplete?: () => void;
}

declare global {
  interface HTMLElement {
    _rbsplitInstance?: GSAPSplitText;
  }
}

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);

  const getInitialFontsLoaded = useCallback(() => {
    if (typeof document === 'undefined') return false;
    return document.fonts.status === 'loaded';
  }, []);

  const [fontsLoaded, setFontsLoaded] = useState(getInitialFontsLoaded);

  useEffect(() => {
    if (fontsLoaded) return;

    const checkFonts = () => {
      if (document.fonts.status === 'loaded') {
        setFontsLoaded(true);
      }
    };

    document.fonts.ready.then(checkFonts);
  }, [fontsLoaded]);

  const fromString = useMemo(() => JSON.stringify(from), [from]);
  const toString = useMemo(() => JSON.stringify(to), [to]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (error) {
          console.error(error);
        }
        el._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: Element[] = [];
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes('chars') && self.chars.length) {
          targets = self.chars;
        } else if (splitType.includes('words') && self.words.length) {
          targets = self.words;
        } else if (splitType.includes('lines') && self.lines.length) {
          targets = self.lines;
        } else {
          targets = self.chars.length ? self.chars : self.words.length ? self.words : self.lines;
        }
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false
      });

      assignTargets(splitInstance);

      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onLetterAnimationComplete?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      el._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (error) {
          console.error(error);
        }
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        fromString,
        toString,
        threshold,
        rootMargin,
        fontsLoaded,
        onLetterAnimationComplete
      ],
      scope: ref
    }
  );

  const style: CSSProperties = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };

  const classes = `split-parent ${className}`;
  const commonProps = { ref, style, className: classes };

  switch (tag) {
    case 'h1':
      return <h1 {...commonProps} ref={ref as React.RefObject<HTMLHeadingElement>}>{text}</h1>;
    case 'h2':
      return <h2 {...commonProps} ref={ref as React.RefObject<HTMLHeadingElement>}>{text}</h2>;
    case 'h3':
      return <h3 {...commonProps} ref={ref as React.RefObject<HTMLHeadingElement>}>{text}</h3>;
    case 'h4':
      return <h4 {...commonProps} ref={ref as React.RefObject<HTMLHeadingElement>}>{text}</h4>;
    case 'h5':
      return <h5 {...commonProps} ref={ref as React.RefObject<HTMLHeadingElement>}>{text}</h5>;
    case 'h6':
      return <h6 {...commonProps} ref={ref as React.RefObject<HTMLHeadingElement>}>{text}</h6>;
    default:
      return <p {...commonProps} ref={ref as React.RefObject<HTMLParagraphElement>}>{text}</p>;
  }
};

export default SplitText;
