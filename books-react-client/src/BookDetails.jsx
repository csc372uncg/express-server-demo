import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './books.css';
function BookDetails() {
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/api/books/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    navigate('/books');
  };
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const url = `${import.meta.env.VITE_API_URL}/api/books/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div id="book-details">
        <h1>{book.title}</h1>
        <p>Author: {book.author}</p>
        <p>Type: {book.type}</p>
        <p>Is Read: {book.isRead ? 'Yes' : 'No'}</p>
        <button onClick={() => handleDelete(book.id)}>Delete Book</button>
      </div>
      <Link to="/books">Back to Book List</Link>
    </>
  );
}

export default BookDetails;