const callbacks = []
function then(callback) {
    callbacks.push(callback);
}

function resolve(value) {
    callbacks.forEach((callback) => {
        const myCallback = () => console.log('HEYDAD!');
        myCallback(value)
    })
}

function fetch(url) {
  
    return new Promise((resolve, reject) => {
  // 
    // 
    // 
    // 
    // 
    //  if done:
    // 
    // 
    resolve(data)
    })
}