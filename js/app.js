const todolist = {

    init: () => {
        todolist.listener();
        todolist.manageUserName();
        const todos = JSON.parse(localStorage.getItem("todos")) || localStorage.setItem("todos", "[]");
        if (!todos) return false;
        todos.forEach(todo => {
            todolist.createDomContent(todo);
        });
    },

    listener: () => {
        document
            .getElementById("name")
            .addEventListener("change", evt => {
                localStorage.setItem("username", evt.target.value);
                todolist.manageUserName();
            });

        document
            .getElementById("new-todo-form")
            .addEventListener("submit", evt => {
                evt.preventDefault();
                todolist.getInput(evt);
            });
    },

    storage: (todo) => {
        let todos = JSON.parse(localStorage.getItem("todos"));
        if (!todos) todos = [];
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    },

    manageUserName: () => {
        const input = document.getElementById("name");
        input.value = localStorage.getItem("username");
    },

    getInput: (evt) => {
        const todo = {
            content: evt.target.content.value,
            category: evt.target.category.value,
            done: false,
            date: new Date().getTime(),
        }
        todolist.storage(todo);
        todolist.createDomContent(todo);
        evt.target.content.value="";
    },

    createDomContent: (todo) => {
        if (!todo) return false;
        const list = document.getElementById("todo-list");

        // elements
        const todoContainer = document.createElement("div");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        const bubble = document.createElement("div");
        const contentContainer = document.createElement("div");
        const content = document.createElement("input");
        const btnsContainer = document.createElement("div");
        const edit = document.createElement("button");
        const del = document.createElement("button");

        // checkbox
        todoContainer.classList.add("todo-item");
        list.appendChild(todoContainer);
        todoContainer.appendChild(label);
        label.appendChild(checkbox);
        bubble.classList = [`bubble ${todo["category"]}`];
        checkbox.type = "checkbox";
        label.appendChild(checkbox);
        label.appendChild(bubble);

        // content
        contentContainer.classList.add("todo-content");
        todoContainer.appendChild(contentContainer);
        content.setAttribute("type", "text");
        content.setAttribute("readonly", true);
        content.setAttribute("value", `${todo["content"]}`);
        contentContainer.appendChild(content);
        if (todo.done) {
            content.classList.add("done");
            checkbox.checked = true;
        }

        // btns
        btnsContainer.classList.add("btns");
        todoContainer.appendChild(btnsContainer);
        edit.classList.add("edit");
        edit.innerText = "EDIT";
        del.classList.add("delete");
        del.innerText = "DELETE";
        btnsContainer.appendChild(edit);
        btnsContainer.appendChild(del);

        // listeners
        edit.addEventListener("click", evt => {
            todolist.editMode(evt, todo, content);
        });

        del.addEventListener("click", evt => {
            todolist.del(todo, del)
        });

        checkbox.addEventListener("change", evt => {
            todolist.checked(evt, todo, content);
        });
    },

    editMode: (evt, todo, content) => {
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach((t, index) => {
            if (t.content === todo.content) {
                content.readOnly = false;
                content.focus();
                content.addEventListener("blur", e => {
                    content.readOnly = true;
                    todo.content = content.value;
                    todos[index] = todo;
                    localStorage.setItem("todos", JSON.stringify(todos));
                });
            }
        });
    },

    del: (todo, del) => {
        del.parentElement.parentElement.remove();
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach((t, index) => {
            if (t.content === todo.content) todos.splice(index, 1);
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    },

    checked: (evt, todo, content) => {
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach((t, index) => {
            if (t.content === todo.content) {
                content.classList.toggle("done");
                content.classList.contains("done") ?
                    todo.done = true :
                    todo.done = false;
                todos[index] = todo;
            }
        })
        localStorage.setItem("todos", JSON.stringify(todos));
    },
}

document.addEventListener("DOMContentLoaded", todolist.init);