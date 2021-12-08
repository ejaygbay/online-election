const URL = window.location.origin;

const getContestants = async(election_id) => {
    console.log("Election ID:::", URL);
    fetch(`${URL}/contestant`);

    // fetch(`${URL}/contestant?election_id=${election_id}`)
    //     // .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(err => { console.log("Error+>>>>>>>>>>>>>>", err) })
}

// getComputedStyle();
getContestants('86b60f63-d9c6-400f-8368-f72bedf1995c');

// queryContestants('86b60f63-d9c6-400f-8368-f72bedf1995c', result => {
//     console.log("CONTESTANT$$$$$$", result[0].party.dataValues.party_name);
//     console.log("CONTESTANT$$$$$$", result[0].position.dataValues.position_name);
// })