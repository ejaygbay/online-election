const URL = window.location.origin;
let party_name = document.querySelector('#new-party-name');
let election_dropdown1 = document.querySelector('#elections-dropdown');
let election_dropdown2 = document.querySelector("#elections-dropdown2");
let parties = {};


const displayParties = (data) => {
    let index = 1;
    let table = document.querySelector("tbody");
    // let position_data = data.reverse();

    table.innerHTML = "";

    for (let id in data) {
        let html = `<tr id=${id}>
            <th scope="row">${index}.</th>
            <td id=name-${id}>${data[id].party_name}</td>
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
            document.querySelector(`#name-${id}`).innerHTML = new_name;
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

            delete parties[id];
            displayParties(parties);
        })
}

const makeAPICall = async(data, callback) => {
    fetch(`${URL}/party?name=${data.party_name}&id=${data.election_id}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Party name "${data.party_name}" was not created`,
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

const displayPartyNameForEditing = (id, party_name) => {
    Swal.fire({
            title: 'Edit Position',
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
                editPosition(id, party_name, result.value);
            }
        })
}

const getParties = (election_id) => {
    parties = {};

    fetch(`${URL}/party?election_id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            data = data.reverse();

            data.forEach(ele => {
                let id = ele.id;
                let party_name = ele.party_name;

                parties[id] = {
                    id: id,
                    party_name: party_name
                }
            })

            displayParties(parties);
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
        if (election_dropdown1.value.trim().length > 0 && party_name.value.trim().length > 0) {
            enableBtn('#create-party-btn');
        } else {
            disableBtn('#create-party-btn');
        }
    })

    election_dropdown2.addEventListener("change", () => {
        let election_id = election_dropdown2.value;
        getParties(election_id);
    })

    getElections('');
}

party_name.addEventListener('keyup', (e) => {
    if (election_dropdown1 && election_dropdown2) {
        if (election_dropdown1.value.trim().length > 0) {
            validateInputs(party_name.value.trim(), result => {
                result ? enableBtn('#create-party-btn') : disableBtn('#create-party-btn');
            })
        } else {
            disableBtn('#create-party-btn');
        }
    } else {
        validateInputs(party_name.value.trim(), result => {
            result ? enableBtn('#create-party-btn') : disableBtn('#create-party-btn');
        })
    }
})

document.querySelector("#create-party-btn").addEventListener("click", (e) => {
    let data_to_send = {
        party_name: party_name.value,
        election_id: ''
    }

    if (election_dropdown1) {
        data_to_send.election_id = election_dropdown1.value;
    }

    makeAPICall(data_to_send, result => {
        if (result.status === 0) {
            Swal.fire({
                icon: 'success',
                title: `Position name "${party_name.value}" was created`,
                showConfirmButton: false,
                timer: 2500
            })
            party_name.value = "";

            if (election_dropdown1) {
                getParties(election_dropdown1.value);
                election_dropdown1.selectedIndex = 0;
            } else {
                getParties('');
            }
            disableBtn('#create-party-btn');
        } else {
            Swal.fire({
                icon: 'error',
                title: `Position name "${party_name.value}" already exist`,
                showConfirmButton: false,
                timer: 2500
            })
        }

        party_name.focus();
    })
})

if (!election_dropdown1) {
    getParties('');
}

{
    // const URL = window.location.origin;
    // let party_name = document.querySelector("#new-party-name");
    // let election_dropdown = document.getElementById('elections-dropdown');
    // let election_dropdown2 = document.getElementById('elections-dropdown2');

    // const displayParties = () => {
    //     fetch(`${URL}/party`)
    //         .then(response => response.json())
    //         .then(data => {
    //             let table = document.querySelector("tbody");
    //             let party_data = data.reverse();

    //             table.innerHTML = "";
    //             party_data.forEach((ele, index) => {
    //                 let html = `<tr id=${ele.id}>
    //                     <th scope="row">${index + 1}.</th>
    //                     <td id=name-${ele.id}>${ele.party_name}</td>
    //                     <td>
    //                         <button id=${ele.id}_edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
    //                             <i id=${ele.id}_edit class="edit fas fa-pencil-alt"></i>
    //                         </button>
    //                         <button id=${ele.id}_del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
    //                             <i id=${ele.id}_del class="delete fas fa-trash-alt"></i>
    //                         </button>
    //                     </td>
    //                 </tr>`;

    //                 table.insertAdjacentHTML('beforeend', html);
    //             });

    //             document.querySelectorAll(".action-btn").forEach(ele => {
    //                 ele.addEventListener("click", (e) => {
    //                     let id = e.target.id.split("_")[0];
    //                     let classes = e.target.classList;
    //                     let party_name = document.getElementById(`name-${id}`).innerHTML;

    //                     classes.forEach(ele => {
    //                         if (ele === 'edit') {
    //                             displayPartyNameForEditing(id, party_name);
    //                         } else if (ele === 'delete') {
    //                             deleteParty(id, party_name);
    //                         }
    //                     })
    //                 })
    //             })
    //         })
    //         .catch(err => {
    //             console.log(err.message);
    //         })
    // }

    // const getParties = (election_id) => {
    //     fetch(`${URL}/?election_id=${election_id}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             data = data.reverse();

    //             data.forEach(ele => {
    //                 let id = ele.id;
    //                 let position_name = ele.position_name;

    //                 positions[id] = {
    //                     id: id,
    //                     position_name: position_name
    //                 }
    //             })

    //             displayPositions(positions);
    //         })
    // }

    // const getElections = () => {
    //     fetch(`${URL}/election`)
    //         .then(response => response.json())
    //         .then(data => {
    //             let dropdown = document.querySelector("#elections-dropdown");
    //             let dropdown2 = document.querySelector("#elections-dropdown2");
    //             let html = `<option value="" disabled selected>Select Election</option>`;

    //             data = data.reverse();

    //             dropdown.innerHTML = "";
    //             dropdown2.innerHTML = "";

    //             dropdown.insertAdjacentHTML('beforeend', html);
    //             dropdown2.insertAdjacentHTML('beforeend', html);

    //             data.forEach(ele => {
    //                 let html = `<option value="${ele.id}">${ele.election_name}</option>`;
    //                 dropdown.insertAdjacentHTML('beforeend', html);
    //                 dropdown2.insertAdjacentHTML('beforeend', html);
    //             });
    //         })
    // }

    // if (!election_dropdown) {
    //     displayParties();
    // }

    // // Create Party Button
    // document.querySelector('#create-party-btn').addEventListener('click', (e) => {
    //     let data_to_send = {
    //         party_name: party_name.value,
    //         election_id: ''
    //     }

    //     if (election_dropdown) {
    //         data_to_send.election_id = election_dropdown.value;
    //     }

    //     makeAPICall(data_to_send, result => {
    //         if (result.status === 0) {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: `Party name "${party_name.value}" was created`,
    //                 showConfirmButton: false,
    //                 timer: 2500
    //             })
    //         } else {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: `Party name "${party_name.value}" already exist`,
    //                 showConfirmButton: false,
    //                 timer: 2500
    //             })
    //         }

    //         document.querySelector("#new-party-name").value = "";
    //         document.querySelector("#new-party-name").focus();
    //         displayParties();
    //         disableBtn('#create-party-btn');
    //     })
    // })

    // if (election_dropdown) {
    //     election_dropdown.addEventListener("change", () => {
    //         if (election_dropdown.value.trim().length > 0 && party_name.value.trim().length > 0) {
    //             enableBtn('#create-party-btn');
    //         } else {
    //             disableBtn('#create-party-btn');
    //         }
    //     })

    //     election_dropdown2.addEventListener("change", () => {
    //         let election_id = election_dropdown2.value;
    //         getParties(election_id);
    //     })

    //     getElections();
    // }

    // party_name.addEventListener('keyup', (e) => {
    //     if (election_dropdown) {
    //         if (election_dropdown.value.trim().length > 0) {
    //             validateInputs(party_name.value.trim(), result => {
    //                 result ? enableBtn('#create-party-btn') : disableBtn('#create-party-btn');
    //             })
    //         } else {
    //             disableBtn('#create-party-btn');
    //         }
    //     } else {
    //         validateInputs(party_name.value.trim(), result => {
    //             result ? enableBtn('#create-party-btn') : disableBtn('#create-party-btn');
    //         })
    //     }
    // })

    // const displayPartyNameForEditing = (id, party_name) => {
    //     Swal.fire({
    //             title: 'Edit Party',
    //             input: 'text',
    //             inputValue: party_name,
    //             inputAttributes: {
    //                 autocapitalize: 'off'
    //             },
    //             showCancelButton: true,
    //             confirmButtonText: 'Save',
    //             showLoaderOnConfirm: true
    //         })
    //         .then((result) => {
    //             if (result.isConfirmed) {
    //                 editParty(id, party_name, result.value);
    //             }
    //         })
    // }

    // const editParty = (id, old_name, new_name) => {
    //     fetch(`${URL}/party?id=${id}&name=${new_name}`, {
    //             method: 'PATCH'
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: `${old_name} was changed to ${new_name}`,
    //                 showConfirmButton: false,
    //                 timer: 2500
    //             })
    //             displayParties();
    //         })
    // }

    // const deleteParty = (id, party_name) => {
    //     fetch(`${URL}/party?id=${id}`, {
    //             method: 'DELETE'
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: `${party_name} was deleted`,
    //                 showConfirmButton: false,
    //                 timer: 1000
    //             })
    //             displayParties();
    //         })
    // }

    // const validateInputs = async(data, callback) => {
    //     if (data.length > 0)
    //         return callback(true);
    //     else
    //         return callback(false);
    // }

    // const makeAPICall = async(data, callback) => {
    //     fetch(`${URL}/party?name=${data.party_name}&id=${data.election_id}`, {
    //             method: "POST"
    //         })
    //         .then(response => response.json())
    //         .then(data => callback(data))
    //         .catch(err => {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: `Party name "${party_name.value}" was not created`,
    //                 showConfirmButton: false,
    //                 timer: 2500
    //             })
    //         })
    // }

    // const enableBtn = (id) => document.querySelector(id).disabled = false;

    // const disableBtn = (id) => document.querySelector(id).disabled = true;
}