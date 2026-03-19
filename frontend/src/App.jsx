import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import axios from 'axios'
import { useAuth } from './authProvider'
import Navbar from './NavBar'
import Home from './Home'
import Book from './Book'
import BookForm from './BookForm'
import Magazine from './Magazine'
import MagazineForm from './MagazineForm'
import Cart from './Cart'
import Ticket from './Ticket'
import TicketForm from './TicketForm'
import Login from './Login'
import './App.css'

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    const [books, setBooks] = useState([]);
    const [magazines, setMagazines] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token, isAdmin } = useAuth();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadInitialData = async () => {
            try {
                const [booksRes, magsRes, ticketsRes, cartRes] = await Promise.all([
                    axios.get('/api/rest/books'),
                    axios.get('/api/rest/magazines'),
                    axios.get('/api/rest/tickets'),
                    axios.get('/api/rest/cart')
                ]);
                setBooks(booksRes.data);
                setMagazines(magsRes.data);
                setTickets(ticketsRes.data);
                setCartCount(cartRes.data.products.length);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load data", err);
                setLoading(false);
            }
        };
        loadInitialData();
    }, [token]);

    const handleAddToCart = async (productId) => {
        try {
            const res = await axios.post(`/api/rest/cart/add/${productId}`);
            setCartCount(res.data.products.length);
            alert("Added to cart!");
        } catch (err) {
            alert("Error adding to cart");
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm("Delete book?")) return;
        await axios.delete(`/api/rest/books/${id}`);
        setBooks(books.filter(b => b.id !== id));
    };

    const handleUpdateBook = async (id, data) => {
        const res = await axios.put(`/api/rest/books/${id}`, data);
        setBooks(books.map(b => b.id === id ? res.data : b));
    };

    if (loading && token) return <h2>Loading Bookstore...</h2>;

    return (
        <div className="app-container">
            {token && <Navbar cartCount={cartCount} />}
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

                <Route path="/inventory" element={
                    <ProtectedRoute>
                        <div className="book-list">
                            <h1>Books</h1>
                            {books.map(b => (
                                <Book key={b.id} {...b}
                                      onDelete={handleDeleteBook}
                                      onUpdate={handleUpdateBook}
                                      onAddToCart={handleAddToCart}
                                      isAdmin={isAdmin} />
                            ))}
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/magazines" element={
                    <ProtectedRoute>
                        <div className="magazine-list">
                            <h1>Magazines</h1>
                            {magazines.map(m => (
                                <Magazine key={m.id} {...m}
                                          onAddToCart={handleAddToCart}
                                          onDelete={(id) => axios.delete(`/api/rest/magazines/${id}`).then(() => setMagazines(magazines.filter(mag => mag.id !== id)))}
                                          onUpdate={(id, data) => axios.put(`/api/rest/magazines/${id}`, data).then(res => setMagazines(magazines.map(mag => mag.id === id ? res.data : mag)))}
                                          isAdmin={isAdmin} />
                            ))}
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/tickets" element={
                    <ProtectedRoute>
                        <div className="ticket-list">
                            <h1>Tickets</h1>
                            {tickets.map(t => (
                                <Ticket key={t.id} {...t}
                                        onAddToCart={handleAddToCart}
                                        onDelete={(id) => axios.delete(`/api/rest/tickets/${id}`).then(() => setTickets(tickets.filter(ticket => ticket.id !== id)))}
                                        onUpdate={(id, data) => axios.put(`/api/rest/tickets/${id}`, data).then(res => setTickets(tickets.map(ticket => ticket.id === id ? res.data : ticket)))}
                                        isAdmin={isAdmin} />
                            ))}
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart api={axios} onCartChange={(count) => setCartCount(count)} />
                    </ProtectedRoute>
                } />

                <Route path="/add" element={
                    <ProtectedRoute>
                        {isAdmin ? <BookForm onBookAdded={(b) => setBooks([...books, b])} api={axios} /> : <Navigate to="/" />}
                    </ProtectedRoute>
                } />

                <Route path="/add-magazine" element={
                    <ProtectedRoute>
                        {isAdmin ? <MagazineForm onMagazineAdded={(m) => setMagazines([...magazines, m])} api={axios} /> : <Navigate to="/" />}
                    </ProtectedRoute>
                } />

                <Route path="/add-ticket" element={
                    <ProtectedRoute>
                        {isAdmin ? <TicketForm onTicketAdded={(t) => setTickets([...tickets, t])} api={axios} /> : <Navigate to="/" />}
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    )
}

export default App;