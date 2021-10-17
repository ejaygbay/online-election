const URL = window.location.origin;

const displayPositions = (data) => {
    let table = document.querySelector("tbody");
    let position_data = data.reverse();

    table.innerHTML = "";
    position_data.forEach((ele, index) => {
        let html = `<tr id=${ele.id}>
                    <th scope="row">${index + 1}.</th>
                    <td id=name-${ele.id}>${ele.position_name}</td>
                    <td>
                        <button id=${ele.id}-edit-btn class="action-btn edit btn outline btn-outline-primary btn-floating">
                            <i id=${ele.id}-edit class="edit fas fa-pencil-alt"></i>
                        </button>
                        <button id=${ele.id}-del-btn type="button" class="action-btn delete btn btn-outline-danger btn-floating">
                            <i id=${ele.id}-del class="delete fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;

        table.insertAdjacentHTML('beforeend', html);
    });

    document.querySelectorAll(".action-btn").forEach(ele => {
        ele.addEventListener("click", (e) => {
            let id = e.target.id.split("-")[0];
            let classes = e.target.classList;
            let position_name = document.getElementById(`name-${id}`).innerHTML;

            classes.forEach(ele => {
                if (ele === 'edit') {
                    displayPositionNameForEditing(id, position_name);
                } else if (ele === 'delete') {
                    deletePosition(id, position_name);
                }
            })
        })
    })
}

const getElections = () => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.querySelector("#elections-dropdown");
            let dropdown2 = document.querySelector("#elections-dropdown2");
            let html = `<option value="" disabled selected>Select Election</option>`;

            data = data.reverse();

            dropdown.innerHTML = "";
            dropdown2.innerHTML = "";

            dropdown.insertAdjacentHTML('beforeend', html);
            dropdown2.insertAdjacentHTML('beforeend', html);

            data.forEach(ele => {
                let html = `<option value="${ele.id}">${ele.election_name}</option>`;
                dropdown.insertAdjacentHTML('beforeend', html);
                dropdown2.insertAdjacentHTML('beforeend', html);
            });
        })
}

document.getElementById('elections-dropdown2').addEventListener("change", () => {
    let election_id = document.getElementById('elections-dropdown2').value;

    fetch(`${URL}/position?id=${election_id}`)
        .then(response => response.json())
        .then(data => {
            data = data.reverse();
            displayPositions(data);
        })
})



document.querySelector("#create-position").addEventListener("click", (e) => {
    let position_name = document.querySelector('.position-name').value;
    let election_selected = document.getElementById('elections-dropdown').value;

    fetch(`${URL}/position?name=${position_name}&id=${election_selected}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                    icon: 'success',
                    title: `Position name "${position_name}" was created`,
                    showConfirmButton: false,
                    timer: 2500
                })
                // document.querySelector("#new-position-name").value = "";
                // displayParties();
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Position name "${position_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
})

getElections();