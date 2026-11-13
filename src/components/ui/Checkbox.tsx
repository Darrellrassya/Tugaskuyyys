import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface AppCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  size?: number;
  label?: string;
}

export const Checkbox: React.FC<AppCheckboxProps> = ({
  checked,
  onCheckedChange,
  id,
  className,
  size = 28,
  label,
}) => {
  return (
    <div className="flex items-center gap-3">
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(val) => onCheckedChange(val === true)}
        className={cn(
          'relative flex items-center justify-center border-2 transition-colors cursor-pointer rounded-[2px] focus-visible:outline-3 focus-visible:outline-map-kuning focus-visible:outline-offset-2',
          checked
            ? 'bg-map-hijau border-map-hijau text-white'
            : 'border-arsip/60 hover:border-arsip bg-white/40',
          className
        )}
        style={{ width: size, height: size }}
        aria-label={label || 'Tandai status'}
      >
        <AnimatePresence>
          {checked && (
            <CheckboxPrimitive.Indicator asChild forceMount>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.div>
            </CheckboxPrimitive.Indicator>
          )}
        </AnimatePresence>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-serif select-none cursor-pointer transition-all',
            checked ? 'line-through opacity-50' : 'text-arsip'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};
