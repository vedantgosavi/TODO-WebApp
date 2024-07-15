
import React, { useState, useEffect } from 'react';
import api from './api/api';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ id: 0, title: '', description: '', priority: '', category: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [searchTerm, selectedPriorities, selectedCategories]);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/api/TodoItems');
      setTodos(response.data);
      setFilteredTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos', error.response?.data);
    }
  };

  const addOrUpdateTodo = async () => {
    if (newTodo.title.trim() === '') {
      setError('Title is required');
      return;
    }
    if (newTodo.priority === '') {
      setError('Priority is required');
      return;
    }
    if (newTodo.category === '') {
      setError('Category is required');
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/api/TodoItems/${newTodo.id}`, newTodo);
        setIsEditing(false);
      } else {
        await api.post('/api/TodoItems', newTodo);
      }
      fetchTodos();
      setNewTodo({ id: 0, title: '', description: '', priority: '', category: '' });
      setError('');
    } catch (error) {
      console.error('Error adding/updating todo', error.response?.data);
      setError('Error adding/updating todo');
    }
  };

  const handleEdit = (todo) => {
    setNewTodo(todo);
    setIsEditing(true);
    setError('');
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/api/TodoItems/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo', error.response?.data);
      setError('Error deleting todo');
    }
  };

  const filterTodos = () => {
    let filtered = todos.filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(todo => selectedPriorities.includes(todo.priority));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(todo => selectedCategories.includes(todo.category));
    }

    setFilteredTodos(filtered);
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedPriorities([]);
    setSelectedCategories([]);
    setFilteredTodos(todos);
    setError('');
  };

  return (
    <div className="todo-app">
      <div className="search-column">
        <div className="box">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="box">
          <label>
            <input
              type="checkbox"
              value="High"
              onChange={() => handlePriorityChange('High')}
              checked={selectedPriorities.includes('High')}
            />
            High Priority
          </label>
        </div>
        <div className="box">
          <label>
            <input
              type="checkbox"
              value="Medium"
              onChange={() => handlePriorityChange('Medium')}
              checked={selectedPriorities.includes('Medium')}
            />
            Medium Priority
          </label>
        </div>
        <div className="box">
          <label>
            <input
              type="checkbox"
              value="Low"
              onChange={() => handlePriorityChange('Low')}
              checked={selectedPriorities.includes('Low')}
            />
            Low Priority
          </label>
        </div>
        <div className="box">
          <label>
            <input
              type="checkbox"
              value="Work"
              onChange={() => handleCategoryChange('Work')}
              checked={selectedCategories.includes('Work')}
            />
            Work
          </label>
        </div>
        <div className="box">
          <label>
            <input
              type="checkbox"
              value="Personal"
              onChange={() => handleCategoryChange('Personal')}
              checked={selectedCategories.includes('Personal')}
            />
            Personal
          </label>
        </div>
        <div className="box">
          <label>
            <input
              type="checkbox"
              value="Other"
              onChange={() => handleCategoryChange('Other')}
              checked={selectedCategories.includes('Other')}
            />
            Other
          </label>
        </div>
        <div className="box">
          <button onClick={resetFilters}>View All</button>
        </div>
      </div>


      <div className="todo-list">
        <h1>TODO APP</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          />
          <select
            value={newTodo.priority}
            onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={newTodo.category}
            onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={addOrUpdateTodo}>
            {isEditing ? 'Update Todo' : 'Add Todo'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        <h3>TODO LIST</h3>
        {filteredTodos.length === 0 ? (
          <div>No todos found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>{todo.priority}</td>
                  <td>{todo.category}</td>
                  <td>
                    <button onClick={() => handleEdit(todo)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
