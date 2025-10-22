'use client';

import * as React from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Contrast,
  Zap,
  ZapOff,
  Palette,
  Check,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useEnhancedTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const {
    toggleHighContrast,
    toggleReducedMotion,
    isHighContrast,
    isReducedMotion,
  } = useEnhancedTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme Mode Selection (force light) */}
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          Light
          {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Accessibility Options */}
        <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={isHighContrast}
          onCheckedChange={toggleHighContrast}
          className="flex items-center gap-2"
        >
          <Contrast className="h-4 w-4" />
          High Contrast
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isReducedMotion}
          onCheckedChange={toggleReducedMotion}
          className="flex items-center gap-2"
        >
          {isReducedMotion ? (
            <ZapOff className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          Reduce Motion
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
