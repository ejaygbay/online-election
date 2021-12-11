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

    // {
    // let contestant_id = data[0].id;
    // let full_name = `${data[0].full_name} ${data[0].middle_name} ${data[0].last_name}`;
    // let contestant_party = data[0].party.party_name;
    // let total_votes = 100;
    // let blob = data[0].photo.data;

    // let blob = "blob:http://localhost:3200/dd9de8b4-b9bc-4e71-8d68-c34e90bc5c52";
    // // const url = window.URL.createObjectURL(blob);

    // const reader = new FileReader();
    // reader.addEventListener('loadend', () => {
    //     // reader.result contains the contents of blob as a typed array
    //     console.log("Done:", reader.result);
    // });
    // reader.readAsArrayBuffer(blob);
    // console.log("Reader>>", reader);

    // // let img = new Image()
    // // img.onload = () => {
    // //     URL.revokeObjectURL(url)
    // //     resolve(img)
    // // }
    // // img.src = url
    // console.log(data[0].photo);
    // // console.log("PHOTO::::", blob)
    // document.querySelector("#test-blob").src = "";
    // })
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

// getComputedStyle();
// getContestants('86b60f63-d9c6-400f-8368-f72bedf1995c');

// queryContestants('86b60f63-d9c6-400f-8368-f72bedf1995c', result => {
//     console.log("CONTESTANT$$$$$$", result[0].party.dataValues.party_name);
//     console.log("CONTESTANT$$$$$$", result[0].position.dataValues.position_name);
// })

const displayContestants = (data) => {
    let html = ``;
    console.log(data)
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