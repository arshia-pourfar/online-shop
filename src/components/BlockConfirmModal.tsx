// components/BlockConfirmModal.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface BlockConfirmModalProps {
    show: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function BlockConfirmModal({ show, message, onConfirm, onCancel }: BlockConfirmModalProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans">
            <div className="bg-secondary-bg p-8 rounded-lg shadow-xl max-w-lg w-full m-4 border-2 border-accent">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex-shrink-0 bg-accent rounded-full flex items-center justify-center text-white">
                        <FontAwesomeIcon icon={faBan} className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-text">Block Reports</h2>
                </div>
                <p className="text-secondary-text mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-md border border-secondary-text/30 text-secondary-text hover:bg-primary-bg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-md bg-accent text-white hover:bg-accent/90 transition"
                    >
                        Block
                    </button>
                </div>
            </div>
        </div>
    );
}