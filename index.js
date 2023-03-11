const todoStore = new Store([
  {
    id: "1",
    taskName: "New Task dshifaahdsf",
    done: false,
  },
]);

// Add Task
function addTask(taskName) {
  const newTask = {
    id: Math.random().toString(),
    taskName: taskName,
    done: false,
  };

  const data = todoStore.get();
  todoStore.update([...data, newTask]);
  return todoStore.get();
}

// Update Task
function updateTask(id, taskName) {
  const data = todoStore.get();
  const index = data.findIndex((item) => item.id === id);

  // -1 don't not find
  if (index === -1) {
    // alert("Task doesn't exist");
    return data;
  } // Exit Function

  data[index].taskName = taskName;

  // Update Exisiting Task
  todoStore.update([...data]);
  return todoStore.get();
}

// Toggle Done
function toggleDoneTask(id) {
  const data = todoStore.get();
  const index = data.findIndex((item) => item.id === id);

  // -1 don't not find
  if (index === -1) {
    // alert("Task doesn't exist");
    return data;
  } // Exit Function

  data[index].done = !data[index].done;

  todoStore.update([...data]);
  return todoStore.get();
}

// Remove Task
function removeTask(id) {
  const data = todoStore.get();
  const index = data.findIndex((item) => item.id === id);

  // -1 don't not find
  if (index === -1) {
    // alert("Task doesn't exist");
    return data;
  } // Exit Function

  todoStore.update(data.filter((item) => item.id !== id));
  return todoStore.get(); // Return new array
}

// Helper Functions
function prettyLog(someData) {
  console.log(JSON.stringify(someData, null, 2));
}

// Observale Store
function Store(data) {
  this.data = data; // Object or Array
  this.subFn = null;

  this.get = function () {
    return this.data;
  };

  this.update = function (data) {
    this.data = [...data];
    if (this.subFn) {
      this.subFn(this.data);
    }
  };

  this.subscribe = function (fn) {
    this.subFn = fn;
  };
}

todoStore.subscribe(function (data) {
  // Update UI
  console.log("===== Changes ======");
  console.log(data);

  // updateUI()
  updateTodoUI(data);
});

prettyLog(todoStore.get());

function updateTodoUI(data) {
  const listContainer = document.getElementById("todo-list-container");
  listContainer.innerHTML = "";

  for (let index = 0; index < data.length; index++) {
    const li = document.createElement("li"); // <li>
    const input = document.createElement("input"); // <input>
    input.type = "checkbox"; // <input type="checkbox"
    input.checked = data[index].done ? "checked" : ""; //
    input.addEventListener("click", function (e) {
      toggleDoneTask(data[index].id);
    });
    li.appendChild(input); // <li> <input> </li>
    const span = document.createElement("span");
    span.innerHTML = data[index].taskName;
    li.appendChild(span); // <li> <input> <span> </span> </li>
    const del = document.createElement("button"); // <button>
    del.innerHTML = "del";
    del.addEventListener("click", function (e) {
      removeTask(data[index].id);
    });
    li.appendChild(del); // <li> <input> <span> </span> <button> Del </button> </li>
    listContainer.appendChild(li); // <ul> <li> Task Name </li> </ul>
  }
}

const addButton = getById("add-button");

addButton.addEventListener("click", function (e) {
  const inputValue = getById("add-todo-input").value;

  if (!inputValue) {
    alert("Somehitng");
  }

  addTask(inputValue);
  inputValue.value = "";
});

function getById(id) {
  return document.getElementById(id);
}

updateTodoUI(todoStore.get());
