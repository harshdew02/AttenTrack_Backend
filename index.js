const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

let currentOTP = null;
let finalTime = 1; 

// WebSocket for OTP communication
wss.on('connection', (ws) => {
  // console.log('Client connected');

  ws.on('message', (message) => {
    

  });

  ws.on('close', () => {
    // console.log('Client disconnected');
  });
});


// Endpoint for teacher to set OTP and time
app.post('/setAttendance', (req, res) => {
  const { otp, time } = req.body;
  currentOTP = otp;
  finalTime = time;
  // console.log('currentOTP POST ', currentOTP);
  // console.log('finalTime POST ', finalTime);
  res.send('OTP and Final Time set');
});

// Endpoint for Student to get OTP and time
app.get('/getAttendance', (req, res) => {
  // console.log('currentOTP GET ', currentOTP);
  // console.log('finalTime GET ', finalTime);
  res.json({currentOTP, finalTime});
});

app.get('/', (req, res) => {
  res.send('Server is running...')
});

server.listen(3000,"0.0.0.0", () => {
  console.log('Server started on port 3000');
});
