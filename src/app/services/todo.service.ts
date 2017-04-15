import {Injectable} from '@angular/core';
import {Todo} from '../models/todo.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import {Http, Response} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SmartsheetConfig} from '../../smartsheet.config';

const SHEET_URL = `${SmartsheetConfig.smartsheetUrl}/sheet/${SmartsheetConfig.sheetId}`;

@Injectable()
export class TodoService {
    private todos: BehaviorSubject<Array<Todo>> = null;

    constructor(private http: Http) {
        this.todos = new BehaviorSubject(null);
        this.http.get(`${SHEET_URL}`)
            .map(this.extractData)
            .map(this.fromJson)
            .catch((res: Response) => this.handleError(res))
            .subscribe(todos => this.todos.next(todos));
    }

    getTodos(): Observable<Array<Todo>> {
        return this.todos;
    }

    deleteTodo(todoToDelete: Todo) {
       this.deleteTodos([todoToDelete.rowId]);
    }

    deleteTodos(todoIds: Array<number>) {
        const todosToDelete = todoIds.join();

        this.http.delete(`${SHEET_URL}/rows?ids=${todosToDelete}`)
            .map(this.extractData)
            .catch((res: Response) => this.handleError(res))
            .subscribe(deletedTodos => {
                let remainingTodos;
                this.todos.subscribe(todos => remainingTodos = todos.filter(todo => !deletedTodos.includes(todo.rowId)));
                if (remainingTodos) {
                    this.todos.next(remainingTodos);
                }
            });
    }

    addTodo(newTodoTitle: string) {
        const newTodoJson = this.toNewTodoJson(newTodoTitle);
        this.http.post(`${SHEET_URL}/rows`, JSON.stringify(newTodoJson))
            .map(this.extractData)
            .map(this.fromJson)
            .catch((res: Response) => this.handleError(res))
            .subscribe(newTodo => {
                let todos;
                this.todos.subscribe(todosSub => todos = todosSub);
                if (todos) {
                    todos.push(newTodo[0]);
                    this.todos.next(todos);
                }
            });
    }

    updateTodo(todoToUpdate: Todo): Observable<Array<Todo>> {
        this.http.put(`${SHEET_URL}/rows`, this.toUpdateTodoJson(todoToUpdate))
            .map(this.extractData)
            .map(this.fromJson)
            .catch((res: Response) => this.handleError(res))
            .subscribe(newTodo => {
                let todos;
                this.todos.subscribe(todosSub => {
                    todos = todosSub.filter(todo => todo.rowId !== newTodo[0].rowId);
                });
                if (todos) {
                    todos.push(newTodo[0]);
                    this.todos.next(todos);
                }
            });
        return this.todos;
    }

    private extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return (body) ? body.result || body : {};
    }

    private fromJson(json: any): Array<Todo> {
        const todos = new Array<Todo>();
        let rows = null;

        if (json.rows) {
            rows = json.rows;
        } else {
            if (json instanceof Array) {
                rows = json;
            } else {
                rows = [json];
            }
        }

        rows.forEach(row => {
            const todo = new Todo(row.id, row.rowNumber);
            row.cells.forEach(cell => {
                switch (cell.columnId) {
                    case SmartsheetConfig.taskNameColumnId:
                        todo.name = cell.value;
                        break;
                    case SmartsheetConfig.doneColumnId:
                        todo.done = cell.value ? cell.value : false;
                }
            });
            todos.push(todo);
        });

        return todos;
    }

    private toNewTodoJson(newTodoTitle: string) {
        return {
            toBottom: true,
            cells: [
                {columnId:  SmartsheetConfig.taskNameColumnId, value: newTodoTitle}
            ]
        };
    }

    private toUpdateTodoJson(todo: Todo) {
        return {
            id: todo.rowId,
            cells: [
                {
                    columnId: SmartsheetConfig.taskNameColumnId,
                    value: todo.name
                },
                {
                    columnId: SmartsheetConfig.doneColumnId,
                    value: todo.done
                }
            ]
        };
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
