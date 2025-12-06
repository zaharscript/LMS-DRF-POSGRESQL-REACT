// src/components/NewSectionModal.jsx
import { useState } from "react";

export default function NewSectionModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const submit = () => {
    if (!title.trim()) return alert("Title required");
    onCreate(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">
        <h2 className="text-lg font-bold mb-3">New Section</h2>
        <input className="w-full border p-2 rounded mb-4" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Section title" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button onClick={submit} className="px-4 py-1 bg-blue-600 text-white rounded">Create</button>
        </div>
      </div>
    </div>
  );
}
