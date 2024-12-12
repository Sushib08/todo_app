# TodoApp - Task Management in Rust with Actix-web and Next.js

## Description

TodoApp is a web application developed in Rust using the **Actix-web** framework to create and manage a task list. The application supports CRUD operations (Create, Read, Update, Delete) and uses the **Uuid** crate to generate unique identifiers for each task. In the latest update, **SQLx** with **SQLite** has been integrated to persist task data, allowing you to keep track of tasks even after the application restarts.

The frontend of the application has been built with **Next.js**, **React**, **Tailwind CSS** and **Material-UI** to provide a modern user interface for adding, editing and deleting tasks directly through the UI.

## Features

- **View all tasks**: Retrieve the complete list of tasks.
- **View a specific task**: Get the details of a task by its unique identifier.
- **Add a new task**: Create and add a new task with a title and quantity.
- **Update a task**: Modify the title and quantity of an existing task.
- **Delete a task**: Remove a task using its unique identifier.
- **Persistent storage**: All tasks are now stored in an SQLite database, ensuring data is retained between sessions.

## Prerequisites

- **Rust**: Stable version of Rust installed (see [Rust installation guide](https://www.rust-lang.org/tools/install)).
- **Cargo**: Rust's package manager.
- **Node.js**: LTS version recommended to run the Next.js frontend (see [Node.js download page](https://nodejs.org/fr)).
- **npm/yarn**: Package managers for installing frontend dependencies.

## Dependencies

The following libraries are used in the application:

### Backend (Rust) :

- actix-web: Web framework for building HTTP applications.
- uuid: Generation of unique identifiers.
- chrono: Handling and formatting of dates and times.
- serde and serde_json: (De)serialization of JSON data structures.
- sqlx: For database interaction with **SQLite**.

### Frontend (Next.js) :

- **next**: React framework for building web applications.
- **react**: Library for buildind user interfaces.
- **Material-UI**: React component library for modern design (used for icons and buttons).
- **talwindcss** : Utility-first CSS framework for building custom designs quickly.
- **fetch**: Native Javascript API used to interact with the backend API.

## Installation

1. Clone the repository :

   ```bash
   git clone https://github.com/Sushib08/todo_app.git
   ```

2. Navigate to the **Frontend** or **Backend** directory :

- For the **Frontend** (Next.js) :
  ```bash
  cd todo_app/interface
  ```
- For the **Backend** (Rust) :
  ```bash
  cd todo_app/server
  ```

### Backend (Rust)

1. Build the project :

   ```bash
   cargo build
   ```

2. Run the backend :

   ```bash
   cargo run
   ```

   The backend API will be available at http://127.0.0.1:8081.

### Frontend (Next.js)

1. Install dependencies :

```bash
npm install
```

Or

```bash
yarn install
```

3. Run the frontend application :

```bash
npm run dev
```

Or

```bash
yarn dev
```

The frontend will be available at http://localhost:3000.

## Setting up the Database

The application uses SQLite to store task data. SQLx handles database migrations and interactions seamlessly.

To verify the contents of your database:

- **Access the SQLite database**:

```bash
sqlite3 todo_app.db
```

- **View all tasks**:

  ```sql
  SELECT * FROM todo_items;
  ```

- **Other useful commands**:

  - **List all tables**:

    ```sql
    .tables
    ```

  - **Show table schema**:

    ```sql
    .schema todo_items
    ```

  - **Exit SQLite**:

    ```sql
    .exit
    ```

## Endpoints

The application exposes the following endpoints:

### 1. Get all tasks

- **Endpoint**: GET /todo-items
- **Description**: Returns the list of all tasks.
- **Response**: JSON containing existing tasks.

### 2. Get a task by ID

- **Endpoint**: GET /item/{id}
- **Description**: Returns the details of a specific task by its ID.
- **Response**: JSON of the task or 404 error message if not found.

### 3. Add a new task

- **Endpoint**: POST /add
- **Description**: Adds a new task.
- **Request Body**: JSON with title (String) and quantity (u32).
- **Response**: JSON of the created task.

### 4. Update a task

- **Endpoint**: PUT /update/{id}
- **Description**: Updates the title and quantity of a task.
- **Request Body**: JSON with title (String) and quantity (u32).
- **Response**: JSON of the updated task or 404 error message if not found.

### 5. Delete a task

- **Endpoint**: DELETE /delete/{id}
- **Description**: Deletes a task by its ID.
- **Response**: Success message or 404 error if the task is not found.

## Running the Application

The backend runs locally on http://127.0.0.1:8081, and the frontend is served at http://localhost:3000. You can interact with the backend using an HTTP client (such as Postman or cURL).

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

- Implement user authentication.
- Add task status management (e.g., in progress, completed).

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

GitHub Repository: [TodoApp](https://github.com/Sushib08/todo_app.git)
