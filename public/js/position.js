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
        })
}

const getFormData = () => {

}



document.querySelector("#create-position").addEventListener("click", (e) => {
    let position_name = document.querySelector('.position-name').value;
    let election_selected = document.getElementById('elections-dropdown').value;
    console.log(election_selected.value)

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

displayElections();