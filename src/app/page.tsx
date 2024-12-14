import { TodoList } from "@/components/todo-list";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="container mx-auto p-4 max-w-lg">
      <TodoList />
    </main>
  );
}
