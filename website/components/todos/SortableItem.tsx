"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

type Todo = {
  id: string | number;
  title: string;
  description?: string;
  priority?: "extreme" | "moderate" | "low";
  is_completed?: boolean;
  position?: number;
  todo_date?: string;
  created_at?: string;
  updated_at?: string;
};

export default function SortableItem({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  todo: Todo;
  onEdit: (t: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (t: Todo) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = {
    extreme: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      label: "Extreme",
    },
    moderate: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      label: "Moderate",
    },
    low: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      label: "Low",
    },
  };

  const priority = todo.priority || "moderate";
  const config = priorityConfig[priority];

  const formatDate = (dateString?: string) => {
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
    return `Due ${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all relative h-full flex flex-col cursor-grab active:cursor-grabbing"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
        style={{ touchAction: "none" }}
      />

      <div className="absolute top-7 right-3 text-gray-400 pointer-events-none z-20">
        <Image
          src="/images/dashboard/Frame.png"
          alt=""
          width={10}
          height={10}
        />
      </div>

      <div className="flex flex-col h-full relative z-10">
        <div className="flex-1 min-h-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[16px] font-semibold text-black mb-2 pr-8">
                {todo.title}
              </h3>
            </div>
            <div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-sm border ${config.bg} ${config.border} ${config.text} flex items-center gap-1 w-fit mr-2`}
              >
                {config.label}
              </span>
            </div>
          </div>

          <p className="text-[14px] text-gray-600 mb-4 mt-4 line-clamp-3">
            {todo.description || ""}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 ">
          <div className="flex flex-col gap-2 flex-1">
            {todo.todo_date && (
              <span className="text-[14px] font-normal text-gray-500">
                {formatDate(todo.todo_date)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 relative z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(todo);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              className="p-2 rounded transition relative z-30"
              title="Edit"
            >
              <div className="bg-secondary p-2 rounded-md">
                <Image
                  src="/images/dashboard/icon-edit.png"
                  alt=""
                  width={15}
                  height={14}
                />
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(String(todo.id));
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              className="p-2  rounded transition relative z-30"
              title="Delete"
            >
              <div className="bg-secondary p-2 rounded-md">
                <Image
                  src="/images/dashboard/Combined-Shape-edit.png"
                  alt=""
                  width={15}
                  height={14}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
