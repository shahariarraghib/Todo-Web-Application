import TodoList from "@/components/TodoList";
import DashboardLayout from "@/components/DashboardLayout";

export default function TodosPage() {
  return (
    <DashboardLayout>
      <div className="bg-white mx-10 pt-2 p-8 rounded-md">
        <h1 className=" font-medium text-[24px] ">Todos</h1>
        <div className="border-b-2 border-[#5272FF] w-[45px] mb-6"></div>
        <TodoList />
      </div>
    </DashboardLayout>
  );
}
