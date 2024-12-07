"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Todo } from "@/types/todo";
import { addDays, isSameDay } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TodoItem } from "./todo-item";

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Meet Jack Sparrow",
    description: "Free him from the prison in Port Royal",
    completed: true,
    date: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Head for Tortuga",
    description: "Assemble a crew there",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Chase The Pearl",
    description: "All the way up to Isla de Muerta",
    completed: false,
    date: addDays(new Date(), 1).toISOString(),
  },
  {
    id: "4",
    title: "Find Elizabeth",
    description: "Prevent Barbossa from hurting her",
    completed: false,
    date: addDays(new Date(), 2).toISOString(),
  },
  {
    id: "5",
    title: "Shoot Barbossa",
    description: "After lifting the curse and depriving him of immortality",
    completed: false,
    date: addDays(new Date(), 2).toISOString(),
  },
];

export function TodoList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addTodo = () => {
    if (newTitle.trim()) {
      setTodos([
        ...todos,
        {
          id: Math.random().toString(),
          title: newTitle,
          description: newDescription,
          completed: false,
          date: selectedDate.toISOString(),
        },
      ]);
      setNewTitle("");
      setNewDescription("");
      setIsAddDialogOpen(false);
    }
  };

  const editTodo = (id: string) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setEditingTodo(todoToEdit);
      setNewTitle(todoToEdit.title);
      setNewDescription(todoToEdit.description);
      setIsEditDialogOpen(true);
    }
  };

  const updateTodo = () => {
    if (editingTodo && newTitle.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id
            ? { ...todo, title: newTitle, description: newDescription }
            : todo
        )
      );
      setEditingTodo(null);
      setNewTitle("");
      setNewDescription("");
      setIsEditDialogOpen(false);
    }
  };

  const filteredTodos = todos.filter((todo) =>
    isSameDay(new Date(todo.date), selectedDate)
  );

  return (
    <div className="relative min-h-[500px]">
      <div className="space-y-1">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No todos</p>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full fixed bottom-6 right-6 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Todo title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Button onClick={addTodo} className="w-full">
              Add Todo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Todo title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Button onClick={updateTodo} className="w-full">
              Update Todo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
