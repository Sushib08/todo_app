# TodoApp - Task Management in Rust with Actix-web

## Description
TodoApp is a web application developed in Rust using the **Actix-web** framework to create and manage a task list. The application supports CRUD operations (Create, Read, Update, Delete) and uses the **Uuid** crate to generate unique identifiers for each task.

## Features
- **View all tasks**: Retrieve the complete list of tasks.
- **View a specific task**: Get the details of a task by its unique identifier.
- **Add a new task**: Create and add a new task with a title and quantity.
- **Update a task**: Modify the title and quantity of an existing task.
- **Delete a task**: Remove a task using its unique identifier.

## Prerequisites
- **Rust**: Stable version of Rust installed (see [Rust installation guide](https://www.rust-lang.org/tools/install)).
- **Cargo**: Rust's package manager.

## Dependencies
The following libraries are used in the application:
- `actix-web`: Web framework for building HTTP applications.
- `uuid`: Generation of unique identifiers.
- `chrono`: Handling and formatting of dates and times.
- `serde` and `serde_json`: (De)serialization of JSON data structures.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sushib08/todo_app.git
   cd todo_app
   ```
2. Build the project:
   ```bash
   cargo build
   ```
3. Run the application:
   ```bash
   cargo run
   ```

## Endpoints
The application exposes the following endpoints:

### 1. Get all tasks
- **Endpoint**: `GET /todo-items`
- **Description**: Returns the list of all tasks.
- **Response**: JSON containing existing tasks.

### 2. Get a task by ID
- **Endpoint**: `GET /item/{id}`
- **Description**: Returns the details of a specific task by its ID.
- **Response**: JSON of the task or 404 error message if not found.

### 3. Add a new task
- **Endpoint**: `POST /add`
- **Description**: Adds a new task.
- **Request Body**: JSON with `title` (String) and `quantity` (u32).
- **Response**: JSON of the created task.

### 4. Update a task
- **Endpoint**: `PUT /update/{id}`
- **Description**: Updates the title and quantity of a task.
- **Request Body**: JSON with `title` (String) and `quantity` (u32).
- **Response**: JSON of the updated task or 404 error message if not found.

### 5. Delete a task
- **Endpoint**: `DELETE /delete/{id}`
- **Description**: Deletes a task by its ID.
- **Response**: Success message or 404 error if the task is not found.

## Running the Application
The app runs locally on `127.0.0.1:8081`. Use an HTTP client (such as Postman or cURL) to interact with the endpoints.

## Example Usage with cURL
- **Add a task**:
   ```bash
   curl -X POST http://127.0.0.1:8081/add \
   -H "Content-Type: application/json" \
   -d '{"title": "Buy milk", "quantity": 2}'
   ```

- **Get all tasks**:
   ```bash
   curl http://127.0.0.1:8081/todo-items
   ```

## Future Improvements
- Add persistent database storage.
- Implement user authentication.
- Add task status management (e.g., in progress, completed).

## License
This project is licensed under the MIT License. See the `LICENSE` file for more information.

GitHub Repository: [TodoApp](https://github.com/Sushib08/todo_app.git)

