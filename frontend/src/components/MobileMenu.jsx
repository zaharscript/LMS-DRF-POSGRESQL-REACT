export default function MobileMenu({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Menu */}
      <aside
        className={`
            fixed top-0 right-0 h-full w-72 bg-white z-50
            transform transition-transform duration-300
            md:hidden
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
      >
        <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <div className="font-semibold text-lg">Zahar Mokhtar</div>
          <div className="text-sm opacity-90">Premium Student</div>
        </div>

        {[
          "Home",
          "My Courses",
          "Progress",
          "Goals",
          "Schedule",
          "Achievements",
          "Settings",
        ].map((item) => (
          <div
            key={item}
            className="px-6 py-4 border-b text-gray-700 active:bg-gray-100"
          >
            {item}
          </div>
        ))}
      </aside>
    </>
  );
}
