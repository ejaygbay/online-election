let email = document.getElementById('email');
let password = document.getElementById('password');

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

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    let login_details = {
        email: email.value.trim(),
        password: password.value.trim()
    }

    if (!validateInputs(login_details)) {

        makeRequest(login_details, result => {
            if (result.code === 0) {
                window.location.href = "/";
            } else {
                email.style = "color: red";
                password.style = "color: red";
            }
        })
    }
})

email.addEventListener('focus', () => {
    email.style = "color: #4f4f4f";
    password.style = "color: #4f4f4f";
})

password.addEventListener('focus', () => {
    email.style = "color: #4f4f4f";
    password.style = "color: #4f4f4f";
})