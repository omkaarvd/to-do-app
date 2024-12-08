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
import useTodoStore from "@/store";
import { Todo } from "@/types/todo";
import { format, isSameDay, isToday, isTomorrow, isYesterday } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CalendarView } from "./calendar-view";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const todos = useTodoStore((state) => state.todos);
  const toggle = useTodoStore((state) => state.toggle);
  const remove = useTodoStore((state) => state.remove);
  const add = useTodoStore((state) => state.add);
  const edit = useTodoStore((state) => state.edit);

  const addTodo = () => {
    if (newTitle.trim()) {
      add({
        id: Math.random().toString(),
        title: newTitle,
        description: newDescription,
        completed: false,
        date: selectedDate.toISOString(),
      });
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
      edit({
        ...editingTodo,
        title: newTitle,
        description: newDescription,
      });

      setEditingTodo(null);
      setNewTitle("");
      setNewDescription("");
      setIsEditDialogOpen(false);
    }
  };

  const filteredTodos = todos.filter((todo) =>
    isSameDay(new Date(todo.date), selectedDate)
  );

  let dateLabel = isToday(selectedDate)
    ? "Today"
    : isYesterday(selectedDate)
    ? "Yesterday"
    : isTomorrow(selectedDate)
    ? "Tomorrow"
    : format(selectedDate, "EEE, MMM dd");

  return (
    <div className="relative min-h-[500px]">
      <CalendarView
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <h2 className="font-semibold text-lg leading-none my-3">{dateLabel}</h2>

      {filteredTodos.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No todos</p>
      )}

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggle}
            onDelete={remove}
            onEdit={editTodo}
          />
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="size-12 rounded-full fixed bottom-6 left-1/2 -translate-x-1/2 shadow-lg"
          >
            <Plus className="scale-125" strokeWidth={3} />
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
            <Button onClick={addTodo} className="w-full font-semibold">
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
            <Button onClick={updateTodo} className="w-full font-semibold">
              Update Todo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
