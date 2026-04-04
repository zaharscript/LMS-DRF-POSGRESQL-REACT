import { useState } from "react";
import { X, ClipboardList, Loader2 } from "lucide-react";

export default function PasteSyllabusModal({ isOpen, onClose, onImport }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await onImport(text);
            setText("");
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ClipboardList className="text-indigo-600" size={24} />
                        Paste Syllabus
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Copy the curriculum from Udemy, Coursera, or any other platform and paste it here.
                        We'll try our best to group them into sections and topics.
                    </p>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g.&#10;Section 1: Introduction&#10;Lecture 1: Welcome&#10;Lecture 2: Tools&#10;Section 2: Setup..."
                        className="w-full h-64 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-900 dark:border-gray-700"
                        required
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Importing...
                                </>
                            ) : (
                                "Import Syllabus"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
