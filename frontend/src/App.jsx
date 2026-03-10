// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import Navbar from './NavBar'
import Home from './Home'
import Book from './Book'
import BookForm from './BookForm'
import Magazine from './Magazine'
import MagazineForm from './MagazineForm'
import './App.css'

function App() {
    const [books, setBooks] = useState([]);
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch both datasets concurrently
    useEffect(() => {
        Promise.all([
            fetch('/api/rest/books').then(res => res.json()),
            fetch('/api/rest/magazines').then(res => res.json())
        ])
            .then(([booksData, magazinesData]) => {
                setBooks(booksData);
                setMagazines(magazinesData);
                setLoading(false);
            });
    },[]);

    /* --- Book Handlers --- */
    const handleAddBook = (newBook) => setBooks([...books, newBook]);
    const handleDeleteBook = (id) => {
        if (!window.confirm("Delete this book?")) return;
        fetch(`/api/rest/books/${id}`, { method: 'DELETE' })
            .then(res => { if (res.ok) setBooks(books.filter(b => b.id !== id)); });
    };
    const handleUpdateBook = (id, updatedData) => {
        fetch(`/api/rest/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
            .then(res => res.json())
            .then(savedBook => setBooks(books.map(b => (b.id === id ? savedBook : b))));
    };

    /* --- Magazine Handlers --- */
    const handleAddMagazine = (newMag) => setMagazines([...magazines, newMag]);
    const handleDeleteMagazine = (id) => {
        if (!window.confirm("Delete this magazine?")) return;
        fetch(`/api/rest/magazines/${id}`, { method: 'DELETE' })
            .then(res => { if (res.ok) setMagazines(magazines.filter(m => m.id !== id)); });
    };
    const handleUpdateMagazine = (id, updatedData) => {
        fetch(`/api/rest/magazines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
            .then(res => res.json())
            .then(savedMag => setMagazines(magazines.map(m => (m.id === id ? savedMag : m))));
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="app-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <Navbar />

            <Routes>
                {/* 1. The Home Page */}
                <Route path="/" element={<Home />} />

                {/* 2. Book Inventory */}
                <Route path="/inventory" element={
                    <div className="book-list">
                        <h1>Current Books</h1>
                        {books.map((b) => (
                            <Book key={b.id} {...b} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} />
                        ))}
                    </div>
                } />

                {/* 3. Magazine Inventory */}
                <Route path="/magazines" element={
                    <div className="magazine-list">
                        <h1>Current Magazines</h1>
                        {magazines.map((m) => (
                            <Magazine key={m.id} {...m} onDelete={handleDeleteMagazine} onUpdate={handleUpdateMagazine} />
                        ))}
                    </div>
                } />

                {/* 4. Add Book Form */}
                <Route path="/add" element={
                    <div>
                        <h1>Add to Library</h1>
                        <BookForm onBookAdded={handleAddBook} />
                    </div>
                } />

                {/* 5. Add Magazine Form */}
                <Route path="/add-magazine" element={
                    <div>
                        <h1>Add to Library</h1>
                        <MagazineForm onMagazineAdded={handleAddMagazine} />
                    </div>
                } />
            </Routes>
        </div>
    )
}

export default App;