const http = require("http");
const net = require("net");
const {Throttle, ThrottleGroup} = require("stream-throttle");

const maxBandwidth = 100;
// an example 5MB file of random data
const str = "http://212.183.159.230/5MB.zip";


// this pipes an instance of Throttle
class SlowAgent extends http.Agent {
    createConnection(options, callback){
        const socket = new net.Socket(options);
        socket.pipe(new Throttle({rate: maxBandwidth}));
        socket.connect(options);
        return socket;
    }
}

const options = {
    // this should slow down the request
    agent: new SlowAgent()
};

const time = Date.now();
const req = http.request(str, options, (res) => {
    res.on("data", () => {
    });
    res.on('end', () => {
        console.log("Done! Elapsed time: " + (Date.now() - time) + "ms");
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.on("end", () => {
    console.log("done");
});

console.log("Request started");
req.end();