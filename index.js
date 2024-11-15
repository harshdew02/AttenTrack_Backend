const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const dotenv = require('dotenv').config();

const connectDB = require('./config/connectdb.js');
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
let index = 0;

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'time_update') {
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
        }else if(data.type === 'teacherLoc'){
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'teacherLoc', location: data.location, range:data.range }));
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


app.post('/setAttendance', (req, res) => {
  const { otp, time } = req.body;
  currentOTP = otp;
  finalTime = time;
  res.send('OTP and Final Time set');
});

app.get('/getAttendance', (req, res) => {
  res.json({currentOTP, finalTime});
});

app.post('/setIndex', (req, res) => {
  const { index } = req.body;
  index = index;
  res.send('Index Changed');
});

app.get('/getIndex', (req, res) => {
  res.json({index});
});

app.get('/', (req, res) => {
  res.send('Server is running...')
});


app.use("/api/student", require("./routes/student.routes.js"));
app.use("/api/teacher", require("./routes/teacher.routes.js"));
app.use("/api/class", require("./routes/class.routes.js"));
app.use("/api/sheet", require("./routes/sheet.routes.js"));
app.use("/api/attendance", require("./routes/attendance.routes.js"));


server.listen(PORT,"0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
