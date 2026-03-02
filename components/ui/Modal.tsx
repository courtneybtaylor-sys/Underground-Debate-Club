import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: string }[];
}

export function Modal({ isOpen, title, children, onClose, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-foreground hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 text-foreground">{children}</div>
        {actions && (
          <div className="flex gap-2 border-t border-border p-4">
            {actions.map((action) => (
              <Button
                key={action.label}
                onClick={action.onClick}
                variant={action.variant === "secondary" ? "secondary" : "primary"}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
