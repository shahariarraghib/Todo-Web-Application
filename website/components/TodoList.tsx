// components/TodoList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
} from "../lib/auth"; // or lib/apiClient functions

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

function SortableItem({ todo, onEdit, onDelete, onToggleComplete }: { todo: Todo; onEdit: (t: Todo) => void; onDelete: (id: string) => void; onToggleComplete: (t: Todo) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    extreme: "bg-red-100 text-red-800 border-red-300",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3 flex justify-between items-start hover:shadow-md transition-all ${todo.is_completed ? "opacity-60 bg-gray-50" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <div {...attributes} {...listeners} className="cursor-grab">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onToggleComplete(todo)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                todo.is_completed 
                  ? "bg-green-500 border-green-500" 
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              {todo.is_completed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className={`text-lg font-semibold text-gray-800 ${todo.is_completed ? "line-through text-gray-400" : ""}`}>
              {todo.title}
            </div>
          {todo.priority && (
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${priorityColors[todo.priority] || priorityColors.moderate}`}>
              {todo.priority.toUpperCase()}
            </span>
          )}
          {todo.is_completed && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300 font-medium">
              ✓ Completed
            </span>
          )}
          </div>
          {todo.description && (
            <div className="text-sm text-gray-600 mt-2 ml-8">{todo.description}</div>
          )}
          {todo.todo_date && (
            <div className="text-xs text-gray-500 mt-2 ml-8 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(todo.todo_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 ml-4 flex-shrink-0">
        <button
          onClick={() => onEdit(todo)}
          className="px-3 py-2 text-sm border border-blue-300 rounded-lg hover:bg-blue-50 text-blue-700 font-medium transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(String(todo.id))}
          className="px-3 py-2 text-sm border border-red-300 rounded-lg hover:bg-red-50 text-red-700 font-medium transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TodoList() {
  const auth = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", priority: "moderate" as const, todo_date: "" });
  const sensors = useSensors(useSensor(PointerSensor));

  // Check authentication on mount
  useEffect(() => {
    if (!auth?.user || !auth?.token) {
      router.push("/login");
      return;
    }
  }, [auth, router]);

  useEffect(() => {
    // Only fetch todos if user is authenticated
    if (!auth?.user || !auth?.token) return;
    
    fetchTodos().then((res) => {
      // API returns array directly or in results
      const todosArray = Array.isArray(res) ? res : (res.results || []);
      // Sort by position if available
      const sortedTodos = todosArray.sort((a: Todo, b: Todo) => 
        (a.position || 0) - (b.position || 0)
      );
      setTodos(sortedTodos);
    }).catch((err) => {
      console.error("Failed to fetch todos:", err);
      setTodos([]);
    }).finally(()=>setLoading(false));
  }, [auth?.user, auth?.token]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
      // Update position for each todo
      try {
        await reorderTodos(newTodos.map((todo, index) => ({
          id: todo.id,
          position: index + 1
        })));
      } catch (err) {
        console.error("Reorder failed, you might want to refetch or rollback.", err);
        // Refetch on error
        fetchTodos().then((res) => {
          const todosArray = Array.isArray(res) ? res : (res.results || []);
          const sortedTodos = todosArray.sort((a: Todo, b: Todo) => 
            (a.position || 0) - (b.position || 0)
          );
          setTodos(sortedTodos);
        });
      }
    }
  };

  const handleCreate = async (title: string) => {
    const res = await createTodo({ title });
    setTodos((p) => [res, ...p]);
  };

  const handleUpdate = async (id: string, payload: Partial<Todo>) => {
    const res = await updateTodo(id, payload);
    setTodos((p) => p.map(t => t.id === id ? res : t));
    setEditingTodo(null);
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: todo.title || "",
      description: todo.description || "",
      priority: todo.priority || "moderate",
      todo_date: todo.todo_date ? new Date(todo.todo_date).toISOString().split('T')[0] : "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTodo || !editForm.title.trim()) return;
    await handleUpdate(String(editingTodo.id), {
      title: editForm.title.trim(),
      description: editForm.description.trim() || undefined,
      priority: editForm.priority,
      todo_date: editForm.todo_date || undefined,
    });
  };

  const handleToggleComplete = async (todo: Todo) => {
    await handleUpdate(String(todo.id), { is_completed: !todo.is_completed });
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setTodos((p) => p.filter(t => t.id !== id));
  };

  // Show loading or redirect message if not authenticated
  if (!auth?.user || !auth?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Please login to access your todos</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#274AFF] mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <CreateTodo onCreate={handleCreate} />
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No todos yet</p>
          <p className="text-gray-500 text-sm mt-2">Create your first todo above to get started!</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {todos.map(todo => (
              <SortableItem 
                key={todo.id} 
                todo={todo} 
                onEdit={handleEditClick} 
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#274AFF]">Edit Todo</h2>
              <button
                onClick={() => setEditingTodo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#274AFF] focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter todo title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#274AFF] focus:ring-2 focus:ring-blue-100 resize-none"
                  rows={4}
                  placeholder="Enter todo description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as "extreme" | "moderate" | "low" })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#274AFF] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editForm.todo_date}
                    onChange={(e) => setEditForm({ ...editForm, todo_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#274AFF] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-6 py-3 bg-[#274AFF] text-white font-semibold rounded-lg hover:bg-[#1E3A8A] transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingTodo(null)}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// small create component
function CreateTodo({ onCreate }: { onCreate: (title: string) => void }) {
  const [title, setTitle] = useState("");
  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        if (!title.trim()) return; 
        onCreate(title.trim()); 
        setTitle(""); 
      }} 
      className="flex gap-3"
    >
      <input 
        value={title} 
        onChange={(e)=>setTitle(e.target.value)} 
        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#274AFF] focus:ring-2 focus:ring-blue-100 text-gray-800 placeholder-gray-400" 
        placeholder="Add a new todo..." 
      />
      <button 
        type="submit" 
        className="px-6 py-3 rounded-lg bg-[#274AFF] text-white font-semibold hover:bg-[#1E3A8A] transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Todo
      </button>
    </form>
  );
}
