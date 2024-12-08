import { Todo } from "@/types/todo";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TodoStore {
  todos: Todo[];
  add: (todo: Todo) => void;
  remove: (id: string) => void;
  edit: (todo: Todo) => void;
  toggle: (id: string) => void;
}

const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [
        {
          id: "135234654368",
          title: "Morning Exercise",
          description:
            "Complete a 30-minute workout, including stretching, cardio, and strength training exercises.",
          completed: false,
          date: new Date().toISOString(),
        },
        {
          id: "876352665467",
          title: "Evening Reading",
          description:
            "Spend 1 hour reading a book or articles to unwind and improve knowledge or vocabulary.",
          completed: false,
          date: new Date().toISOString(),
        },
      ],

      add: (todo) => set((state) => ({ todos: [...state.todos, todo] })),

      remove: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      edit: (todo) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
        })),

      toggle: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                }
              : todo
          ),
        })),
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTodoStore;
