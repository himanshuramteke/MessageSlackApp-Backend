import cors from 'cors'
import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js'; 
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import ChannelSocketHandler from './controllers/channelSocketController.js';
import MessageSocketHandler from './controllers/messageSocketControllers.js';
import { verifyEmailController } from './controllers/workspaceController.js';
import apiRouter from './routes/apiRouter.js'

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/verify/:token', verifyEmailController);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong!'
  });
});

io.on('connection', (socket) => {
   console.log('a user is connected', socket.id);
   MessageSocketHandler(io, socket);
   ChannelSocketHandler(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
  connectDB();
});
