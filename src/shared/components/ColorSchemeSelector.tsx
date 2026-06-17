import React from 'react';
import { Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, type ColorScheme } from '@/context';

interface SchemeOption {
  value: ColorScheme;
  label: string;
  description: string;
}

const colorSchemes: SchemeOption[] = [
  { value: 'neutral', label: 'Neutral', description: 'Classic grayscale' },
  { value: 'blue', label: 'Blue', description: 'Cool and professional' },
  { value: 'green', label: 'Green', description: 'Fresh and natural' },
  { value: 'orange', label: 'Orange', description: 'Warm and energetic' },
];

/**
 * ColorSchemeSelector dropdown for switching between OKLCH color palettes.
 */
export const ColorSchemeSelector: React.FC = () => {
  const { colorScheme, setColorScheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Select color scheme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colorSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setColorScheme(scheme.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="font-medium text-xs">{scheme.label}</span>
              <span className="text-[10px] text-muted-foreground">
                {scheme.description}
              </span>
            </div>
            {colorScheme === scheme.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorSchemeSelector;
