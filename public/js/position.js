const URL = window.location.origin;
let position_name = document.querySelector('#new-position-name');
let election_dropdown1 = document.querySelector('#elections-dropdown');
let election_dropdown2 = document.querySelector("#elections-dropdown2");
let positions = {};


const displayPositions = (data) => {
    let index = 1;
    let table = document.querySelector("tbody");
    // let position_data = data.reverse();

    table.innerHTML = "";

    for (let id in data) {
        let html = `<tr id=${id}>
            <th scope="row">${index}.</th>
            <td id=name-${id}>${data[id].position_name}</td>
            <td>
                <button id=${id}_edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
                    <i id=${id}_edit class="edit fas fa-pencil-alt"></i>
                </button>
                <button id=${id}_del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
                    <i id=${id}_del class="delete fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>`;

        table.insertAdjacentHTML('beforeend', html);
        index++;
    }
    // data.forEach((ele, index) => {
    //     // let html = `<tr id=${ele.id}>
    //     //             <th scope="row">${index + 1}.</th>
    //     //             <td id=name-${ele.id}>${ele.position_name}</td>
    //     //             <td>
    //     //                 <button id=${ele.id}_edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
    //     //                     <i id=${ele.id}_edit class="edit fas fa-pencil-alt"></i>
    //     //                 </button>
    //     //                 <button id=${ele.id}_del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
    //     //                     <i id=${ele.id}_del class="delete fas fa-trash-alt"></i>
    //     //                 </button>
    //     //             </td>
    //     //         </tr>`;

    //     // table.insertAdjacentHTML('beforeend', html);
    // });

    document.querySelectorAll(".action-btn").forEach(ele => {
        ele.addEventListener("click", (e) => {
            let id = e.target.id.split("_")[0];
            let classes = e.target.classList;
            let position_name = document.getElementById(`name-${id}`).innerHTML;

            classes.forEach(ele => {
                if (ele === 'edit') {
                    displayPositionNameForEditing(id, position_name);
                } else if (ele === 'delete') {
                    deletePosition(id, position_name);
                }
            })
        })
    })
}

const displayElections = (data) => {
    let html = `<option value="" disabled selected>Select Election</option>`;

    data = data.reverse();

    election_dropdown1.innerHTML = "";
    election_dropdown2.innerHTML = "";

    election_dropdown1.insertAdjacentHTML('beforeend', html);
    election_dropdown2.insertAdjacentHTML('beforeend', html);

    data.forEach(ele => {
        let html = `<option value="${ele.id}">${ele.election_name}</option>`;
        election_dropdown1.insertAdjacentHTML('beforeend', html);
        election_dropdown2.insertAdjacentHTML('beforeend', html);
    });
}

const getElections = () => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => displayElections(data));
}

const editPosition = (id, old_name, new_name) => {
    fetch(`${URL}/position?id=${id}&name=${new_name}`, {
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

const deletePosition = (id, position_name) => {
    fetch(`${URL}/position?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${position_name} was deleted`,
                showConfirmButton: false,
                timer: 1000
            })

            delete positions[id];
            displayPositions(positions);
        })
}

const makeAPICall = async(data, callback) => {
    fetch(`${URL}/position?name=${data.position_name}&id=${data.election_id}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Position name "${data.position_name}" was not created`,
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

const displayPositionNameForEditing = (id, position_name) => {
    Swal.fire({
            title: 'Edit Position',
            input: 'text',
            inputValue: position_name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true
        })
        .then((result) => {
            if (result.isConfirmed) {
                editPosition(id, position_name, result.value);
            }
        })
}

const getPositions = (election_id) => {
    positions = {};

    fetch(`${URL}/position?id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            data = data.reverse();

            data.forEach(ele => {
                let id = ele.id;
                let position_name = ele.position_name;

                positions[id] = {
                    id: id,
                    position_name: position_name
                }
            })

            displayPositions(positions);
        })
}

const enableBtn = (id) => document.querySelector(id).disabled = false;

const disableBtn = (id) => document.querySelector(id).disabled = true;

/**
 * When the select element for the displaying positions for
 * a specific election is changed, it is handled by this
 */
if (election_dropdown1 && election_dropdown2) {
    election_dropdown1.addEventListener("change", () => {
        if (election_dropdown1.value.trim().length > 0 && position_name.value.trim().length > 0) {
            enableBtn('#create-position-btn');
        } else {
            disableBtn('#create-position-btn');
        }
    })

    election_dropdown2.addEventListener("change", () => {
        let election_id = election_dropdown2.value;
        getPositions(election_id);
    })

    getElections('');
}

position_name.addEventListener('keyup', (e) => {
    if (election_dropdown1 && election_dropdown2) {
        if (election_dropdown1.value.trim().length > 0) {
            validateInputs(position_name.value.trim(), result => {
                result ? enableBtn('#create-position-btn') : disableBtn('#create-position-btn');
            })
        } else {
            disableBtn('#create-position-btn');
        }
    } else {
        validateInputs(position_name.value.trim(), result => {
            result ? enableBtn('#create-position-btn') : disableBtn('#create-position-btn');
        })
    }
})

document.querySelector("#create-position-btn").addEventListener("click", (e) => {
    let data_to_send = {
        position_name: position_name.value,
        election_id: ''
    }

    if (election_dropdown1) {
        data_to_send.election_id = election_dropdown1.value;
    }

    makeAPICall(data_to_send, result => {
        if (result.status === 0) {
            Swal.fire({
                icon: 'success',
                title: `Position name "${position_name.value}" was created`,
                showConfirmButton: false,
                timer: 2500
            })
            position_name.value = "";

            if (election_dropdown1) {
                getPositions(election_dropdown1.value);
                election_dropdown1.selectedIndex = 0;
            } else {
                getPositions('');
            }
            disableBtn('#create-position-btn');
        } else {
            Swal.fire({
                icon: 'error',
                title: `Position name "${position_name.value}" already exist`,
                showConfirmButton: false,
                timer: 2500
            })
        }

        position_name.focus();
    })
})

getPositions('');