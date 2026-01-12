'use client';

import { Fragment, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Modal Content */}
        <div
          className={cn(
            'bg-white rounded-2xl w-full max-h-[85vh] overflow-hidden flex flex-col',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="모달 닫기"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Modal };
