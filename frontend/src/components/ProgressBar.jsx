export default function ProgressBar({ completed, total }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 bg-blue-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {completed} / {total} completed ({percent}%)
      </p>
    </div>
  );
}
