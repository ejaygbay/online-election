const URL = window.location.origin;

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


const displayvoterNameForEditing = (id, voter_name) => {
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

let img_input_ele = document.getElementById('voter-img');
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
document.querySelector("#add-voter-btn").addEventListener("click", (e) => {
    let first_name = document.querySelector('#first-name').value;
    let middle_name = document.getElementById('middle-name').value;
    let last_name = document.querySelector('#last-name').value;
    let election_selected = document.getElementById('elections-dropdown').value;
    let voter_img = document.getElementById('img-preview').src;

    fetch(`${URL}/voter`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: first_name,
                middle_name: middle_name,
                last_name: last_name,
                election_id: election_selected,
                voter_img: voter_img
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 0) {
                Swal.fire({
                    icon: 'success',
                    title: `Voter name <b>${first_name} ${middle_name} ${last_name}</b> was created`,
                    showConfirmButton: false,
                    timer: 2500
                })
                document.querySelector("#voter-name").value = "";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: `Voter name <b>${first_name} ${middle_name} ${last_name}</b> already exist`,
                    showConfirmButton: false,
                    timer: 2500
                })
            }


            document.querySelector("#voter-name").focus();
            // displayvoters();
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `voter name "${voter_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
})

getElections();


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

/**
 * Send my github link
 * List my strength
 * What languages i'm good at
 * what framework i'm good at
 * what are my strength and weeknesses
 * 
 * And what I want to know
 */

{
    // const URL = window.location.origin;

    // const displayParties = () => {
    //     fetch(`${URL}/party`)
    //         .then(response => response.json())
    //         .then(data => {
    //             let table = document.querySelector("tbody");
    //             let party_data = data.reverse();

    //             table.innerHTML = "";
    //             party_data.forEach((ele, index) => {
    //                 let html = `<tr id=${ele.id}>
    //                      <th scope="row">${index + 1}.</th>
    //                      <td id=name-${ele.id}>${ele.party_name}</td>
    //                      <td>
    //                          <button id=${ele.id}_edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
    //                              <i id=${ele.id}_edit class="edit fas fa-pencil-alt"></i>
    //                          </button>
    //                          <button id=${ele.id}_del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
    //                              <i id=${ele.id}_del class="delete fas fa-trash-alt"></i>
    //                          </button>
    //                      </td>
    //                  </tr>`;

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

    // displayParties();

    // // Create Party Button
    // document.querySelector('#create-party-btn').addEventListener('click', (e) => {
    //     let party_name = document.querySelector("#new-party-name").value;
    //     fetch(`${URL}/party?name=${party_name}`, {
    //             method: "POST"
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 0) {
    //                 Swal.fire({
    //                     icon: 'success',
    //                     title: `Party name "${party_name}" was created`,
    //                     showConfirmButton: false,
    //                     timer: 2500
    //                 })
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: `Party name "${party_name}" already exist`,
    //                     showConfirmButton: false,
    //                     timer: 2500
    //                 })
    //             }

    //             document.querySelector("#new-party-name").value = "";
    //             document.querySelector("#new-party-name").focus();
    //             displayParties();
    //         })
    //         .catch(err => {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: `Party name "${party_name}" was not created`,
    //                 showConfirmButton: false,
    //                 timer: 2500
    //             })
    //         })

    //     // document.querySelector("#new-party-name").classList.remove("form-control");
    //     // document.querySelector("#new-party-name").classList.add("form-control");
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
}