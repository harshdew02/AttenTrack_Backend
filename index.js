const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const dotenv = require('dotenv').config();

const connectDB = require('./config/connectdb');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


connectDB();

const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

let currentOTP = null;
let finalTime = 1; 

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'time_update') {
      // console.log(`Time update: ${data.time}`);
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'time_update2', time: data.time }));
        }
      });
    }else if(data.type === 'attendance'){
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'attendance2', rollNumber: data.rollNumber }));
        }
      });
    }
    if(data.type==='first_call'){
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'first_call' }));
        }
      });
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


app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));


server.listen(3000,"0.0.0.0", () => {
  console.log('Server started on port 3000');
});
