# AttenTrack Backend - System Flow Diagram

## Overview
This document describes the flow of WebSocket connections and REST API endpoints in the AttenTrack attendance tracking system.

---

## System Architecture Flow

```mermaid
graph TB
    subgraph Clients["Client Applications"]
        Teacher["Teacher App"]
        Student["Student App"]
        Admin["Admin App"]
    end
    
    subgraph ServerGroup["Express Server + WebSocket Server"]
        Server["HTTP/WebSocket Server<br/>Port: 3000"]
        WSS["WebSocket Server"]
        Express["Express App"]
    end
    
    subgraph WSMsg["WebSocket Message Types"]
        TimeUpdate["time_update<br/>Broadcasts time, location, range"]
        Attendance["attendance<br/>Broadcasts rollNumber"]
        TeacherLoc["teacherLoc<br/>Broadcasts location, range"]
        FirstCall["first_call<br/>Broadcasts first_call signal"]
    end
    
    subgraph REST["REST API Endpoints"]
        SetAttendance["POST /setAttendance"]
        GetAttendance["GET /getAttendance"]
        StudentRoutes["/api/student/*"]
        TeacherRoutes["/api/teacher/*"]
        AttendanceRoutes["/api/attendance/*"]
        ClassRoutes["/api/class/*"]
        SuperAdminRoutes["/api/superadmin/*"]
    end
    
    subgraph DBGroup["Database"]
        DB[("MongoDB")]
    end
    
    Teacher -->|WebSocket| WSS
    Student -->|WebSocket| WSS
    Admin -->|WebSocket| WSS
    
    Teacher -->|REST API| Express
    Student -->|REST API| Express
    Admin -->|REST API| Express
    
    WSS -->|Broadcasts| TimeUpdate
    WSS -->|Broadcasts| Attendance
    WSS -->|Broadcasts| TeacherLoc
    WSS -->|Broadcasts| FirstCall
    
    Express --> SetAttendance
    Express --> GetAttendance
    Express --> StudentRoutes
    Express --> TeacherRoutes
    Express --> AttendanceRoutes
    Express --> ClassRoutes
    Express --> SuperAdminRoutes
    
    StudentRoutes --> DB
    TeacherRoutes --> DB
    AttendanceRoutes --> DB
    ClassRoutes --> DB
    SuperAdminRoutes --> DB
    
    Server --> WSS
    Server --> Express
```

---

## WebSocket Flow Diagram

```mermaid
sequenceDiagram
    participant Client as Client App
    participant WSS as WebSocket Server
    participant AllClients as All Connected Clients
    
    Note over Client,AllClients: WebSocket Connection Established
    Client->>WSS: WebSocket Connection Request
    WSS->>Client: Connection Accepted
    
    Note over Client,AllClients: Message Type: time_update
    Client->>WSS: type: time_update, time, location, range
    WSS->>AllClients: Broadcast type: time_update2, time, location, range
    
    Note over Client,AllClients: Message Type: attendance
    Client->>WSS: type: attendance, rollNumber
    WSS->>AllClients: Broadcast type: attendance2, rollNumber
    
    Note over Client,AllClients: Message Type: teacherLoc
    Client->>WSS: type: teacherLoc, location, range
    WSS->>AllClients: Broadcast type: teacherLoc, location, range
    
    Note over Client,AllClients: Message Type: first_call
    Client->>WSS: type: first_call
    WSS->>AllClients: Broadcast type: first_call
    
    Note over Client,AllClients: Connection Closed
    Client->>WSS: Close Connection
    WSS->>WSS: Log Client disconnected
```

---

## REST API Endpoints Flow

```mermaid
graph LR
    subgraph Core["Core Attendance Endpoints"]
        A["POST /setAttendance"] -->|Sets State| B["GET /getAttendance"]
    end
    
    subgraph Student["Student Routes /api/student"]
        S1["POST /register"]
        S2["POST /verify-otp"]
        S3["POST /login"]
        S4["POST /otp-generate"]
        S5["GET /token-login"]
        S6["GET /classes-info/:id"]
        S7["POST /attendance"]
        S8["GET /attendance/:rollNumber"]
        S9["POST /forgot"]
        S10["POST /change"]
        S11["PUT /update"]
    end
    
    subgraph Teacher["Teacher Routes /api/teacher"]
        T1["POST /register"]
        T2["POST /verify-otp"]
        T3["POST /otp-generate"]
        T4["POST /login"]
        T5["GET /token-login"]
        T6["GET /classes-info/:id"]
        T7["POST /records"]
        T8["POST /forgot"]
        T9["POST /change"]
        T10["PUT /update"]
        T11["POST /overall-records"]
    end
    
    subgraph Attendance["Attendance Routes /api/attendance"]
        A1["POST /createAttendance"]
        A2["GET /specific-record"]
        A3["PATCH /change-specific-record"]
        A4["DELETE /delete-record"]
    end
    
    subgraph Other["Other Routes"]
        C["/api/class/*"]
        SA["/api/superadmin/*"]
    end
```

