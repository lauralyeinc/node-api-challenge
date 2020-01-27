const express = require('express');
const helmet = require('helmet');

const projectRouter = require('./projects/projectsRouter.js');


const server = express();

server.use(express.json());
server.use(helmet());

server.use("/api/projects", projectRouter); 

server.get('/', (req, res) => {
    res.send(`
    <h1> 👩‍💻 Hello from Express with Express Routing, Let's code! 👸 </h1>`);
});

module.exports = server; 