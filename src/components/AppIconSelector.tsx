
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
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      setCurrentIcon(randomIcon);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [icon, animate]);
  
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  };
  
  return (
    <div className={`${sizeClasses[size]} ${animate ? 'animate-pulse' : ''} transition-all duration-300`}>
      {currentIcon}
    </div>
  );
};

export default AppIconSelector;
