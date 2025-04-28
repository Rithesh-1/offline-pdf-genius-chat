
import React from "react";
import { Button } from "@/components/ui/button";
import { palette } from "lucide-react";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const themes = ["light", "dark", "system"];

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border">
      <palette size={16} className="text-gray-500" />
      <div className="flex gap-1">
        {themes.map((theme) => (
          <Button
            key={theme}
            variant={currentTheme === theme ? "default" : "outline"}
            size="sm"
            onClick={() => onThemeChange(theme)}
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
