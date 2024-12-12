import './App.css';
import { useState, useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [newTitle, setNewTitle] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('http://127.0.0.1:8081/todo-items')
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => setErrorMessage('Erreur:', error));
  };

  const handleAddItem = () => {
    if (!newTitle.trim()) {
      setErrorMessage('Le champ ne peut pas être vide.');
      return;
    }

    const newItem = {
      title: newTitle,
      quantity: newQuantity,
    };

    fetch('http://127.0.0.1:8081/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'élément.");
        }
        return response.json();
      })
      .then(() => {
        setNewTitle('');
        setNewQuantity(1);
        setErrorMessage('');
        fetchTodos();
      })
      .catch((error) => setErrorMessage('Erreur:', error.message));
  };

  const handleDeleteItem = (id) => {
    fetch(`http://127.0.0.1:8081/delete/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'élément.");
        }
        fetchTodos();
      })
      .catch((error) => console.error('Erreur:', error));
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    const promises = Array.from(selectedItems).map((id) =>
      fetch(`http://127.0.0.1:8081/delete/${id}`, {
        method: 'DELETE',
      })
    );

    Promise.all(promises)
      .then(() => {
        setSelectedItems(new Set());
        fetchTodos();
      })
      .catch((error) => console.error('Erreur:', error));
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setEditingTitle(item.title);
    setEditingQuantity(item.quantity);
    setErrorMessage('');
  };

  const handleSaveEdit = () => {
    if (!editingTitle.trim()) {
      setErrorMessage('Le champ du titre ne peut pas être vide.');
      return;
    }

    const updatedItem = {
      title: editingTitle,
      quantity: editingQuantity,
    };

    fetch(`http://127.0.0.1:8081/update/${editingItem}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la modification de l'élément.");
        }
        setEditingItem(null);
        setErrorMessage('');
        fetchTodos();
      })
      .catch((error) => console.error('Erreur:', error));
  };

  return (
    <div className="flex justify-center items-center h-[30rem] mx-2">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-4 border shadow-md border-transparent rounded-md bg-white">
        <h1 className="mb-2 p-4 text-center font-bold text-xl">
          Todo List <ListAltIcon className="ml-2" fontSize="large" />
        </h1>
        <div className="flex items-center justify-center mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nom de l'item"
            className="mr-2 mt-1 border bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 max-w-full box-border"
          />
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            min="1"
            className="mr-2 mt-1 border bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 max-w-full box-border"
          />
          <AddCircleIcon
            className="text-green-500 hover:text-green-700 cursor-pointer"
            fontSize="large"
            onClick={handleAddItem}
          />
        </div>

        <ul className="mx-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`m-2 flex items-center border bg-gray-200 rounded-md p-4 ${selectedItems.has(todo.id) && editingItem !== todo.id ? 'line-through' : ''
                }`}
            >
              {editingItem === todo.id ? (
                <>
                  <div className="flex flex-1">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="mr-2 border bg-white shadow-md rounded-md p-2 w-64"
                    />
                    <input
                      type="number"
                      value={editingQuantity}
                      onChange={(e) => setEditingQuantity(Number(e.target.value))}
                      min="1"
                      className="mr-2 border bg-white shadow-md rounded-md p-2 w-20"
                    />
                  </div>
                  <div className="flex items-center ml-auto">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={handleSaveEdit}
                    >
                      <SaveIcon />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => setEditingItem(null)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedItems.has(todo.id)}
                    onChange={() => handleSelectItem(todo.id)}
                  />
                  <label className="flex-1">
                    {todo.title} - x {todo.quantity}
                  </label>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditItem(todo)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={() => handleDeleteItem(todo.id)}
                  >
                    <DeleteForeverIcon />
                  </button>
                </>
              )}

            </li>
          ))}
        </ul>

        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}


        {selectedItems.size > 0 && (
          <div className="mt-4 text-center">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDeleteSelected}
            >
              Supprimer les éléments sélectionnés
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
