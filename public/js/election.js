const URL = window.location.origin;

const displayElections = () => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => {
            let table = document.querySelector("tbody");
            let election_data = data.reverse();

            table.innerHTML = "";
            election_data.forEach((ele, index) => {
                let html = `<tr id=${ele.id}>
                    <th scope="row">${index + 1}.</th>
                    <td id=name-${ele.id}>${ele.election_name}</td>
                    <td>
                        <button id=${ele.id}-edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
                            <i id=${ele.id}-edit class="edit fas fa-pencil-alt"></i>
                        </button>
                        <button id=${ele.id}-del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
                            <i id=${ele.id}-del class="delete fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;

                table.insertAdjacentHTML('beforeend', html);
            });

            document.querySelectorAll(".action-btn").forEach(ele => {
                ele.addEventListener("click", (e) => {
                    let id = e.target.id.split("-")[0];
                    let classes = e.target.classList;
                    let election_name = document.getElementById(`name-${id}`).innerHTML;

                    classes.forEach(ele => {
                        if (ele === 'edit') {
                            displayElectionNameForEditing(id, election_name);
                        } else if (ele === 'delete') {
                            deleteElection(id, election_name);
                        }
                    })
                })
            })
        })
        .catch(err => {
            console.log(err.message);
        })
}

// displayElections();

// Create Election Button
document.querySelector('#create-election-btn').addEventListener('click', (e) => {
    let election_name = document.querySelector("#new-election-name").value;
    fetch(`${URL}/election?name=${election_name}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 0) {
                Swal.fire({
                    icon: 'success',
                    title: `Election name "${election_name}" was created`,
                    showConfirmButton: false,
                    timer: 2500
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: `Election name "${election_name}" already exist`,
                    showConfirmButton: false,
                    timer: 2500
                })
            }

            document.querySelector("#new-election-name").value = "";
            document.querySelector("#new-election-name").focus();
            displayElections();
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Election name "${election_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })

    // document.querySelector("#new-election-name").classList.remove("form-control");
    // document.querySelector("#new-election-name").classList.add("form-control");
})

const displayElectionNameForEditing = (id, election_name) => {
    Swal.fire({
            title: 'Edit Election',
            input: 'text',
            inputValue: election_name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true
        })
        .then((result) => {
            if (result.isConfirmed) {
                editElection(id, election_name, result.value);
            }
        })
}

const editElection = (id, old_name, new_name) => {
    fetch(`${URL}/election?id=${id}&name=${new_name}`, {
            method: 'PATCH'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${old_name} was changed to ${new_name}`,
                showConfirmButton: false,
                timer: 2500
            })
            displayElections();
        })
}


const deleteElection = (id, election_name) => {
    fetch(`${URL}/election?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${election_name} was deleted`,
                showConfirmButton: false,
                timer: 1000
            })
            displayElections();
        })
}