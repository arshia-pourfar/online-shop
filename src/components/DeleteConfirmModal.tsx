"use client";

export default function DeleteConfirmModal({
    show,
    onCancel,
    onConfirm,
}: {
    show: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-primary-bg rounded-xl p-6 max-w-sm w-full shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-red-500">
                    Confirm Delete
                </h3>
                <p className="mb-6 text-primary-text">
                    Are you sure you want to delete this product?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-primary-text"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}