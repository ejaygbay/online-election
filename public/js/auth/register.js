document.querySelector('#create-account-btn').addEventListener('click', (e) => {
    let first_name = document.getElementById('first-name').value.trim();
    let middle_name = document.getElementById('middle-name').value.trim();
    let last_name = document.getElementById('last-name').value.trim();
    let contact = document.getElementById('contact').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    let account_details = {
        first_name: first_name,
        last_name: last_name,
        contact: contact,
        email: email,
        password: password
    }

    if (!validateInputs(account_details)) {
        account_details.middle_name = middle_name;

        makeRequest(account_details, result => {
            if (result.code === 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Account created successfully',
                    showConfirmButton: false,
                    timer: 2000
                })
            } else if (result.code === 2) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email already in use',
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'An error has occurred',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Make sure all the required fields are filled in',
            showConfirmButton: false,
            timer: 2500
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
    fetch('/account/create', {
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