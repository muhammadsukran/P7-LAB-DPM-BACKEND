const List = require('../models/listadd'); // Ganti dengan model yang sesuai

class ListaddController {
    // Fungsi untuk menambah item ke dalam daftar
    async createListItem(req, res) {
        const { title, description, videoLink } = req.body;
        const userId = req.user.id;

        try {
            const newListItem = new List({
                title,
                description,
                videoLink,
                userId,
            });
            await newListItem.save();
            res.status(201).json({ message: 'List item created successfully', data: newListItem });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    // Fungsi untuk mengambil semua item dalam daftar
    async getListItems(req, res) {
        const userId = req.user.id;
        try {
            const listItems = await List.find({ userId });
            res.status(200).json({ data: listItems });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    // Fungsi untuk mengambil item daftar berdasarkan ID
    async getListItemById(req, res) {
        const { id } = req.params;
        try {
            const listItem = await List.findById(id);
            if (!listItem) {
                return res.status(404).json({ message: 'List item not found' });
            }
            res.status(200).json({ data: listItem });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    // Fungsi untuk memperbarui item daftar berdasarkan ID
    async updateListItemById(req, res) {
        const { id } = req.params;
        const { title, description, videoLink } = req.body;

        try {
            const updatedListItem = await List.findByIdAndUpdate(
                id,
                { title, description, videoLink },
                { new: true }
            );
            if (!updatedListItem) {
                return res.status(404).json({ message: 'List item not found' });
            }
            res.status(200).json({ message: 'List item updated successfully', data: updatedListItem });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    // Fungsi untuk menghapus item daftar berdasarkan ID
    async deleteListItemById(req, res) {
        const { id } = req.params;
        try {
            const deletedListItem = await List.findByIdAndDelete(id);
            if (!deletedListItem) {
                return res.status(404).json({ message: 'List item not found' });
            }
            res.status(200).json({ message: 'List item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = new ListaddController();
