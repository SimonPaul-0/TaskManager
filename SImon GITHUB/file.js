const fs = require('fs');
const readline = require('readline-sync');

class TaskManager {
    constructor(filename = 'tasks.json') {
        this.filename = filename;
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        try {
            const fileContent = fs.readFileSync(this.filename, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else if (error instanceof SyntaxError) {
                console.log('Error decoding JSON. Creating a new task list.');
                return [];
            } else {
                throw error;
            }
        }
    }

    saveTasks() {
        fs.writeFileSync(this.filename, JSON.stringify(this.tasks, null, 2));
    }

    addTask(task) {
        this.tasks.push({ task, completed: false });
        this.saveTasks();
        console.log(`Task '${task}' added successfully!`);
    }

    markComplete(taskIndex) {
        if (taskIndex >= 0 && taskIndex < this.tasks.length) {
            this.tasks[taskIndex].completed = true;
            this.saveTasks();
            console.log(`Task '${this.tasks[taskIndex].task}' marked as complete!`);
        } else {
            console.log('Invalid task index.');
        }
    }

    viewTasks() {
        if (this.tasks.length === 0) {
            console.log('No tasks available.');
        } else {
            console.log('Tasks:');
            this.tasks.forEach((task, index) => {
                const status = task.completed ? 'Complete' : 'Incomplete';
                console.log(`${index + 1}. ${task.task} - ${status}`);
            });
        }
    }
}

function main() {
    const taskManager = new TaskManager();

    while (true) {
        console.log('\nTask Manager Menu:');
        console.log('1. Add Task');
        console.log('2. Mark Task as Complete');
        console.log('3. View Tasks');
        console.log('4. Quit');

        const choice = readline.question('Enter your choice (1-4): ').trim();

        if (choice === '1') {
            const task = readline.question('Enter the task: ');
            taskManager.addTask(task);
        } else if (choice === '2') {
            taskManager.viewTasks();
            const taskIndex = parseInt(readline.question('Enter the index of the task to mark as complete: ').trim()) - 1;
            if (!isNaN(taskIndex)) {
                taskManager.markComplete(taskIndex);
            } else {
                console.log('Invalid input. Please enter a valid number.');
            }
        } else if (choice === '3') {
            taskManager.viewTasks();
        } else if (choice === '4') {
            console.log('Goodbye!');
            break;
        } else {
            console.log('Invalid choice. Please enter a number between 1 and 4.');
        }
    }
}

main();
