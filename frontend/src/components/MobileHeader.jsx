export default function MobileHeader({ onMenuToggle }) {
  return (
    <header className="md:hidden sticky top-0 z-50 bg-white shadow-sm flex items-center justify-between px-4 py-3">
      <div className="text-xl font-bold">
        Study<span className="text-indigo-600">Plan</span>
      </div>

      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg bg-gray-100 active:scale-95 transition"
      >
        ☰
      </button>
    </header>
  );
}
