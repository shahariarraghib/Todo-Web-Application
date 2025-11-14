"use client";

import TodoList from "@/components/TodoList";
import DashboardLayout from "@/components/DashboardLayout";

export default function TodosPage() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-lg border-2 border-orange-400 p-8">
        <h1 className="text-3xl font-bold text-[#274AFF] mb-8 pb-4 border-b-2 border-[#274AFF]">
          Todos
        </h1>
        <TodoList />
      </div>
    </DashboardLayout>
  );
}

