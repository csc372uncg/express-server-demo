import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookForm from './BookForm';
import BookDetails from './BookDetails';
import BookList from './BookList';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books/new" element={<BookForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
