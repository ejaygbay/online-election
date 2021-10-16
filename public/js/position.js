const URL = window.location.origin;

const displayElections = async() => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.querySelector("#elections-dropdown");
            data = data.reverse();
            console.log(data)

            dropdown.innerHTML = "";
            let html = `<option value="" disabled selected>Select Election</option>`;
            dropdown.insertAdjacentHTML('beforeend', html);

            data.forEach(ele => {
                let html = `<option value="${ele.id}">${ele.election_name}</option>`;
                dropdown.insertAdjacentHTML('beforeend', html);
            });

            // document.querySelectorAll(".action-btn").forEach(ele => {
            //     ele.addEventListener("click", (e) => {
            //         let id = e.target.id.split("-")[0];
            //         let classes = e.target.classList;
            //         let party_name = document.getElementById(`name-${id}`).innerHTML;

            //         classes.forEach(ele => {
            //             if (ele === 'edit') {
            //                 displayPartyNameForEditing(id, party_name);
            //             } else if (ele === 'delete') {
            //                 deleteParty(id, party_name);
            //             }
            //         })
            //     })
            // })
        })
}

displayElections();