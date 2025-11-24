import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { BookOpen, User, Calendar, X } from "lucide-react";
import { useState } from "react";

export default function NewCourseModal({ isOpen, onClose, onCreate }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    instructor: "",
    provider: "",
    date_joined: today,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.instructor.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    onCreate(form);

    setForm({
      title: "",
      instructor: "",
      date_joined: today,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel className="bg-white max-w-2xl w-full rounded-xl shadow-xl">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpen className="w-7 h-7" />
              <h2 className="text-2xl font-bold">Register New Course</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="font-semibold text-gray-700">
                Course Title *
              </label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg mt-1"
                placeholder="e.g., Introduction to AI"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Provider */}
            <div>
              <label className="font-semibold text-gray-700">Provider</label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg mt-1"
                placeholder="e.g., Udemy, Coursera, W3Schools"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
              />
            </div>

            {/* Instructor */}
            <div>
              <label className="font-semibold text-gray-700">
                Instructor *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full border p-3 pl-11 rounded-lg"
                  placeholder="John Doe"
                  required
                  value={form.instructor}
                  onChange={(e) =>
                    setForm({ ...form, instructor: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Date Joined */}
            <div>
              <label className="font-semibold text-gray-700">
                Date Joined *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  className="w-full border p-3 pl-11 rounded-lg"
                  required
                  value={form.date_joined}
                  onChange={(e) =>
                    setForm({ ...form, date_joined: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> After creating the course, you can add
                sections and topics.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Register Course
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
