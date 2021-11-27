const URL = window.location.origin;
let election_id = document.getElementById('elections-dropdown');

const displayUsers = (data) => {
    // let table = document.querySelector("tbody");
    // let user_data = data.reverse();

    // table.innerHTML = "";
    // user_data.forEach((ele, index) => {
    //     let html = `<tr id=${ele.id}>
    //                 <th scope="row">${index + 1}.</th>
    //                 <td id=name-${ele.id}>${ele.user_name}</td>
    //                 <td>
    //                     <button id=${ele.id}_edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
    //                         <i id=${ele.id}_edit class="edit fas fa-pencil-alt"></i>
    //                     </button>
    //                     <button id=${ele.id}_del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
    //                         <i id=${ele.id}_del class="delete fas fa-trash-alt"></i>
    //                     </button>
    //                 </td>
    //             </tr>`;

    //     table.insertAdjacentHTML('beforeend', html);
    // });

    // document.querySelectorAll(".action-btn").forEach(ele => {
    //     ele.addEventListener("click", (e) => {
    //         let id = e.target.id.split("_")[0];
    //         let classes = e.target.classList;
    //         let user_name = document.getElementById(`name-${id}`).innerHTML;

    //         classes.forEach(ele => {
    //             if (ele === 'edit') {
    //                 displayuserNameForEditing(id, user_name);
    //             } else if (ele === 'delete') {
    //                 deleteuser(id, user_name);
    //             }
    //         })
    //     })
    // })
}

/**
 * Using Fetch to get all elections
 */
const getElections = () => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => {
            displayElections(data);
        })
}

const getRoles = (callback) => {
    fetch(`${URL}/role`)
        .then(response => response.json())
        .then(data => {
            return callback(data);
        })
}

/**
 * Display election
 * @param {array} data array of objects
 * [{id: exampleID, election_name: "Test Election"}]
 */
const displayElections = (data) => {
    let dropdown = document.querySelector("#elections-dropdown");
    let html = `<option value="" disabled selected>Select Election</option>`;

    data = data.reverse();
    dropdown.innerHTML = "";
    dropdown.insertAdjacentHTML('beforeend', html);

    data.forEach(ele => {
        let html = `<option value="${ele.id}">${ele.election_name}</option>`;
        dropdown.insertAdjacentHTML('beforeend', html);
    });
}

const displayRoles = (data) => {
    let dropdown = document.querySelector("#roles-dropdown");
    let html = `<option value="" disabled selected>Select Role</option>`;

    dropdown.innerHTML = "";
    dropdown.insertAdjacentHTML('beforeend', html);

    data.forEach(ele => {
        let html = `<option value="${ele.id}">${ele.role}</option>`;
        dropdown.insertAdjacentHTML('beforeend', html);
    });
}

/**
 * When the select element for the displaying users for
 * a specific election is changed, it is handled by this
 */
document.getElementById('elections-dropdown').addEventListener("change", () => {
    election_id = election_id.value;

    fetch(`${URL}/position?id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            // getRoles();
        })
})

const displayUserNameForEditing = (id, user_name) => {
    Swal.fire({
            title: 'Edit user',
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
                edituser(id, user_name, result.value);
            }
        })
}

getRoles(result => displayRoles(result));

/**
 * Get form data and make request when the Add User btn is clicked
 */
const validateForm = (e) => {
    e.preventDefault();

    let first_name = document.querySelector('#first-name').value;
    let middle_name = document.getElementById('middle-name').value;
    let last_name = document.querySelector('#last-name').value;
    let role_selected = document.getElementById('roles-dropdown').value;
    let election_selected = document.getElementById('elections-dropdown').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let data_to_send = {
        first_name: first_name.trim(),
        middle_name: middle_name.trim(),
        last_name: last_name.trim(),
        election_id: election_selected.trim(),
        role_id: role_selected.trim(),
        email: email.trim(),
        password: password.trim()
    }

    console.log(data_to_send);
    // makeAPICall(data_to_send, result => {
    //     if (result.status === 0) {
    //         Swal.fire({
    //             icon: 'success',
    //             title: `User name <b>${first_name} ${middle_name} ${last_name}</b> was created`,
    //             showConfirmButton: false,
    //             timer: 2500
    //         })

    //     } else {
    //         Swal.fire({
    //             icon: 'error',
    //             title: `User name <b>${first_name} ${middle_name} ${last_name}</b> already exist`,
    //             showConfirmButton: false,
    //             timer: 2500
    //         })
    //     }
    // })

}

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
    fetch(`${URL}/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => {
            console.log("User:::", err.message)
            Swal.fire({
                icon: 'error',
                title: `User name <b>${data.first_name} ${data.middle_name} ${data.last_name}</b> was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
}

const validateInputs = (data) => {
    if (data.length > 0)
        return true;
    else
        return false;
}

const enableBtn = (id) => document.querySelector(id).disabled = false;

const disableBtn = (id) => document.querySelector(id).disabled = true;