---

## Complete Attendance Flow (WebSocket + REST)

```mermaid
sequenceDiagram
    participant Teacher as Teacher App
    participant Server as Express Server
    participant WSS as WebSocket Server
    participant Students as Student Apps
    participant DB as Database
    
    Note over Teacher,DB: Initial Setup
    Teacher->>Server: POST /setAttendance
    Note right of Teacher: Body: otp, time, id
    Server->>Server: Store currentOTP, finalTime, currentId
    Server->>Teacher: OTP and Final Time set
    
    Note over Teacher,DB: WebSocket Communication
    Teacher->>WSS: type: time_update
    Note right of Teacher: time, location, range
    WSS->>Students: Broadcast time_update2
    
    Teacher->>WSS: type: teacherLoc
    Note right of Teacher: location, range
    WSS->>Students: Broadcast teacherLoc
    
    Teacher->>WSS: type: first_call
    WSS->>Students: Broadcast first_call
    
    Note over Teacher,DB: Student Attendance Marking
    Students->>Server: POST /api/student/attendance
    Note right of Students: rollNumber, otp, etc.
    Server->>DB: Save attendance record
    Students->>WSS: type: attendance
    Note right of Students: rollNumber
    WSS->>Teacher: Broadcast attendance2
    
    Note over Teacher,DB: Retrieving Attendance Data
    Teacher->>Server: GET /getAttendance
    Server->>Teacher: currentOTP, finalTime, currentId
    
    Teacher->>Server: GET /api/attendance/specific-record
    Server->>DB: Query attendance records
    DB->>Server: Return records
    Server->>Teacher: Attendance data
```

---

## WebSocket Message Types Reference

| Message Type (Incoming) | Broadcast Type (Outgoing) | Data Broadcasted | Purpose |
|------------------------|---------------------------|------------------|---------|
| `time_update` | `time_update2` | `time`, `location`, `range` | Broadcasts attendance session time and location details |
| `attendance` | `attendance2` | `rollNumber` | Notifies all clients when a student marks attendance |
| `teacherLoc` | `teacherLoc` | `location`, `range` | Broadcasts teacher's current location and range |
| `first_call` | `first_call` | (no data) | Signals the start of attendance session |

---

## REST API Endpoints Reference

### Core Attendance Endpoints
- **POST** `/setAttendance` - Sets global attendance state (OTP, time, ID)
- **GET** `/getAttendance` - Retrieves current attendance state

### Student Routes (`/api/student`)
- **POST** `/register` - Student registration
- **POST** `/verify-otp` - OTP verification
- **POST** `/login` - Student login
- **POST** `/otp-generate` - Generate OTP
- **GET** `/token-login` - Token-based login
- **GET** `/classes-info/:student_id` - Get enrolled classes
- **POST** `/attendance` - Mark attendance
- **GET** `/attendance/:rollNumber` - Get all attendance records
- **POST** `/forgot` - Forgot password
- **POST** `/change` - Change password
- **PUT** `/update` - Update student profile

### Teacher Routes (`/api/teacher`)
- **POST** `/register` - Teacher registration
- **POST** `/verify-otp` - OTP verification
- **POST** `/otp-generate` - Generate OTP
- **POST** `/login` - Teacher login
- **GET** `/token-login` - Token-based login
- **GET** `/classes-info/:teacher_id` - Get teacher's classes
- **POST** `/records` - Get attendance reports
- **POST** `/forgot` - Forgot password
- **POST** `/change` - Change password
- **PUT** `/update` - Update teacher profile
- **POST** `/overall-records` - Get overall attendance records

### Attendance Routes (`/api/attendance`)
- **POST** `/createAttendance` - Create attendance session
- **GET** `/specific-record` - Get specific attendance record
- **PATCH** `/change-specific-record` - Modify attendance record
- **DELETE** `/delete-record` - Delete attendance record

### Other Routes
- `/api/class/*` - Class management endpoints
- `/api/superadmin/*` - Super admin endpoints

---

## Key Features

1. **Real-time Communication**: WebSocket server enables real-time bidirectional communication between teacher and students
2. **Broadcast Mechanism**: All WebSocket messages are broadcasted to all connected clients
3. **State Management**: Global attendance state (OTP, time, ID) managed via REST endpoints
4. **Multi-role Support**: Separate routes for students, teachers, and super admins
5. **Authentication**: Token-based and OTP-based authentication flows
6. **Location Tracking**: Real-time location and range broadcasting for geofencing

---

## Usage Notes

- The WebSocket server runs on the same port as the HTTP server (default: 3000)
- All WebSocket messages are broadcasted to **all connected clients** (no filtering)
- The `/setAttendance` endpoint stores state in memory (not persistent across server restarts)
- CORS is configured to allow all origins (`*`)
- Swagger documentation available at `/api-docs`
