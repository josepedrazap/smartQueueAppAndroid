import openSocket from 'socket.io-client';
const socket = openSocket('http://186.64.120.140:3001');

function signal_n_nodes(cb_count_nodes) {
  socket.on('ok', function(msg) {
    if(msg[0] === '$' && msg[1] === '$' && msg[2] === '$'){
      cb_count_nodes(null, msg);
    }
  });
}

export { signal_n_nodes};
