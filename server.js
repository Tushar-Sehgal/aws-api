// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// MongoDB Atlas connection (replace with your MongoDB Atlas connection string)
const mongoURI = 'mongodb+srv://tstusharsehgal123:Y97oGYIANmR1NbZx@cluster0.l6xhj.mongodb.net/sensordata?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Target Group Health Check
app.get('/health', (req, res) => {
res.status(200).send('Healthy');
});  

// Define a schema for sensor data
const sensorSchema = new mongoose.Schema({
  type: String,
  value: Number,
  timestamp: Date,
});

// Create a model based on the schema
const Sensor = mongoose.model('Sensor', sensorSchema);

// Create new sensor data (POST)
app.post('/sensor', async (req, res) => {
  const newSensorData = new Sensor(req.body);
  try {
    const result = await newSensorData.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all sensor data (GET)
app.get('/sensor', async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.send(sensors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get specific sensor data by ID (GET)
app.get('/sensor/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) return res.status(404).send('Sensor data not found');
    res.send(sensor);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update sensor data by ID (PUT)
app.put('/sensor/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sensor) return res.status(404).send('Sensor data not found');
    res.send(sensor);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete sensor data by ID (DELETE)
app.delete('/sensor/:id', async (req, res) => {
    try {
      const sensor = await Sensor.findByIdAndDelete(req.params.id);
      if (!sensor) return res.status(404).send('Sensor data not found');
      res.send(sensor);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
