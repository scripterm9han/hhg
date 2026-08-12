import { useEffect } from 'react';
import { BuilderStudio } from '@/components/BuilderStudio';
import { preloadFrameFonts } from '@/lib/canvasGenerator';

export default function App() {
  useEffect(() => {
    void preloadFrameFonts();
  }, []);

  return <BuilderStudio />;
}
