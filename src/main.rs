use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, sqlx::FromRow)]
struct TodoItem {
    id: String,
    title: String,
    quantity: u32,
    created_at: String,
    updated_at: Option<String>,
}

struct AppState {
    db_pool: Pool<Sqlite>,
}

// Manager to get task list
async fn get_todo_item(data: web::Data<AppState>) -> impl Responder {
    let todos = sqlx::query_as::<_, TodoItem>("SELECT * FROM todo_items")
        .fetch_all(&data.db_pool)
        .await;

    match todos {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(_) => HttpResponse::InternalServerError().body("Failed to fetch items"),
    }
}

// Manager to get a specific task by id
async fn get_item(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let id = path.into_inner();
    let todo = sqlx::query_as::<_, TodoItem>("SELECT * FROM todo_items WHERE id = ?")
        .bind(id)
        .fetch_one(&data.db_pool)
        .await;

    match todo {
        Ok(item) => HttpResponse::Ok().json(item),
        Err(_) => HttpResponse::NotFound().body("Todo item not found"),
    }
}

#[derive(Deserialize)]
struct NewItem {
    title: String,
    quantity: u32,
}

// Manager to add new task
async fn add_item(todo: web::Json<NewItem>, data: web::Data<AppState>) -> impl Responder {
    let new_id = Uuid::new_v4().to_string();
    let created_at = Utc::now().to_rfc3339();

    let result =
        sqlx::query("INSERT INTO todo_items (id, title, quantity, created_at) VALUES (?, ?, ?, ?)")
            .bind(&new_id)
            .bind(&todo.title)
            .bind(todo.quantity)
            .bind(&created_at)
            .execute(&data.db_pool)
            .await;

    match result {
        Ok(_) => HttpResponse::Created().json(TodoItem {
            id: new_id,
            title: todo.title.clone(),
            quantity: todo.quantity,
            created_at,
            updated_at: None,
        }),
        Err(_) => HttpResponse::InternalServerError().body("Failed to add item"),
    }
}

#[derive(Deserialize)]
struct UpdatedItem {
    title: String,
    quantity: u32,
}

// Manager to update a task
async fn update_item(
    path: web::Path<String>,
    updated_todo: web::Json<UpdatedItem>,
    data: web::Data<AppState>,
) -> impl Responder {
    let id = path.into_inner();
    let updated_at = Utc::now().to_rfc3339();

    let result =
        sqlx::query("UPDATE todo_items SET title = ?, quantity = ?, updated_at = ? WHERE id = ?")
            .bind(&updated_todo.title)
            .bind(updated_todo.quantity)
            .bind(&updated_at)
            .bind(&id)
            .execute(&data.db_pool)
            .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().body("Item updated successfully"),
        Ok(_) => HttpResponse::NotFound().body("Item not found"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to update item"),
    }
}

// Manager to delete a task
async fn delete_item(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let id = path.into_inner();
    let result = sqlx::query("DELETE FROM todo_items WHERE id = ?")
        .bind(&id)
        .execute(&data.db_pool)
        .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().body("Item deleted successfully"),
        Ok(_) => HttpResponse::NotFound().body("Item not found"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to delete item"),
    }
}

// Principal function to run server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_pool = SqlitePoolOptions::new()
        .connect("sqlite:./todo.db")
        .await
        .expect("Failed to create pool.");

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS todo_items (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT
        )",
    )
    .execute(&db_pool)
    .await
    .expect("Failed to create table.");

    let app_state = web::Data::new(AppState { db_pool });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/todo-items", web::get().to(get_todo_item))
            .route("/item/{id}", web::get().to(get_item))
            .route("/add", web::post().to(add_item))
            .route("/update/{id}", web::put().to(update_item))
            .route("/delete/{id}", web::delete().to(delete_item))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}
