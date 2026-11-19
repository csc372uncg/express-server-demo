import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './books.css';
function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [read, setRead] = useState(false);
  const [type, setType] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/api/books`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, author, read, type })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    navigate('/books');
  };

  return (
    <form onSubmit={handleSubmit} id="book-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
      />
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Type"
      />
      <input
        type="checkbox"
        checked={read}
        onChange={(e) => setRead(e.target.checked)}
      />
      <label>Is Read</label>
      <button type="submit">Create Book</button>
    </form>
  );
}

export default BookForm;