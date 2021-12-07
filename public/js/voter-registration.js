const URL = window.location.origin;
let first_name = document.getElementById('first-name');
let middle_name = document.getElementById('middle-name');
let last_name = document.getElementById('last-name');
let election_dropdown = document.getElementById('elections-dropdown');
let voter_preview_img = document.getElementById('img-preview');
let img_input_ele = document.getElementById('voter-img');

const displayVoters = (data) => {
    // let table = document.querySelector("tbody");
    // let voter_data = data.reverse();

    // table.innerHTML = "";
    // voter_data.forEach((ele, index) => {
    //     let html = `<tr id=${ele.id}>
    //                 <th scope="row">${index + 1}.</th>
    //                 <td id=name-${ele.id}>${ele.voter_name}</td>
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
    //         let voter_name = document.getElementById(`name-${id}`).innerHTML;

    //         classes.forEach(ele => {
    //             if (ele === 'edit') {
    //                 displayvoterNameForEditing(id, voter_name);
    //             } else if (ele === 'delete') {
    //                 deletevoter(id, voter_name);
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


/**
 * Display election
 * @param {array} data array of objects
 * [{id: exampleID, election_name: "Test Election"}]
 */
const displayElections = (data) => {
    let html = `<option value="" disabled selected>Select Election</option>`;

    data = data.reverse();
    election_dropdown.innerHTML = "";
    election_dropdown.insertAdjacentHTML('beforeend', html);

    data.forEach(ele => {
        let html = `<option value="${ele.id}">${ele.election_name}</option>`;
        election_dropdown.insertAdjacentHTML('beforeend', html);
    });
}


const displayVoterNameForEditing = (id, voter_name) => {
    Swal.fire({
            title: 'Edit voter',
            input: 'text',
            inputValue: voter_name,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true
        })
        .then((result) => {
            if (result.isConfirmed) {
                editvoter(id, voter_name, result.value);
            }
        })
}

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
 * Get form data and make request when the Add voter btn is clicked
 */
document.querySelector("#add-voter-btn").addEventListener("click", async(e) => {
    let data_to_send = {
        first_name: first_name.value,
        middle_name: middle_name.value,
        last_name: last_name.value,
        election_id: '',
        voter_img: voter_preview_img.src
    }

    if (election_dropdown) {
        data_to_send.election_id = election_dropdown.value;
    }

    await makeRequest(data_to_send)
        .then(result => {
            if (result.status === 0) {
                Swal.fire({
                    icon: 'success',
                    title: `Voter name <b>${first_name.value} ${middle_name.value} ${last_name.value}</b> was created`,
                    showConfirmButton: false,
                    timer: 2500
                })

                first_name.value = '';
                middle_name.value = '';
                last_name.value = '';
                if (election_dropdown) {
                    election_dropdown.selectedIndex = 0;
                }
                voter_preview_img.src = '';

                middle_name.focus();
                last_name.focus();
                first_name.focus();

                img_input_ele.value = '';
                document.getElementById('img-preview').src = "";
                document.getElementById('img-preview').style = "height: 0px; width: 0px;";
                document.getElementById('preview-text').style = "visibility: visible;";

            } else {
                Swal.fire({
                    icon: 'error',
                    title: `Voter name <b>${first_name.value} ${middle_name.value} ${last_name.value}</b> already exist`,
                    showConfirmButton: false,
                    timer: 2500
                })
            }
        })
})

if (election_dropdown) {
    getElections();
}


const editvoter = (id, old_name, new_name) => {
    fetch(`${URL}/voter?id=${id}&name=${new_name}`, {
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

const deletevoter = (id, voter_name) => {
    fetch(`${URL}/voter?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `${voter_name} was deleted`,
                showConfirmButton: false,
                timer: 1000
            })
            document.getElementById(id).style = "display: none";
        })
}

const makeRequest = async(data) => {
    return await fetch(`${URL}/voter`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => result)
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Voter name <b>${first_name} ${middle_name} ${last_name}</b> was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
}