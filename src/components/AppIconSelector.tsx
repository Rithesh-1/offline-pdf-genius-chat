
import React, { useEffect, useState } from "react";

interface AppIconSelectorProps {
  icon: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const AppIconSelector: React.FC<AppIconSelectorProps> = ({ 
  icon, 
  animate = true,
  size = "md" 
}) => {
  const [currentIcon, setCurrentIcon] = useState(icon);
  const [nextIcon, setNextIcon] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const icons = ["📊", "🤖", "📚", "🧠", "📈", "🔍", "💡", "🔮"];
  
  useEffect(() => {
    if (icon !== "random") {
      setCurrentIcon(icon);
      return;
    }
    
    // Select random icon on load if "random" is selected
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    setCurrentIcon(randomIcon);
    
    // Set up animation if enabled
    if (!animate) return;
    
    const intervalId = setInterval(() => {
      // Choose a different random icon than current
      let randomIcon;
      do {
        randomIcon = icons[Math.floor(Math.random() * icons.length)];
      } while (randomIcon === currentIcon);
      
      setNextIcon(randomIcon);
      setIsTransitioning(true);
      
      // After transition out completes, switch icons
      setTimeout(() => {
        setCurrentIcon(randomIcon);
        setIsTransitioning(false);
      }, 1000);
    }, 8000); // Changed from 5000ms to 8000ms for more soothing pace
    
    return () => clearInterval(intervalId);
  }, [icon, animate, currentIcon]);
  
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  };
  
  return (
    <div className="relative">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${animate ? 'animate-icon-float' : ''}
          transition-all duration-1000
          ${isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100'}
        `}
      >
        {currentIcon}
      </div>
      {isTransitioning && (
        <div 
          className={`
            ${sizeClasses[size]} 
            absolute top-0 left-0
            transition-all duration-1000
            opacity-100 transform -translate-y-2
          `}
        >
          {nextIcon}
        </div>
      )}
    </div>
  );
};

export default AppIconSelector;
