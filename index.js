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
let progressData = { time: 0, progress: 0 };

// WebSocket for OTP communication
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'otp_verification') {
      if (data.otp === currentOTP) {
        // If OTP matches, send success message to the student and broadcast to teacher
        ws.send(JSON.stringify({ type: 'verification_result', status: 'success' }));

        // Broadcast attendance update to all clients (including teacher)
        const rollNumber = '21116008';  // Example roll number
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'attendance_update', rollNumber }));
          }
        });

        console.log('OTP verified successfully, roll number 21116008 marked as present.');
      } else {
        ws.send(JSON.stringify({ type: 'verification_result', status: 'failure' }));
        console.log('OTP verification failed.');
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


// Endpoint for teacher to set OTP and time
app.post('/setAttendance', (req, res) => {
  const { otp, time } = req.body;
  currentOTP = otp;
  finalTime = time
  res.send('OTP and Final Time set');
});

// Endpoint for Student to get OTP and time
app.get('/getAttendance', (req, res) => {
  res.send({currentOTP,finalTime});
});

app.get('/', (req, res) => {
  res.send('Server is running...')
});

server.listen(3000,"0.0.0.0", () => {
  console.log('Server started on port 3000');
});
