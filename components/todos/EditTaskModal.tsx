"use client";

import Image from "next/image";
import { useRef } from "react";

type Priority = "extreme" | "moderate" | "low";

type FormData = {
  title: string;
  description: string;
  priority: Priority;
  todo_date: string;
};

export default function EditTaskModal({
  isOpen,
  formData,
  onClose,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  formData: FormData;
  onClose: () => void;
  onChange: (data: Partial<FormData>) => void;
  onSubmit: () => void;
}) {
  const editDateInputRef = useRef<HTMLInputElement>(null);
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            {" "}
            <h3 className="text-2xl font-semibold text-gray-900">Edit Task</h3>
            <div className="border-b-2 border-[#5272FF] w-[50px] mb-6"></div>
          </div>
          <div className="border-b-2 border-[#5272FF] w-[100px] absolute top-12 left-8"></div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Go Back
            <div className="border-b-1 border-black w-[55px] mb-6"></div>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              value={formData.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 "
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <input
                ref={editDateInputRef}
                type="text"
                value={
                  formData.todo_date
                    ? formatDateForDisplay(formData.todo_date)
                    : ""
                }
                readOnly
                onClick={() => hiddenDateInputRef.current?.showPicker()}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 cursor-pointer"
                placeholder="Select date"
              />
              <button
                type="button"
                onClick={() => hiddenDateInputRef.current?.showPicker()}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 z-10"
              >
                <Image
                  src="/images/dashboard/datecal.png"
                  alt=""
                  width={20}
                  height={20}
                />
              </button>
              <input
                ref={hiddenDateInputRef}
                type="date"
                value={formData.todo_date}
                onChange={(e) => onChange({ todo_date: e.target.value })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority
            </label>
            <div className="flex space-x-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-700">Extreme</span>
                </div>
                <div className="relative">
                  <input
                    type="radio"
                    name="edit-priority"
                    value="extreme"
                    checked={formData.priority === "extreme"}
                    onChange={(e) =>
                      onChange({ priority: e.target.value as Priority })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      formData.priority === "extreme"
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {formData.priority === "extreme" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Moderate</span>
                </div>
                <div className="relative">
                  <input
                    type="radio"
                    name="edit-priority"
                    value="moderate"
                    checked={formData.priority === "moderate"}
                    onChange={(e) =>
                      onChange({ priority: e.target.value as Priority })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      formData.priority === "moderate"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {formData.priority === "moderate" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700">Low</span>
                </div>
                <div className="relative">
                  <input
                    type="radio"
                    name="edit-priority"
                    value="low"
                    checked={formData.priority === "low"}
                    onChange={(e) =>
                      onChange({ priority: e.target.value as Priority })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      formData.priority === "low"
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {formData.priority === "low" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start writing here......"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-[#5272FF] text-white font-semibold rounded-lg hover:bg-[#4262EF] transition"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
