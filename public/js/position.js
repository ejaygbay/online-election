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
    let position_name = document.querySelector('.position-name');
    let election_selected = document.getElementById('elections-dropdown');
    console.log(election_selected.value)
})

displayElections();