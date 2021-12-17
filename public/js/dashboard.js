const URL = window.location.origin;
let contestants_ele = document.querySelector("#contestants-results");
let election_dropdown = document.getElementById('elections-dropdown');

document.querySelector("#registered-voters").innerHTML = 10;

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

const displayContestants = (data) => {
    if (data.length > 0) {
        data.forEach(ele => {
            let position_id = ele.position.id;
            let election_contestants_ele = document.getElementById(`${position_id}_contestants`);
            let contestant_id = ele.id;
            let full_name = `${ele.first_name} ${ele.middle_name} ${ele.last_name}`;
            let contestant_party = ele.party.party_name;
            let total_votes = ele.votes;
            let img = ele.photo.data;

            let html = `
            <div class="col-xl-3 col-sm-6 col-12 mb-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between px-md-1 ">
                            <div class="align-self-center">
                                <img src="../public/images/user.jpg" class="img-fluid text-info fa-3x" />
                                <p class="mb-0">${full_name}</p>
                                <p class="mb-0"><b><i>${contestant_party}</b></i>
                                </p>
                            </div>
                            <div class="text-end ">
                                <h3 id=${contestant_id}_votes>${total_votes}</h3>
                                <p class="mb-0 ">Votes</p>
                            </div>
                        </div>
                        <div class="px-md-1 ">
                            <div class="progress mt-3 mb-1 rounded " style="height: 15px ">
                                <div class="progress-bar bg-info " role="progressbar " style="width: 80% " aria-valuenow="80 " aria-valuemin="0 " aria-valuemax="100 ">75</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            election_contestants_ele.innerHTML = '';
            election_contestants_ele.insertAdjacentHTML('beforeend', html);
        })

        document.querySelectorAll('.vote-btn').forEach(ele => {
            ele.addEventListener('click', e => voteForContestant(e.target.id))
        })
    }
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
        displayContestants(await getContestants(election_dropdown.value));
    })
} else {
    contestants_ele.innerHTML = "";
    getPositions('').then(data => displayPositions(data));

    getContestants('')
        .then(data => displayContestants(data));
}