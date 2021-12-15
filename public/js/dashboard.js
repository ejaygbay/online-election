const URL = window.location.origin;
let contestants_ele = document.querySelector("#contestants-results");
let election_dropdown = document.getElementById('elections-dropdown');

document.querySelector("#registered-voters").innerHTML = 10;

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

const getVoterCounts = () => {
    fetch(`${URL}/voter/count`)
        .then(response => response.json())
        .then(data => {
            document.querySelector("#registered-voters").innerHTML = data.count;
        })
}
getVoterCounts();

/**
 * Display election
 * @param {array} data array of objects
 * [{id: exampleID, election_name: "Test Election"}]
 */
const getElections = async() => {
    return await fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => data)
}

const getPositions = async(election_id) => {
    return await fetch(`${URL}/position?id=${election_id}`)
        .then(response => response.json())
        .then(data => data)
}

const getContestants = async(election_id) => {
    return await fetch(`${URL}/contestant?election_id=${election_id}`)
        .then(response => response.json())
        .then(data => data)
        .catch(err => { console.log("Error+>>>>>>>>>>>>>>", err) })
}

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
    data.forEach(ele => {
        let id = ele.id;
        let position_name = ele.position_name;

        let html = `
            <article id="${id}">
                <h2 id="${id}_${position_name}">${position_name}</h2>
                <div class="row" id="${id}_contestants"></div>
            </article>
            `;

        contestants_ele.insertAdjacentHTML('beforeend', html);
    })
}

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

if (election_dropdown) {
    getElections().then(data => displayElections(data));

    election_dropdown.addEventListener("change", async() => {
        contestants_ele.innerHTML = "";
        displayPositions(await getPositions(election_dropdown.value));
        // displayContestants(await getContestants(election_dropdown.value));
    })
} else {
    // contestants_ele.innerHTML = "";
    // getPositions('').then(data => displayPositions(data));

    // getContestants('')
    //     .then(data => displayContestants(data));
}