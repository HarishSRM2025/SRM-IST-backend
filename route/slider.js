const express = require('express');
const { getAllSliders, createSlider, getSliderById, deleteSlider, updateSlider } = require('../controller/slider/slider');
const upload = require('../middleware/multer');
const router = express.Router();

router.get('/sliders',getAllSliders);
router.post('/create-slider', upload.single('image'), createSlider);
router.get('/slider/:id', getSliderById);
router.put('/update-slider/:id', upload.single('image'), updateSlider);
router.delete('/delete-slider/:id', deleteSlider);

module.exports = router;
