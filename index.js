const todoStore = new Store([]);

// Add Task
function addTask(taskName) {
  const newTask = {
    id: Math.random().toString(),
    taskName: taskName,
    done: false,
  };

  const data = todoStore.get();
  todoStore.update([...data, newTask]);

  callNotification("Successfully Added", taskName);
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

  saveLocalData("todoStore", data);
});

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

function saveLocalData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalData(key) {
  return JSON.parse(localStorage.getItem(key));
}

updateTodoUI(todoStore.get());

// Windows Start

function initial() {
  const data = getLocalData("todoStore");

  if (data) {
    todoStore.update(data);
  }
}

function callNotification(text, bodyText) {
  console.log("Calling NOti method");

  if (!("Notification" in window)) {
    // Check if the browser supports notifications

    console.log("Not Supported Noti");

    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(bodyText, {
      title: text,
      body: bodyText,
    });

    console.log("Permission Notition");

    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(bodyText, {
          title: text,
          body: bodyText,
        });
        // …
      }
    });
  }
}

initial();
