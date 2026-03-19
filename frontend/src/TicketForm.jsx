import { useState } from 'react';

function TicketForm({ onTicketAdded, api }) {
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTicket = {
            description: description,
            price: parseFloat(price) || 0.0
        };

        try {
            const res = await api.post('/tickets', newTicket);
            alert("Ticket successfully saved!");
            onTicketAdded(res.data);
            setDescription('');
            setPrice('');
        } catch (err) {
            console.error("Save Error:", err.response?.data || err.message);
            alert("Failed to save ticket. Check console for errors.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ border: '2px solid green', padding: '20px' }}>
            <h3>Add New Ticket</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Event Description (e.g., Concert - Taylor Swift)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}>
                    Save Ticket
                </button>
            </div>
        </form>
    );
}

export default TicketForm;