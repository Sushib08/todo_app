use actix_web::{web, App, HttpResponse, HttpServer, Responder}; // Framework's crate
use chrono::Utc;
use serde::{Deserialize, Serialize}; // crate to convert data structures in JSON
use std::sync::Mutex; // crate to protect todo list against simultaneous access by multi-threads.
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
struct TodoItem {
    id: String,
    title: String,
    quantity: u32,
    created_at: String,
    updated_at: Option<String>,
}

struct AppState {
    todos: Mutex<Vec<TodoItem>>,
}

// Manager to get task list
async fn get_todo_item(data: web::Data<AppState>) -> impl Responder {
    let todos = data.todos.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

// Manager to get a specific task by id
async fn get_item(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let id = path.into_inner();
    let todos = data.todos.lock().unwrap();

    // Rechercher l'élément correspondant par son id
    if let Some(todo) = todos.iter().find(|item| item.id == id) {
        HttpResponse::Ok().json(todo)
    } else {
        // Si l'élément n'est pas trouvé, retourner une erreur 404
        HttpResponse::NotFound().body("Todo item not found")
    }
}

#[derive(Deserialize)]
struct NewItem {
    title: String,
    quantity: u32,
}

// Manager to add new task
async fn add_item(todo: web::Json<NewItem>, data: web::Data<AppState>) -> impl Responder {
    let mut todos = data.todos.lock().unwrap();

    // Créer un nouvel élément avec un identifiant unique et une date de création
    let new_todo = TodoItem {
        id: Uuid::new_v4().to_string(),
        title: todo.title.clone(),
        quantity: todo.quantity,
        created_at: Utc::now().to_rfc3339(),
        updated_at: None,
    };

    // Ajouter le nouvel élément à la liste
    todos.push(new_todo.clone());

    // Retourner la réponse avec le nouvel élément
    HttpResponse::Created().json(new_todo)
}

#[derive(Deserialize)]
struct UpdatedItem {
    title: String,
    quantity: u32,
}

// Manager to update a task
async fn update_item(
    path: web::Path<String>,
    updated_todo: web::Json<UpdatedItem>, // Utiliser la structure appropriée pour la désérialisation
    data: web::Data<AppState>,
) -> impl Responder {
    let id = path.into_inner();
    let mut todos = data.todos.lock().unwrap();

    // Chercher l'élément à mettre à jour
    if let Some(todo) = todos.iter_mut().find(|item| item.id == id) {
        // Mettre à jour le title et la quantity
        todo.title = updated_todo.title.clone();
        todo.quantity = updated_todo.quantity;
        todo.updated_at = Some(Utc::now().to_rfc3339());

        // Retourner l'élément mis à jour
        return HttpResponse::Ok().json(todo);
    }

    // Si l'élément n'est pas trouvé, retourner une erreur 404
    HttpResponse::NotFound().body("Item not found")
}

// Manager to delete a task
async fn delete_item(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let id = path.into_inner();
    let mut todos = data.todos.lock().unwrap();

    // Chercher l'index de l'élément à supprimer
    if let Some(pos) = todos.iter().position(|item| item.id == id) {
        // Supprimer l'élément trouvé
        todos.remove(pos);
        HttpResponse::Ok().body("Item deleted successfully")
    } else {
        // Si l'élément n'est pas trouvé, retourner une erreur 404
        HttpResponse::NotFound().body("Item not found")
    }
}

// Principal function to run server
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        todos: Mutex::new(Vec::new()),
    });

    // Configuring and starting the HTTP server
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
