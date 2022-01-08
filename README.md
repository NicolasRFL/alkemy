# alkemy

Alkemy Challenge Full Stack - Javascript

This is an application to administer a personal budget. It allows to create and edit money income and expenses. It also shows a balance of all operations registered.

## Pages

### Home page

Shows current balance and a list of the last 10 transactions registered.

### ABM

- Operation register form. This contains:
  - Concept
  - Amount 
  - Date (Leaving date blank will create the transaction with current date)
  - Type
- List of operations according to their type.
- The possibility to delete or modify a previously registered operation.

## Instructions for Test Run:

First the MySQL database and table need to be created. Run the dbase.sql script to create the database and table that will be used.

Then on a terminal stand on the server folder (/server) and run: 'node index.js'

Finally, open another terminal and standing on client folder (/client) run: 'npm start'

Do note that this project was created using node version 14.15.1 and npm version 6.14.8.

## Tecnical requirements

Used MySQL as a relational database.
Used the Express framework for the server (backend).
Used React for the client (frontend).

### Other packages used:

- Axios
- React router dom
- React table
- React bootstrap.
