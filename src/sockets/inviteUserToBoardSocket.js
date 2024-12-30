export const inviteUserToBoardSocket = (socket) => {
  // InviteBoardUser.jsx emit event to server
  socket.on('invite-user-to-board', (invitation) => {
    // Send invitation to all users except the sender
    socket.broadcast.emit('invite-user-to-board', invitation);
  });
};