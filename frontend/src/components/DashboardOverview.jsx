import { useMemo } from "react";
import { Flame, BookOpen, CheckCircle, Clock, Target } from "lucide-react";

/* Simple quotes pool */
const QUOTES = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
  },
  {
    text: "Small progress is still progress.",
    author: "Unknown",
  },
];

export default function DashboardOverview({ courses = [], user }) {
  /* Pick random quote once */
  const quote = useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    []
  );

  /* Compute stats */
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    let completed = 0;
    let inProgress = 0;
    let totalTopics = 0;
    let completedTopics = 0;

    courses.forEach((c) => {
      const topics = c.sections?.flatMap((s) => s.topics || []) || [];

      totalTopics += topics.length;
      completedTopics += topics.filter((t) => t.completed).length;

      if (topics.length && topics.every((t) => t.completed)) completed++;
      else if (topics.length) inProgress++;
    });

    const avgProgress = totalTopics
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0;

    return {
      totalCourses,
      completed,
      inProgress,
      totalHours: totalTopics * 0.5, // estimate (30 min per topic)
      avgProgress,
    };
  }, [courses]);

  return (
    <div className="space-y-6 mb-8">
      {/* USER SUMMARY */}
      <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {user?.name?.[0] || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user?.name || "Welcome back!"}
            </h2>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <Flame size={16} /> {user?.streak || 0} day streak
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <div className="text-xs opacity-80">Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <div className="text-xs opacity-80">Avg Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <div className="text-xs opacity-80">Hours</div>
          </div>
        </div>
      </div>

      {/* QUOTE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
        <p className="italic text-gray-700 dark:text-gray-200">
          “{quote.text}”
        </p>
        <p className="mt-2 text-sm text-gray-500">— {quote.author}</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle className="text-green-500" />}
          label="Completed"
          value={stats.completed}
        />
        <StatCard
          icon={<BookOpen className="text-blue-500" />}
          label="In Progress"
          value={stats.inProgress}
        />
        <StatCard
          icon={<Clock className="text-purple-500" />}
          label="This Week"
          value={`${stats.totalHours}h`}
        />
        <StatCard
          icon={<Target className="text-pink-500" />}
          label="Goal"
          value={`${stats.avgProgress}%`}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
