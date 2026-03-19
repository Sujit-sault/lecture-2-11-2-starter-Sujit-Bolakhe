import { Link } from 'react-router';
import { useAuth } from './authProvider';

function Navbar({ cartCount }) {
    const { isAdmin, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/">🏠 Home</Link>
            <Link to="/inventory">📚 Books</Link>
            <Link to="/magazines">📰 Magazines</Link>
            <Link to="/tickets">🎫 Tickets</Link>
            <Link to="/cart">🛒 Cart ({cartCount})</Link>

            {/* Only show Add links if user is Admin */}
            {isAdmin && (
                <>
            <Link to="/add">➕ Add Book</Link>
            <Link to="/add-magazine">➕ Add Magazine</Link>
            <Link to="/add-ticket">➕ Add Ticket</Link>
                </>
            )}

            <button onClick={logout} style={{ marginLeft: 'auto', padding: '5px 10px', cursor: 'pointer' }}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;



