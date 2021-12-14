const URL = window.location.origin;
let contestants_ele = document.querySelector("#contestants");
let election_dropdown = document.getElementById('elections-dropdown');

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
            <div class="col-xl-3 col-sm-6 col-12 mb-4 ">
                <div class="card">
                    <div class="card-body ">
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
                <button id=${contestant_id} class="btn btn-primary btn-block mb-4 vote-btn">Vote</button>
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

const voteForContestant = (contestant_id) => {
    let contestant_votes_ele = document.querySelector(`#${contestant_id}_votes`);
    let current_votes = parseInt(contestant_votes_ele.innerHTML);

    fetch(`${URL}/contestant?id=${contestant_id}&vote=true`, {
            method: 'PATCH'
        })
        .then(response => response.json())
        .then(data => {
            contestant_votes_ele.innerHTML = current_votes + 1;
            Swal.fire({
                icon: 'success',
                title: `Thank for voting!!!`,
                showConfirmButton: false,
                timer: 2500
            })
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