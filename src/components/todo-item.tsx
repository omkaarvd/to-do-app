import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <div className="flex items-start space-x-4 py-4 shadow p-4 rounded-xl bg-white">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="size-5"
      />
      <div className="flex-1">
        <h3
          className={cn(
            "font-semibold text-lg leading-none",
            todo.completed && "line-through text-muted-foreground"
          )}
        >
          {todo.title}
        </h3>
        <p
          className={cn(
            "text-sm text-muted-foreground mt-1",
            todo.completed && "line-through"
          )}
        >
          {todo.description}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(todo.id)}
          className="text-muted-foreground hover:text-primary"
        >
          <Edit className="scale-110" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="scale-110" />
        </Button>
      </div>
    </div>
  );
}
