"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { fetchTodos } from "@/lib/auth";

export default function DashboardPage() {
  const auth = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    extreme: 0,
    moderate: 0,
    low: 0,
  });

  useEffect(() => {
    if (auth?.token) {
      fetchTodos()
        .then((todos) => {
          const todosArray = Array.isArray(todos) ? todos : (todos.results || []);
          setStats({
            total: todosArray.length,
            completed: todosArray.filter((t: any) => t.is_completed).length,
            pending: todosArray.filter((t: any) => !t.is_completed).length,
            extreme: todosArray.filter((t: any) => t.priority === "extreme").length,
            moderate: todosArray.filter((t: any) => t.priority === "moderate").length,
            low: todosArray.filter((t: any) => t.priority === "low").length,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch todos:", err);
        });
    }
  }, [auth?.token]);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-lg border-2 border-orange-400 p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#274AFF] mb-4 md:mb-6 lg:mb-8 pb-3 md:pb-4 border-b-2 border-[#274AFF]">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Total Todos */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs md:text-sm font-medium">Total Todos</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Todos */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs md:text-sm font-medium">Completed</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Todos */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs md:text-sm font-medium">Pending</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Extreme Priority */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs md:text-sm font-medium">Extreme Priority</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stats.extreme}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Moderate Priority */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs md:text-sm font-medium">Moderate Priority</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stats.moderate}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Low Priority */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs md:text-sm font-medium">Low Priority</p>
                <p className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{stats.low}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

