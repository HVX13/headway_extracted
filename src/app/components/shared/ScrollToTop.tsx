import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll to the top on route change. Hash links (e.g. /learn#faq) are
// left alone so in-page anchors still work.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
