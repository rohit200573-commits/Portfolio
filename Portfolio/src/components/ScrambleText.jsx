import { useState, useEffect } from 'react';

const CHARACTERS = '!<>-_\\\\/[]{}—=+*^?#_';

const ScrambleText = ({ text, duration = 1500, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    let timeout;
    let scrambleInterval;
    let frame = 0;
    
    // Calculate total frames based on 30fps
    const totalFrames = Math.floor((duration / 1000) * 30);
    const textLength = text.length;

    const startScramble = () => {
      setIsScrambling(true);
      
      scrambleInterval = setInterval(() => {
        let output = '';
        const progress = frame / totalFrames;
        
        for (let i = 0; i < textLength; i++) {
          // If we've passed this character's reveal point, show the actual character
          if (progress > (i / textLength) * 0.8) {
            output += text[i];
          } else {
            // Otherwise show a random character
            output += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }
        }
        
        setDisplayText(output);
        
        if (frame >= totalFrames) {
          clearInterval(scrambleInterval);
          setDisplayText(text);
          setIsScrambling(false);
        }
        
        frame++;
      }, 1000 / 30); // 30 fps
    };

    timeout = setTimeout(startScramble, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(scrambleInterval);
    };
  }, [text, duration, delay]);

  const handleMouseEnter = () => {
    if (!isScrambling) {
      let frame = 0;
      const hoverDuration = 600; // faster on hover
      const totalFrames = Math.floor((hoverDuration / 1000) * 30);
      const textLength = text.length;
      
      setIsScrambling(true);
      
      const hoverInterval = setInterval(() => {
        let output = '';
        const progress = frame / totalFrames;
        
        for (let i = 0; i < textLength; i++) {
          if (progress > (i / textLength) * 0.8) {
            output += text[i];
          } else {
            output += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }
        }
        
        setDisplayText(output);
        
        if (frame >= totalFrames) {
          clearInterval(hoverInterval);
          setDisplayText(text);
          setIsScrambling(false);
        }
        
        frame++;
      }, 1000 / 30);
    }
  };

  return (
    <span 
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText || text}
    </span>
  );
};

export default ScrambleText;
