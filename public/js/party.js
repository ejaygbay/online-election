const URL = window.location.origin;

const displayParties = () => {
    fetch(`${URL}/party`)
        .then(response => response.json())
        .then(data => {
            let table = document.querySelector("tbody");
            let party_data = data.reverse();

            table.innerHTML = "";
            party_data.forEach((ele, index) => {
                let html = `<tr id=${ele.id}>
                    <th scope="row">${index + 1}.</th>
                    <td id=name-${ele.id}>${ele.party_name}</td>
                    <td>
                        <button id=${ele.id}_edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
                            <i id=${ele.id}_edit class="edit fas fa-pencil-alt"></i>
                        </button>
                        <button id=${ele.id}_del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
                            <i id=${ele.id}_del class="delete fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;

                table.insertAdjacentHTML('beforeend', html);
            });

            document.querySelectorAll(".action-btn").forEach(ele => {
                ele.addEventListener("click", (e) => {
                    let id = e.target.id.split("_")[0];
                    let classes = e.target.classList;
                    let party_name = document.getElementById(`name-${id}`).innerHTML;

                    classes.forEach(ele => {
                        if (ele === 'edit') {
                            displayPartyNameForEditing(id, party_name);
                        } else if (ele === 'delete') {
                            deleteParty(id, party_name);
                        }
                    })
                })
            })
        })
        .catch(err => {
            console.log(err.message);
        })
}

displayParties();

// Create Party Button
document.querySelector('#create-party-btn').addEventListener('click', (e) => {
    let party_name = document.querySelector("#new-party-name").value;
    fetch(`${URL}/party?name=${party_name}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 0) {
                Swal.fire({
                    icon: 'success',
                    title: `Party name "${party_name}" was created`,
                    showConfirmButton: false,
                    timer: 2500
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: `Party name "${party_name}" already exist`,
                    showConfirmButton: false,
                    timer: 2500
                })
            }

            document.querySelector("#new-party-name").value = "";
            document.querySelector("#new-party-name").focus();
            displayParties();
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Party name "${party_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })

    // document.querySelector("#new-party-name").classList.remove("form-control");
    // document.querySelector("#new-party-name").classList.add("form-control");
})

const displayPartyNameForEditing = (id, party_name) => {
    Swal.fire({
            title: 'Edit Party',
            input: 'text',
            inputValue: party_name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true
        })
        .then((result) => {
            if (result.isConfirmed) {
                editParty(id, party_name, result.value);
            }
        })
}

const editParty = (id, old_name, new_name) => {
    fetch(`${URL}/party?id=${id}&name=${new_name}`, {
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
            displayParties();
        })
}


const deleteParty = (id, party_name) => {
    fetch(`${URL}/party?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${party_name} was deleted`,
                showConfirmButton: false,
                timer: 1000
            })
            displayParties();
        })
}