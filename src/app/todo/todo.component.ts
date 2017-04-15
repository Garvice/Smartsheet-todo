
import {Component} from '@angular/core';
import {TodoService} from '../services/todo.service';
import {Todo} from '../models/todo.model';

@Component({
    selector: 'app-todo',
    templateUrl: 'todo.component.html'
})
export class TodoComponent {
    newTodoText = '';
    public todos: Array<Todo>;

    constructor(private todoService: TodoService) {
        todoService.getTodos().subscribe(todos => {if (todos) {this.todos = todos.sort((a, b) => a.ordinal - b.ordinal); }});
        console.log(this.todos);
    }

    stopEditing(todo: Todo, editedTitle: string) {
        todo.name = editedTitle;
        todo.editing = false;
    }

    cancelEditingTodo(todo: Todo) {
        todo.editing = false;
    }

    updateEditingTodo(editedTodo: Todo, editedTitle: string) {
        editedTitle = editedTitle.trim();
        editedTodo.editing = false;

        if (editedTitle.length === 0) {
            return this.todoService.deleteTodo(editedTodo);
        }
        editedTodo.name = editedTitle;
        this.todoService.updateTodo(this.todos.find(todo => todo.rowId === editedTodo.rowId));
    }

    editTodo(todo: Todo) {
        todo.editing = true;
    }

    toggleCompletion(todo: Todo) {
        todo.done = !todo.done;
        this.todoService.updateTodo(todo);
    }

    remove(todo: Todo) {
        this.todoService.deleteTodo(todo);
    }

    addTodo() {
        if (this.newTodoText.trim().length) {
            this.todoService.addTodo(this.newTodoText);
            this.newTodoText = '';
        }
    }

    removeCompleted() {
        const todosToDelete = new Array<number>();

        this.todos.filter(todo => {
            if (todo.done) {
                return true;
            }}).map(todo => todosToDelete.push(todo.rowId));

        this.todoService.deleteTodos(todosToDelete);
    }
}
