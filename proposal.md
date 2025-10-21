# ECE1779 Project Proposal

# **Motivation**

## The Problem

- Dog ownership naturally encourages social interaction among pets and their owners, yet maintaining these connections beyond the first meeting remains challenging. Most dog owners struggle to organize repeat playdates because there is no convenient and privacy-respecting way to reconnect after initial encounters.
- Existing social platforms are not designed for short, location-based interactions and often require sharing personal information, which many owners find uncomfortable. As a result, even when dogs get along, owners lose contact. Busy schedules and conflicting routines further complicate coordination, causing potential friendships and play opportunities to fade.
- This gap limits socialization and exercise for dogs and reduces opportunities for owners to build community connections. There is currently no dedicated platform that balances accessibility, safety, and trust while allowing dog owners to easily maintain relationships formed through shared pet interactions.

## Why is the project worth pursuing?

- This project is motivated by a real and relatable need to help dog owners and their pets sustain meaningful connections in a safe, convenient, and privacy-conscious way. In increasingly urbanized and digitally dependent environments, such a solution promotes both community building and pet well-being.
- It also serves as a practical opportunity to apply cloud computing concepts to a real-world social issue. By using technologies such as Docker, PostgreSQL, Redis, and Kubernetes or Fly.io, the project demonstrates how containerized, privacy-first systems can support genuine, local human interaction.
- Ultimately, the project merges social impact with technical innovation, showcasing how thoughtful, cloud-based design can enhance both community engagement and quality of life for dog owners and their pets.

## Target Users

- **Dog Owners in Urban/Suburban Areas:**
    
    Individuals who want a simple and privacy-friendly way to connect with nearby owners for dog playdates.
    
- **New Dog Owners:**
    
    Users seeking opportunities for their pets to socialize and learn through safe, local meetups.
    
- **Socially Active Pet Owners:**
    
    People who enjoy meeting other owners and value community engagement through shared dog activities even if they do not own a pet themselves
    

# **Objective**

