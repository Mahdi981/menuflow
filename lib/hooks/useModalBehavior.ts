'use client';

import { useEffect, useRef } from 'react';

// الـ modals المفتوحة حالياً بالترتيب (ممكن drawer + checkout فوق بعض)
const stack: symbol[] = [];

/**
 * سلوك موحّد للـ modals / drawers:
 * - Escape بيسكّر الـ modal اللي فوق بس
 * - منع scroll الصفحة خلف الـ modal
 */
export function useModalBehavior(open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const id = Symbol('modal');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack[stack.length - 1] === id) {
        onCloseRef.current();
      }
    };

    stack.push(id);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(id), 1);
      if (stack.length === 0) document.body.style.overflow = '';
    };
  }, [open]);
}
