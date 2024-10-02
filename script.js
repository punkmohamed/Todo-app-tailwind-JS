
let taskLocal = JSON.parse(localStorage.getItem('todo') || '[]');


const toHide = document.getElementById('toHide');
const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task');
const newTaskInput = document.getElementById('new-task-input');
let updateing = false;
let updateIndex = null
console.log(taskLocal, 'taskLocal');


//getting the data from local storage and present it in html
const getTodo = () => {
    taskList.innerHTML = '';
    if (taskLocal.length > 0) {
        toHide.classList.remove('hidden');
    } else {
        toHide.classList.add('hidden');

    }
    toHide
    taskLocal.forEach((todo, index) => {
        const taskItem = document.createElement('div')
        taskItem.className = 'task-item flex items-center mb-4 text-base sm:text-lg adding';
        setTimeout(() => {
            taskItem.classList.remove('adding');
        }, 500);
        const circleContainer = document.createElement('div');
        circleContainer.className = 'w-1/4 flex justify-center cursor-pointer';
        const circle = document.createElement('div');
        circle.className = 'w-6 h-6 sm:w-7 sm:h-7 border-2 border-gray-300 rounded-full transition-all duration-200 ease-in-out';
        circleContainer.appendChild(circle);
        if (todo.completed) {
            circle.classList.toggle('bg-green-500');
            circle.classList.toggle('border-transparent');
        }
        // updating the completed status
        circleContainer.addEventListener('click', () => {
            todo.completed = !todo.completed
            circle.classList.toggle('bg-green-500');
            circle.classList.toggle('border-transparent');
            saveTodo(taskLocal)
        });
        // appending the data from local storage to created elements
        const taskDescription = document.createElement('div');
        taskDescription.className = 'flex-grow grid grid-cols-4 gap-2 items-center';
        const taskTextElement = document.createElement('span');
        taskTextElement.className = 'break-words col-span-3 py-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-500 overflow-hidden text-ellipsis text-2xl';
        taskTextElement.innerText = todo.text;
        taskDescription.appendChild(taskTextElement);
        taskItem.appendChild(circleContainer);
        taskItem.appendChild(taskDescription);

        //create div hold ubuttos for delete and update
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'col-span-1 flex gap-2 justify-end';

        taskDescription.appendChild(buttonsDiv);


        // update button  
        const updateButton = document.createElement('button')
        updateButton.innerHTML = '<i class="fas fa-edit"></i>';
        updateButton.className = 'bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition-colors duration-200';
        buttonsDiv.appendChild(updateButton);
        updateButton.onclick = () => {
            newTaskInput.value = todo.text
            addTaskButton.innerHTML = '  <i class="fas fa-plus mr-1"></i> update'
            updateIndex = index
            updateing = true
        }

        // Delete button and notification 
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.className = 'bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors duration-200';
        deleteButton.onclick = () => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    taskItem.classList.add('removing');
                    setTimeout(() => {
                        taskLocal.splice(index, 1);
                        saveTodo(taskLocal);
                        getTodo();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your task has been deleted.",
                            icon: "success"
                        });
                    }, 300);
                }
            });
        };
        buttonsDiv.appendChild(deleteButton);
        taskList.appendChild(taskItem)
    });
}
//adding todo and updateing current todo
addTaskButton.addEventListener('click', () => {
    const text = newTaskInput.value.trim()
    if (text) {
        if (updateing === true) {
            Swal.fire({
                title: "Are you sure you want to update?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    taskLocal[updateIndex].text = text
                    updateing = false
                    updateIndex = null
                    addTaskButton.innerHTML = '  <i class="fas fa-plus mr-1"></i> add'
                    newTaskInput.value = ''
                    saveTodo(taskLocal);
                    getTodo();
                    Swal.fire({
                        title: "Updated!",
                        text: "Your file has been updated.",
                        icon: "success"
                    });
                }
            });
        } else {
            ///adding todo
            taskLocal.push({ text, completed: false })
            getTodo()
            console.log(taskLocal, "taskLocal");
            saveTodo(taskLocal)

            Swal.fire({
                position: "top",
                icon: "success",
                title: "Task have been saved into todo list successfuly",
                showConfirmButton: false,
                timer: 3000
            });
        }
        newTaskInput.value = ''
    }
})

/// pressing enter to add or update
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTaskButton.click();
    }
});

/// saving todo to the local storage
const saveTodo = (todos) => {
    localStorage.setItem('todo', JSON.stringify(todos))
}


/// calling the todo to get it from local storage
getTodo()

