const URL = "http://localhost:3100";

// Create Election Button
document.querySelector('#create-election-btn').addEventListener('click', (e) => {
    let election_name = document.querySelector("#new-election-name").value;
    fetch(`${URL}/election?name=${election_name}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `Election name "${election_name}" was created`,
                showConfirmButton: false,
                timer: 2500
            })
            document.querySelector("#new-election-name").value = "";
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Election name "${election_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
})