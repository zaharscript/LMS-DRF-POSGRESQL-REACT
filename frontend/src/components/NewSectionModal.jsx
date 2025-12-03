export default function NewSectionModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  const submit = () => {
    if (!title.trim()) return alert("Title required");
    onCreate(title);
    setTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">New Section</h2>

        <input
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 px-3 py-1">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
