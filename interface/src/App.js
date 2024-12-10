import './App.css';
import { useState, useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);

  // Charger les todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('http://127.0.0.1:8081/todo-items')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Erreur:', error));
  };

  // Ajouter un nouvel élément
  const handleAddItem = () => {
    if (!newTitle.trim()) {
      alert('Le champ ne peut pas être vide.');
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout de l\'élément.');
        }
        return response.json();
      })
      .then(() => {
        setNewTitle('');
        setNewQuantity(1);
        fetchTodos();
      })
      .catch(error => console.error('Erreur:', error));
  };

  //supprimer un item
  const handleDeleteItem = (id) => {
    fetch(`http://127.0.0.1:8081/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'élément.');
        }
        fetchTodos();
      })
      .catch(error => console.error('Erreur:', error));
  };

  return (
    <div className='flex justify-center items-center h-[30rem]'>
      <div className='w-1/2 bg-grey-500 p-4 border shadow-md border-transparent rounded-md bg-white'>
        <h1 className='mb-2 p-4 text-center font-bold text-xl'>
          Todo List <ListAltIcon className='ml-2' fontSize="large" />
        </h1>
        <div className="flex items-center justify-center mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nom de l'item"
            className="mr-2 mt-1 border bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          />
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            min="1"
            className="mr-2 mt-1 border bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
          />
          <AddCircleIcon
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            fontSize="large"
            onClick={handleAddItem}
          />
        </div>

        <ul className='mx-4'>
          {todos.map(todo => (
            <li
              className='m-2 flex items-center border border-transparent bg-gray-200 rounded-md p-4'
              key={todo.id}
            >
              <input type="checkbox" className='mr-2 mt-1' />
              <label className="container flex items-center">
                {todo.title} - x {todo.quantity}
                <span className="checkmark ml-2"></span>
              </label>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteItem(todo.id)}
              >
                <DeleteForeverIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
