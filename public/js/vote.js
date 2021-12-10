const URL2 = window.location.origin;
let contestants_ele = document.querySelector("#contestants");
let election_dropdown = document.getElementById('elections-dropdown');

const getElections = async() => {
    return await fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => data)
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

const getContestants = async(election_id) => {
    // console.log("Election ID:::", URL2);

    fetch(`${URL2}/contestant?election_id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            let contestant_id = data[0].id;
            let full_name = `${data[0].full_name} ${data[0].middle_name} ${data[0].last_name}`;
            let contestant_party = data[0].party.party_name;
            let total_votes = 100;
            let blob = data[0].photo.data;

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
        })
        .catch(err => { console.log("Error+>>>>>>>>>>>>>>", err) })
}

// getComputedStyle();
getContestants('86b60f63-d9c6-400f-8368-f72bedf1995c');

// queryContestants('86b60f63-d9c6-400f-8368-f72bedf1995c', result => {
//     console.log("CONTESTANT$$$$$$", result[0].party.dataValues.party_name);
//     console.log("CONTESTANT$$$$$$", result[0].position.dataValues.position_name);
// })

const displayContestants = (data) => {
    let html = ``;
    // contestants_ele
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
        })
}