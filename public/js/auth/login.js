document.querySelector('#login-btn').addEventListener('click', (e) => {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    let login_details = {
        email: email,
        password: password
    }

    if (!validateInputs(login_details)) {

        makeRequest(login_details, result => {
            if (result.code === 0) {
                window.location.href = "/";
            } else {
                console.log("Wrong details");
                // document.getElementById('email').style = "color: red";
                // document.getElementById('password').style = "color: red";
            }
        })
    }
})

const validateInputs = (data) => {
    let result = false;

    for (item in data) {
        if (data[item].length < 1) {
            result = true;
            break;
        }
    }
    return result;
}

const makeRequest = (data, callback) => {
    fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => callback(error))
}