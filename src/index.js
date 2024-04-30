'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    
    
      let interval;
      // @ts-ignore
      var io = require('socket.io')(strapi.server.httpServer, {
            cors: {
              origin: "http://localhost:8080",
              methods: ["GET", "POST"]
            }
      });
      
      io.on('connection', function (socket) {
        if (interval) clearInterval(interval);
        console.log('User connected');
      
        interval = setInterval(() => io.emit('serverTime', { time: new Date().getTime() }) , 1000);
      
       socket.on('message', async (data) => {
          if (!data || Object.keys(data).length === 0 ) {
            socket.emit('error', { message: 'Message cannot be empty' });
            return; // Stop further execution
          }
          if (!data.body || data.body.trim() === '') {
            socket.emit('error', { message: 'Message body cannot be empty' });
            return; 
          }
          try {
            await strapi.service('api::message.message').createMessage(data);
            io.emit("serverMessage", data);
          } catch (error) {
            socket.emit('error', { message: 'Failed to create message', error: error.message });
            console.error('Error creating message:', error);
          }
       });
      
        socket.on('disconnect', () => {
              console.log('user disconnected');
              clearInterval(interval);
            });
        });
      
        //Make the socket global
        strapi.io = io
      }
  };