The objective of this project is to develop a cloud-based Software-as-a-Service (SaaS) platform that allows dog owners to easily find, connect with, and organize playdates with nearby owners in a secure and privacy-conscious way. The system will enable users to create dog profiles, view nearby matches using geolocation services, and communicate through in-app features without sharing personal contact information. By leveraging containerized technologies such as Docker, PostgreSQL, Redis, and Kubernetes the platform will ensure scalability, reliability, and data persistence, while deployment on cloud platforms like [Fly.io](http://fly.io/) or DigitalOcean will provide high availability and efficient resource management. Ultimately, this project aims to promote both dog and owner socialization, foster community connections, and demonstrate how cloud-based applications can deliver meaningful, real-world solutions that balance functionality, user trust, and technological innovation.

# **Key Features**

```
*** must have
**  should have
*   nice to have
```

## Orchestration

The project leverages **Kubernetes** for container orchestration to manage and coordinate multiple backend microservices such as authentication, chat, and playdate management. Each service is packaged as a Docker container and deployed as a Kubernetes Pod.

Kubernetes handles **service discovery**, **load balancing**, and **automatic scaling** of containers, ensuring high availability and resilience.

By deploying Kubernetes on **Fly.io**, the project benefits from:

- **Simplified deployment of the cluster** across global Fly.io regions.
- **Centralized configuration and security management** for credentials and environment variables.
- **Horizontal Pod Autoscaling (HPA)** to dynamically adjust resource usage based on user traffic. ( *** )

This orchestration approach enables modular development, robust fault tolerance, and efficient scaling as user demand fluctuates. We decided to go with Kubernetes because [Fly.io](http://Fly.io) supports it as per [https://fly.io/docs/kubernetes/](https://fly.io/docs/kubernetes/) documentation. ( *** )

## Database schema

- Table for user session management ( *** )
- User profiles ( *** )
    
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255), -- null for OAuth users
        user_profile_pic_path TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        location_updated_at TIMESTAMP
    );
    
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_location ON users(location_lat, location_lng);
    ```
    
- Pet profiles ( *** )
    
    ```sql
    CREATE TABLE pets (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        breed VARCHAR(100),
        age INTEGER, -- in months
        gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
        size VARCHAR(20) CHECK (size IN ('small', 'medium', 'large')),
        pet_profile_pic_path TEXT,
        intro TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT TRUE
    );
    
    CREATE INDEX idx_pets_owner ON pets(owner_id);
    ```
    
- Playdates ( ** )
    
    ```sql
    CREATE TABLE playdates (
        id SERIAL PRIMARY KEY,
        organizer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200),
        scheduled_time TIMESTAMP NOT NULL,
        location_name VARCHAR(255),
        location_lat DECIMAL(10, 8) NOT NULL,
        location_lng DECIMAL(11, 8) NOT NULL,
        status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled', 'archived')),
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX idx_playdates_time ON playdates(scheduled_time);
    CREATE INDEX idx_playdates_status ON playdates(status);
    ```
    
- Playdate Participants ( ** )
    
    ```sql
    CREATE TABLE playdate_participants (
        id SERIAL PRIMARY KEY,
        playdate_id INTEGER REFERENCES playdates(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(playdate_id, user_id, pet_id)
    );
    
    CREATE INDEX idx_participants_playdate ON playdate_participants(playdate_id);
    CREATE INDEX idx_participants_user ON playdate_participants(user_id);
    ```
    
- Session ( *** )
    
    ```sql
    CREATE TABLE user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(512) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
    );
    
    CREATE INDEX idx_sessions_user ON user_sessions(user_id);
    CREATE INDEX idx_sessions_token ON user_sessions(session_token);
    ```
    
- Messages ( ** )
    
    ```sql
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX idx_messages_sender ON messages(sender_id);
    CREATE INDEX idx_messages_recipient ON messages(recipient_id);
    ```
    

## Front-end Stack

The frontend is built using **React**, chosen for its component-driven architecture, flexibility, and integration with modern UI libraries. React also has a huge developer community support due to which it has a rich collection of libraries which can be leveraged for this project.

Key aspects:

- **Responsive user interface:** Designed to work seamlessly across desktop and mobile devices.
- **Geolocation and real-time data integration:** Uses browser geolocation APIs and WebSocket connections (via Socket.IO) to display nearby playdates and chat features in real time.
- **API-driven architecture:** Communicates with backend microservices through secure REST or WebSocket endpoints managed by Kubernetes.
- **Containerized deployment:** The React app is built into a lightweight Docker image and deployed alongside backend services in the Fly.io Kubernetes cluster.

This stack ensures fast rendering, scalability, and a smooth user experience across devices and regions.

## Persistent Storage

- Any image files uploaded by users will be stored in Fly Volume ( *** )
- PSQL data stored in Fly Docker volume ( *** )
- Redis persistent storage ( * )

## Deployment Provider

The application is deployed using **Fly.io** as the primary cloud provider because of the following reasons: 

- It supports **Kubernetes deployment** directly through its distributed infrastructure.
- Provides **edge deployment** automatically running the app close to users around the world to minimize latency.
- Offers **persistent volumes** for PostgreSQL databases and media storage (e.g., pet profile pictures).
- Integrates **global load balancing** and **autoscaling** for efficient resource utilization.
- Enables **secure secrets management** using `fly secrets set`, synced with Kubernetes Secrets.

**Outcome:**

By leveraging Fly.io’s edge infrastructure, the platform achieves global availability, reduced latency for real-time chat and location services, and high fault tolerance essential for a social app with geographically distributed users.

We are aiming to include frontend deployment and database utilization`Fly Volumes` on [Fly.io](http://Fly.io) so that it runs closer to users, serving fast UIs where backend API calls are routed to the Kubernetes cluster. Monitoring stack, such as Grafana, shall be deployed inside the Kubernetes cluster( ** )

## Monitoring

- Planned advanced features (at least two)
    - Real-time functionality (real-time location sharing with socket IO & redis)
    - Security enhancements (auth sso) - must have with profile picture and email permissions
    - Email notification (upcoming playdate notification to user) - good to have
    
    **Monitoring Strategy:**
    
    - **Kubernetes-native metrics:** CPU, memory, and disk usage are tracked using tools like **Prometheus** and visualized in **Grafana dashboards**. ( *** )
    - **Fly.io metrics:** Deployment-level statistics such as instance health, scaling activity, and regional uptime are monitored through Fly.io’s built-in observability tools.
    - **Application health checks:** Each service exposes a `/health` endpoint that Kubernetes uses for liveness and readiness probes. ( *** )
    - **Log aggregation:** Centralized logging captures API requests, errors, and system events for easier debugging and performance tuning.
    - System monitoring is implemented at both the **application** and **infrastructure** levels to maintain reliability and performance.
    
    This layered monitoring approach ensures that potential issues are detected early, supporting high availability and consistent performance.
    

## Security

- Password Authentication ( *** )
    - Limited attempt - 5 attempts per 15 minutes
    - Account lockout after 10 failed attempts
- Role-Based Access Control ( *** )
    - Roles: user, admin
    - Users modify their own data only
- Secrets management ( ** )
    - Database credentials via fly secrets set
    - JWT signing keys
- Input Validation ( ** )
    - Parameterized SQL queries to prevent injection
    - Limited access - 30 requests/minute per user
    - File upload validation of type and size

## Auto-scaling

- The project uses **Kubernetes Horizontal Pod Autoscaling (HPA)** and **Fly.io’s built-in autoscaling** features to dynamically adjust resources based on real-time demand. ( ** )

**Implementation details:**

- **Pod-level scaling:** Kubernetes automatically increases or decreases the number of Pods for each microservices (e.g., chat-service or playdate-service) depending on CPU/memory utilization.
- **Regional scaling:** Fly.io deploys multiple instances of the app across different geographic regions, spinning up additional VMs as global traffic increases.
- **Database scaling:** PostgreSQL and Redis instances are configured with read replicas to handle higher read traffic during peak times (e.g., weekends).
- **Autoscaling policy:** Defined in Fly.io configuration (`fly.toml`) with resource thresholds and cooldown intervals to prevent over-scaling.

**Result:**

This dual-level autoscaling ensures efficient resource utilization, low latency for users worldwide, and cost-effective operation without manual intervention.

## Fault Tolerance

- Database High Availability ( *** )
    - Primary storage and replicas
    - Automated daily backups
- Application Health Checks ( ** )
    - /health endpoint as liveness probes
    - Automatic container restart on failure

## Edge-specific optimizations

- Deploying the solution on Fly.io ensures low latency by leveraging its local regional deployment model ( *** )

# **Tentative Plan**

The implementation will be collaborated on by four developers, with a five-week development cycle. 

| Week | Focus | Key Deliverable |
| --- | --- | --- |
| 1 | Planning & Environment Setup | Docker Compose + Database ready |
| 2 | Backend Core Development | Auth, User, Pet, Playdate APIs |
| 3 | Frontend Integration | React app with maps & real-time updates |
| 4 | Deployment & Orchestration | Kubernetes + [Fly.io](http://fly.io/) deployment |
| 5 | Security & Demo | RBAC, monitoring, final presentation |

---

## Team Member Responsibilities

### **Daniel – Authentication & Deployment**

Responsible for implementing **user authentication integration**, managing **system-wide integration, testing, and deployment**. Oversees secure access, API verification, and production rollout.

**Deliverable:** Fully functional authentication system and stable cloud deployment.

---

### **Yiqi – Real-Time & Data Integration**

Handles **WebSocket and Redis integration** for live communication and location updates. Manages **User, Pet, and Playdate API integration**, ensuring smooth real-time synchronization and backend connectivity.

**Deliverable:** Working real-time data flow and seamless API integration across services.

---

### **Hanxiao – Backend & Frontend Optimization**

Leads development of **backend core APIs and services** while improving **frontend performance and UI refinements**. Ensures efficient API logic, validated data handling, and responsive user interfaces.

**Deliverable:** Robust backend architecture, and optimized user-friendly interface.

---

### **Tanvi – Frontend & Orchestration**

Responsible for **React frontend integration** and **containerization/orchestration** of services. Ensures frontend deployment works seamlessly with backend microservices through Kubernetes or Fly.io.

**Deliverable:** Fully integrated and containerized frontend running reliably in the cloud.

---

Apart from these main roles we all shall be engaging in regular team sync ups and also help one another in implementing and improving our application. 

###