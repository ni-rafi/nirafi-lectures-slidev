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

const radiusOptions = [
  { value: 2, label: 'Sharp', description: '2px rounding' },
  { value: 4, label: 'Subtle', description: '4px rounding' },
  { value: 8, label: 'Rounded', description: '8px rounding' },
  { value: 12, label: 'Large', description: '12px rounding' },
];

/**
 * ColorSchemeSelector dropdown for switching between OKLCH color palettes and border-radius settings.
 */
export const ColorSchemeSelector: React.FC = () => {
  const { colorScheme, setColorScheme, borderRadius, setBorderRadius } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" title="Custom Settings">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Custom Settings</span>
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
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Corner Radius</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {radiusOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setBorderRadius(opt.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="font-medium text-xs">{opt.label}</span>
              <span className="text-[10px] text-muted-foreground">
                {opt.description}
              </span>
            </div>
            {borderRadius === opt.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorSchemeSelector;
