import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    aria-label="Close modal"
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
                    onClick={onClose}
                >
                    ×
                </button>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">{title}</h3>
                {children}
            </div>
        </div>
    );
};

export default Modal;