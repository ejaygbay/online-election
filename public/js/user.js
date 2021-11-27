const URL = window.location.origin;
let user_name = document.querySelector('#new-user-name');
let election_selected = document.getElementById('elections-dropdown');


const displayUsers = (data) => {
    let table = document.querySelector("tbody");
    let user_data = data.reverse();

    table.innerHTML = "";
    user_data.forEach((ele, index) => {
        let html = `<tr id=${ele.id}>
                    <th scope="row">${index + 1}.</th>
                    <td id=name-${ele.id}>${ele.user_name}</td>
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
            let user_name = document.getElementById(`name-${id}`).innerHTML;

            classes.forEach(ele => {
                if (ele === 'edit') {
                    displayUserNameForEditing(id, user_name);
                } else if (ele === 'delete') {
                    deleteUser(id, user_name);
                }
            })
        })
    })
}

const getElections = () => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.querySelector("#elections-dropdown");
            let dropdown2 = document.querySelector("#elections-dropdown2");
            let html = `<option value="" disabled selected>Select Election</option>`;

            data = data.reverse();

            dropdown.innerHTML = "";
            dropdown2.innerHTML = "";

            dropdown.insertAdjacentHTML('beforeend', html);
            dropdown2.insertAdjacentHTML('beforeend', html);

            data.forEach(ele => {
                let html = `<option value="${ele.id}">${ele.election_name}</option>`;
                dropdown.insertAdjacentHTML('beforeend', html);
                dropdown2.insertAdjacentHTML('beforeend', html);
            });
        })
}

/**
 * When the select element for the displaying users for
 * a specific election is changed, it is handled by this
 */
document.getElementById('elections-dropdown2').addEventListener("change", () => {
    let election_id = document.getElementById('elections-dropdown2').value;

    fetch(`${URL}/user?id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            data = data.reverse();
            displayUsers(data);
        })
})

const displayUserNameForEditing = (id, user_name) => {
    Swal.fire({
            title: 'Edit User',
            input: 'text',
            inputValue: user_name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true
        })
        .then((result) => {
            if (result.isConfirmed) {
                editUser(id, user_name, result.value);
            }
        })
}

election_selected.addEventListener("change", () => {
    if (election_selected.value.trim().length > 0 && user_name.value.trim().length > 0) {
        enableBtn('#create-user-btn');
    } else {
        disableBtn('#create-user-btn');
    }
})

user_name.addEventListener('keyup', (e) => {
    if (election_selected.value.trim().length > 0) {
        validateInputs(user_name.value.trim(), result => {
            result ? enableBtn('#create-user-btn') : disableBtn('#create-user-btn');
        })
    } else {
        disableBtn('#create-user-btn');
    }

    // validateInputs(election_selected.value.trim(), result => {
    //     result ? enableBtn('#create-user-btn') : disableBtn('#create-user-btn');
    // })
    // console.log(election_selected.value);
})

document.querySelector("#create-user-btn").addEventListener("click", (e) => {
    let data_to_send = {
        user_name: user_name.value,
        election_id: election_selected.value
    }

    makeAPICall(data_to_send, result => {
        if (result.status === 0) {
            Swal.fire({
                icon: 'success',
                title: `User name "${user_name.value}" was created`,
                showConfirmButton: false,
                timer: 2500
            })
            user_name.value = "";
            election_selected.selectedIndex = 0;
            disableBtn('#create-user-btn');
        } else {
            Swal.fire({
                icon: 'error',
                title: `User name "${user_name.value}" already exist`,
                showConfirmButton: false,
                timer: 2500
            })
        }

        user_name.focus();
    })
})

getElections();


const editUser = (id, old_name, new_name) => {
    fetch(`${URL}/user?id=${id}&name=${new_name}`, {
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
            document.querySelector(`#name-${id}`).innerHTML = new_name;
        })
}


const deleteUser = (id, user_name) => {
    fetch(`${URL}/user?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${user_name} was deleted`,
                showConfirmButton: false,
                timer: 1000
            })
            document.getElementById(id).style = "display: none";
        })
}

const makeAPICall = async(data, callback) => {
    fetch(`${URL}/user?name=${data.user_name}&id=${data.election_id}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `User name "${data.user_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
}

const validateInputs = async(data, callback) => {
    if (data.length > 0)
        return callback(true);
    else
        return callback(false);
}

const enableBtn = (id) => document.querySelector(id).disabled = false;

const disableBtn = (id) => document.querySelector(id).disabled = true;