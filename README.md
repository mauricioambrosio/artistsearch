The steps below must be completed using the windows command line interface

To run this software on your local machine do the following:

1. Download and install node.js from https://nodejs.org/en/download/.

2. Clone the repository to your local machine.

3. Set the environment variable for the mongo db url to be accessed by the backend:

   a Set for the current session:
   a.i. set ARTIST_SEARCH_DB="mongodb+srv://artistsearch-user:VQXPNr8HRbzZwQjf@cluster0.wiqkg.mongodb.net/artistsearch?retryWrites=true&w=majority";

   OR

   b. Set permanently (recommended):
   b.i. setx ARTIST_SEARCH_DB "mongodb+srv://artistsearch-user:VQXPNr8HRbzZwQjf@cluster0.wiqkg.mongodb.net/artistsearch?retryWrites=true&w=majority";
   b.ii. restart terminal.

   NOTE:
   Normally I would not share this mongodb connection string on github because it contains database secrets. I am only doing so to allow anyone to reproduce the
   system just from reading the README file. Nevertheless, the user in this connection string only has read permissions on the database.

4. Start the backend server:
   a. Open the directory artistsearch-backend.

   b. Install the necessary modules if they are not available:
   b.i. npm install config;
   b.ii. npm install cors;
   b.iii. npm install express;
   b.iv. npm install mongoose;
   b.v. npm install underscore.

   c. Generate the folder node_modules with the project dependencies by running the command: npm install.
   d. start the server by running the command: node index.js.

5. Start the frontend server:
   a. Open the directory artistsearch-frontend

   b. Install the necessary modules if they are not available:
   b.i. npm install axios;
   b.ii. npm install react-router-dom.

   c. Generate the folder node_modules with the project dependencies by running the command: npm install.
   d. start the server by running the command: npm start.
