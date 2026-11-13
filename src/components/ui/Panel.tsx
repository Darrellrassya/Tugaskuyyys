import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface PanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Panel: React.FC<PanelProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px]"
              />
            </DialogPrimitive.Overlay>

            {/* Modal Dialog Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={cn(
                    'relative w-full bg-kertas text-arsip p-6 sm:p-8 rounded-[3px] shadow-2xl border-2 border-black/10 my-8 max-h-[90vh] overflow-y-auto',
                    maxWidth
                  )}
                >
                  {/* Close circular button */}
                  <DialogPrimitive.Close asChild>
                    <button
                      className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/15 flex items-center justify-center text-arsip transition-colors cursor-pointer border border-black/10 focus-visible:outline-2 focus-visible:outline-map-kuning"
                      aria-label="Tutup panel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </DialogPrimitive.Close>

                  {title && (
                    <DialogPrimitive.Title className="font-display text-3xl sm:text-4xl tracking-tight text-arsip uppercase mb-1 pr-8">
                      {title}
                    </DialogPrimitive.Title>
                  )}

                  {description && (
                    <DialogPrimitive.Description className="font-serif text-base text-black/70 mb-6 italic">
                      {description}
                    </DialogPrimitive.Description>
                  )}

                  <div className="mt-4">{children}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
