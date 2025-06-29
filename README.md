# PostMinder - Instagram Post Scheduling App

PostMinder is a web application that allows users to schedule Instagram posts conveniently. It is built using a combination of modern technologies including Vite, Vue.js, PostgreSQL, Express.js, BullMQ, and Redis.

## Features

- Schedule Instagram posts for future dates.
- Manage and edit scheduled posts.
- User-friendly interface built with Vue.js.
- Efficient job processing using BullMQ and Redis.
- Data storage and retrieval using PostgreSQL.

## Technologies Used

- [Vite](https://vitejs.dev/) - Build tool and development server.
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework.
- [PostgreSQL](https://www.postgresql.org/) - Open-source relational database system.
- [Express.js](https://expressjs.com/) - Web application framework for Node.js.
- [BullMQ](https://docs.bullmq.io/) - Advanced Node.js job and message queue.
- [Redis](https://redis.io/) - In-memory data structure store.

## Pre-requisite

- [Docker](https://www.docker.com/) Installed and Docker Engine running on your local machine

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/sidmandirwala/PostMinder.git
   ```

2. Navigate to the project directory:

   ```sh
   cd PostMinder
   ```
3. This project uses `.env` files for configuration. To set up your environment:

   **Required `.env` Files**:
   - **Root `.env`**: Located at the project root.
   - **Server `.env`**: Located in the `server/` directory.
   - `BullMQ/.env` file is preconfigured and does not require changes for standard use.

   **Use `.example-env` Files**:
   - Each `.env` file has a corresponding `.example-env` file to guide setup.
   - Copy the templates and rename them to `.env`:
     ```bash
     cp .example-env .env
     cp server/.example-env server/.env
     ```

   **Populate `.env` Files**:
   - Fill the required values based on your application setup.

3. Start the application using Docker Compose:

   ```sh
   docker compose up
   ```

   This command will set up the required services including the database and Redis queue.
   After this step, you can access the application

4. Access the application in your web browser at `https://localhost:8080`.

## Future Plane

- Add Carousal option for posts
- Add option to post videos, reels and stories
- Add option to post on Facebook Pages

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Make your changes and commit them.
4. Push the changes to your fork.
5. Create a pull request describing your changes.

----

Happy scheduling with PostMinder! 📅✨
