const URL = window.location.origin;
let election_id = document.getElementById('elections-dropdown');

const displayContestants = (data) => {
    // let table = document.querySelector("tbody");
    // let contestant_data = data.reverse();

    // table.innerHTML = "";
    // contestant_data.forEach((ele, index) => {
    //     let html = `<tr id=${ele.id}>
    //                 <th scope="row">${index + 1}.</th>
    //                 <td id=name-${ele.id}>${ele.contestant_name}</td>
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
    //         let contestant_name = document.getElementById(`name-${id}`).innerHTML;

    //         classes.forEach(ele => {
    //             if (ele === 'edit') {
    //                 displaycontestantNameForEditing(id, contestant_name);
    //             } else if (ele === 'delete') {
    //                 deletecontestant(id, contestant_name);
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

const getParties = () => {
    election_id = election_id.value;

    fetch(`${URL}/party?id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            console.log("PARTIES:::", data);
            // displayParties(data);
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

const displayParties = (data) => {
    let dropdown = document.querySelector("#parties-dropdown");
    let html = `<option value="" disabled selected>Select Party</option>`;

    data = data.reverse();
    dropdown.innerHTML = "";
    dropdown.insertAdjacentHTML('beforeend', html);

    data.forEach(ele => {
        let html = `<option value="${ele.id}">${ele.party_name}</option>`;
        dropdown.insertAdjacentHTML('beforeend', html);
    });
}

const displayPositions = (data) => {
    let dropdown = document.querySelector("#positions-dropdown");
    let html = `<option value="" disabled selected>Select Position</option>`;

    dropdown.innerHTML = "";
    dropdown.insertAdjacentHTML('beforeend', html);

    data.forEach(ele => {
        let html = `<option value="${ele.id}">${ele.position_name}</option>`;
        dropdown.insertAdjacentHTML('beforeend', html);
    });
}

/**
 * When the select element for the displaying contestants for
 * a specific election is changed, it is handled by this
 */
document.getElementById('elections-dropdown').addEventListener("change", () => {
    election_id = election_id.value;

    fetch(`${URL}/position?id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            displayPositions(data);
            getParties();
        })
})

const displayContestantNameForEditing = (id, contestant_name) => {
    Swal.fire({
            title: 'Edit contestant',
            input: 'text',
            inputValue: contestant_name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true
        })
        .then((result) => {
            if (result.isConfirmed) {
                editcontestant(id, contestant_name, result.value);
            }
        })
}

let img_input_ele = document.getElementById('contestant-img');
img_input_ele.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        let img_path = window.URL.createObjectURL(e.target.files[0]);
        document.getElementById('img-preview').src = img_path;
        document.getElementById('img-preview').style = "height: 160px; width: 160px;";
        document.getElementById('preview-text').style = "visibility: hidden;";
    } else {
        document.getElementById('img-preview').src = "";
        document.getElementById('img-preview').style = "height: 0px; width: 0px;";
        document.getElementById('preview-text').style = "visibility: visible;";
    }
})

/**
 * Get form data and make request when the Add Contestant btn is clicked
 */
const validateForm = (e) => {
    e.preventDefault();

    let first_name = document.querySelector('#first-name').value;
    let middle_name = document.getElementById('middle-name').value;
    let last_name = document.querySelector('#last-name').value;
    let election_selected = document.getElementById('elections-dropdown').value;
    let position_selected = document.getElementById('positions-dropdown').value;
    let party_selected = document.getElementById('parties-dropdown').value;
    let contestant_img = document.getElementById('img-preview').src;

    let data_to_send = {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        election_id: election_selected,
        position_id: position_selected,
        party_id: party_selected,
        contestant_img: contestant_img
    }

    makeAPICall(data_to_send, result => {
        if (result.status === 0) {
            Swal.fire({
                icon: 'success',
                title: `Contestant name <b>${first_name} ${middle_name} ${last_name}</b> was created`,
                showConfirmButton: false,
                timer: 2500
            })

        } else {
            Swal.fire({
                icon: 'error',
                title: `Contestant name <b>${first_name} ${middle_name} ${last_name}</b> already exist`,
                showConfirmButton: false,
                timer: 2500
            })
        }
    })

}

getElections();


const editContestant = (id, old_name, new_name) => {
    fetch(`${URL}/contestant?id=${id}&name=${new_name}`, {
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


const deleteContestant = (id, contestant_name) => {
    fetch(`${URL}/contestant?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${contestant_name} was deleted`,
                showConfirmButton: false,
                timer: 1000
            })
            document.getElementById(id).style = "display: none";
        })
}

const makeAPICall = async(data, callback) => {
    fetch(`${URL}/contestant`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => {
            console.log("Contestant:::", err.message)
            Swal.fire({
                icon: 'error',
                title: `Contestant name <b>${data.first_name} ${data.middle_name} ${data.last_name}</b> was not created`,
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