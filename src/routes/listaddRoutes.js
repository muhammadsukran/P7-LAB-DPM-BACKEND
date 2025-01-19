const express = require('express');
const ListaddController = require('../controllers/listaddController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

/**
 * @typedef {object} ListRequest
 * @property {string} title.required - Title of the item
 * @property {string} description - Description of the item
 * @property {string} videoLink.required - Link to the video associated with the item
 */

/**
 * POST /api/listadd/add
 * @summary Create a new list item
 * @tags List
 * @param {ListRequest} request.body.required - List item info
 * @return {object} 201 - List item created successfully
 * @return {object} 400 - Validation error
 * @return {object} 500 - Server error
 */
router.post('/add', authMiddleware, ListaddController.createListItem);

/**
 * GET /api/listadd
 * @summary Get all list items
 * @tags List
 * @return {object} 200 - List of all list items
 * @return {object} 500 - Server error
 */
router.get('/', authMiddleware, ListaddController.getListItems);

/**
 * GET /api/listadd/{id}
 * @summary Get a specific list item by ID
 * @tags List
 * @param {string} id.path.required - List item ID
 * @return {object} 200 - List item data
 * @return {object} 404 - List item not found
 * @return {object} 500 - Server error
 */
router.get('/:id', authMiddleware, ListaddController.getListItemById);

/**
 * PUT /api/listadd/up/{id}
 * @summary Update a list item by ID
 * @tags List
 * @param {string} id.path.required - List item ID
 * @param {ListRequest} request.body.required - Updated list item info
 * @return {object} 200 - List item updated successfully
 * @return {object} 400 - Validation error
 * @return {object} 404 - List item not found
 * @return {object} 500 - Server error
 */
router.put('/up/:id', authMiddleware, ListaddController.updateListItemById);

/**
 * DELETE /api/listadd/del/{id}
 * @summary Delete a list item by ID
 * @tags List
 * @param {string} id.path.required - List item ID
 * @return {object} 200 - List item deleted successfully
 * @return {object} 404 - List item not found
 * @return {object} 500 - Server error
 */
router.delete('/del/:id', authMiddleware, ListaddController.deleteListItemById);

router.post('/upload', authMiddleware, upload.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
  
      // Path file yang disimpan di server
      const filePath = `/uploads/videos/${req.file.filename}`;
  
      res.status(201).json({
        success: true,
        message: 'Video uploaded successfully',
        filePath,
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  });
module.exports = router;