'use client';

import {
  createContext,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible');
  }
  return context;
}

interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Collapsible({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  className = '',
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? uncontrolledOpen;

  const toggle = () => {
    const newValue = !isOpen;
    setUncontrolledOpen(newValue);
    onOpenChange?.(newValue);
  };

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle }}>
      <div className={className} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

interface CollapsibleTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function CollapsibleTrigger({
  children,
  className = '',
  onClick,
  ...props
}: CollapsibleTriggerProps) {
  const { isOpen, toggle } = useCollapsible();

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CollapsibleContent({
  children,
  className = '',
  ...props
}: CollapsibleContentProps) {
  const { isOpen } = useCollapsible();

  if (!isOpen) return null;

  return (
    <div
      className={`animate-in fade-in-0 slide-in-from-top-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
