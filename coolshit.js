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









//promises:

let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve runs the first function in .then
promise.then(
  resulto => alert(resulto), // shows "done!" after 1 second - first function is got success
  error => alert(error) // doesn't run - 2nd function is for error
);


fetch('/article/promise-chaining/user.json')
  // .then below runs when the remote server responds
  .then(function(response) {
    // response.text() returns a new promise that resolves with the full response text
    // when it loads
    return response.text();
  })
  .then(function(text) {
    // ...and here's the content of the remote file
    alert(text); // {"name": "iliakan", "isAdmin": true}
  });
