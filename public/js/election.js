const { post } = require("../../routers/vote-routes")

// Create Election Button
document.querySelector('#create-election-btn').addEventListener('click', (e) => {
    fetch("http://localhost:3000/election", {
            method: "POST",
            body: {
                name: "TYA ELE"
            }
        })
        .then(response => {
            console.log("Done");
        })
        .catch(err => {
            console.log("Failed")
        })
})