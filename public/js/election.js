const URL = "http://localhost:3100";

const displayElections = () => {
    fetch(`${URL}/election`)
        .then(response => response.json())
        .then(data => {
            let table = document.querySelector("tbody");
            let election_data = data.reverse();

            table.innerHTML = "";
            election_data.forEach((ele, index) => {
                let html = `<tr id=${ele.id}>
                    <th scope="row">${index + 1}.</th>
                    <td>${ele.election_name}</td>
                    <td>
                        <button class="btn outline btn-outline-primary btn-floating">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-floating">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;

                table.insertAdjacentHTML('beforeend', html);
            });
        })
}
displayElections();

// Create Election Button
document.querySelector('#create-election-btn').addEventListener('click', (e) => {
    let election_name = document.querySelector("#new-election-name").value;
    fetch(`${URL}/election?name=${election_name}`, {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: `Election name "${election_name}" was created`,
                showConfirmButton: false,
                timer: 2500
            })
            document.querySelector("#new-election-name").value = "";
            displayElections();
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: `Election name "${election_name}" was not created`,
                showConfirmButton: false,
                timer: 2500
            })
        })
})