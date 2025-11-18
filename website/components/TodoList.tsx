"use client";

import { useEffect, useState, useMemo } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
} from "../lib/auth";
import SortableItem from "./todos/SortableItem";
import AddTaskModal from "./todos/AddTaskModal";
import EditTaskModal from "./todos/EditTaskModal";
import SearchAndFilter from "./todos/SearchAndFilter";
import EmptyState from "./todos/EmptyState";

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

type Priority = "extreme" | "moderate" | "low";

type FormData = {
  title: string;
  description: string;
  priority: Priority;
  todo_date: string;
};

export default function TodoList() {
  const auth = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<string[]>([]);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [createForm, setCreateForm] = useState<FormData>({
    title: "",
    description: "",
    priority: "moderate",
    todo_date: "",
  });

  // Edit modal
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editForm, setEditForm] = useState<FormData>({
    title: "",
    description: "",
    priority: "moderate",
    todo_date: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Filter and search logic
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((todo) => {
        if (!todo.todo_date) return false;
        const todoDate = new Date(todo.todo_date);
        todoDate.setHours(0, 0, 0, 0);

        return dateFilter.some((filter) => {
          if (filter === "today") {
            return todoDate.getTime() === today.getTime();
          }
          if (filter === "5days") {
            const fiveDaysLater = new Date(today);
            fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
            return (
              todoDate.getTime() >= today.getTime() &&
              todoDate.getTime() <= fiveDaysLater.getTime()
            );
          }
          if (filter === "10days") {
            const tenDaysLater = new Date(today);
            tenDaysLater.setDate(tenDaysLater.getDate() + 10);
            return (
              todoDate.getTime() >= today.getTime() &&
              todoDate.getTime() <= tenDaysLater.getTime()
            );
          }
          if (filter === "30days") {
            const thirtyDaysLater = new Date(today);
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
            return (
              todoDate.getTime() >= today.getTime() &&
              todoDate.getTime() <= thirtyDaysLater.getTime()
            );
          }
          return false;
        });
      });
    }

    return filtered;
  }, [todos, searchQuery, dateFilter]);

  // Fetch todos
  useEffect(() => {
    if (!auth?.token) {
      router.push("/login");
      return;
    }

    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        const todosArray = Array.isArray(data) ? data : data.results || [];
        setTodos(todosArray);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [auth?.token, router]);

  // Drag and drop
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTodos.findIndex((t) => t.id === active.id);
    const newIndex = filteredTodos.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newList = arrayMove(filteredTodos, oldIndex, newIndex);
    const updatedList = newList.map((todo, index) => ({
      ...todo,
      position: index,
    }));

    setTodos((prevTodos) => {
      const todoMap = new Map(prevTodos.map((t) => [t.id, t]));
      newList.forEach((todo) => {
        todoMap.set(todo.id, { ...todo, position: newList.indexOf(todo) });
      });
      return Array.from(todoMap.values());
    });

    try {
      await reorderTodos(updatedList);
      const data = await fetchTodos();
      const todosArray = Array.isArray(data) ? data : data.results || [];
      setTodos(todosArray);
    } catch (err) {
      console.error("Failed to reorder todos:", err);
      setTodos(todos);
    }
  };

  // Create
  const handleCreate = async () => {
    if (!createForm.title.trim()) return;
    const payload = {
      title: createForm.title.trim(),
      description: createForm.description.trim() || undefined,
      priority: createForm.priority,
      todo_date: createForm.todo_date || undefined,
    };
    try {
      const res = await createTodo(payload);
      setTodos((p) => [res, ...p]);
      setShowAddModal(false);
      setCreateForm({
        title: "",
        description: "",
        priority: "moderate",
        todo_date: "",
      });
    } catch (err) {
      console.error("createTodo error:", err);
    }
  };

  // Update
  const handleUpdate = async (id: string, payload: Partial<Todo>) => {
    try {
      const res = await updateTodo(id, payload);
      setTodos((p) => p.map((t) => (String(t.id) === String(id) ? res : t)));
      setEditingTodo(null);
    } catch (err) {
      console.error("updateTodo error:", err);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((p) => p.filter((t) => String(t.id) !== String(id)));
    } catch (err) {
      console.error("deleteTodo error:", err);
    }
  };

  // Edit click
  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: todo.title || "",
      description: todo.description || "",
      priority: todo.priority || "moderate",
      todo_date: todo.todo_date
        ? new Date(todo.todo_date).toISOString().split("T")[0]
        : "",
    });
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingTodo) return;
    if (!editForm.title.trim()) return;
    await handleUpdate(String(editingTodo.id), {
      title: editForm.title.trim(),
      description: editForm.description.trim() || undefined,
      priority: editForm.priority,
      todo_date: editForm.todo_date || undefined,
    });
  };

  // Toggle complete
  const handleToggleComplete = async (todo: Todo) => {
    await handleUpdate(String(todo.id), { is_completed: !todo.is_completed });
  };

  // Date filter toggle
  const toggleDateFilter = (filter: string) => {
    setDateFilter((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 mx-auto rounded-full animate-spin border-b-2 border-blue-500" />
        <p className="mt-3 text-gray-600">Loading todos…</p>
      </div>
    );
  }

  return (
    <div>
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterOpen={filterOpen}
        onFilterToggle={() => setFilterOpen(!filterOpen)}
        dateFilter={dateFilter}
        onDateFilterToggle={toggleDateFilter}
        onNewTask={() => setShowAddModal(true)}
      />

      
      <div className="mt-6 overflow-hidden">
        {filteredTodos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Tasks
            </h2>
            <div className="overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTodos.map((t) => t.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTodos.map((todo) => (
                      <SortableItem
                        key={todo.id}
                        todo={todo}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        formData={createForm}
        onClose={() => setShowAddModal(false)}
        onChange={(data) => setCreateForm((p) => ({ ...p, ...data }))}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={!!editingTodo}
        formData={editForm}
        onClose={() => setEditingTodo(null)}
        onChange={(data) => setEditForm((p) => ({ ...p, ...data }))}
        onSubmit={handleSaveEdit}
      />
    </div>
  );
}
