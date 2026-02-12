import { useEffect, useState } from "react";

const ReadingProgress = () => {
  const [width, setWidth] = useState    (0);
  
  useEffect(() => {
    const updateProgress = () => {
      const element = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setWidth(progress);
    };
    
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  
  return <div className="reading-progress-bar" style={{ width: `${width}%` }} />;
};

export default ReadingProgress;