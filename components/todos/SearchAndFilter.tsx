"use client";

import Image from "next/image";

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  filterOpen,
  onFilterToggle,
  dateFilter,
  onDateFilterToggle,
  onNewTask,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterOpen: boolean;
  onFilterToggle: () => void;
  dateFilter: string[];
  onDateFilterToggle: (filter: string) => void;
  onNewTask: () => void;
}) {
  const toggleDateFilter = (filter: string) => {
    onDateFilterToggle(filter);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 placeholder-gray-400 "
          placeholder="Search your task here..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image
            src="/images/dashboard/SearchICon.png"
            alt=""
            width={50}
            height={50}
          />
        </div>
      </div>

      <div className="relative">
        <button
          onClick={onFilterToggle}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
        >
          <span>Sort by</span>
          <Image
            src="/images/dashboard/Group.png"
            alt=""
            width={10}
            height={10}
            className="mt-1"
          />
        </button>

        {filterOpen && (
          <>
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Date Filter
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dateFilter.includes("today")}
                    onChange={() => toggleDateFilter("today")}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Deadline Today</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dateFilter.includes("5days")}
                    onChange={() => toggleDateFilter("5days")}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Expires in 5 days
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dateFilter.includes("10days")}
                    onChange={() => toggleDateFilter("10days")}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Expires in 10 days
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dateFilter.includes("30days")}
                    onChange={() => toggleDateFilter("30days")}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Expires in 30 days
                  </span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={onNewTask}
        className="bg-[#5272FF] text-white px-6 py-3 rounded-lg shadow-md  font-medium"
      >
        <div className="flex">
          {" "}
          <div className="mt-1">
            <Image
              src="/images/dashboard/add.png"
              alt=""
              width={15}
              height={15}
            />
          </div>
          <div>
            <p className="pl-2"> New Task</p>
          </div>
        </div>
      </button>
    </div>
  );
}
