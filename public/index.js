async function create(element) {
    element.disabled = true;
    element.innerText = "Processing...";

    const params = {
        method: "POST",
        mode: "cors",
    }

    const response = await fetch("/create", params);
    const json = await response.json();

    if (json.error) alert(json.error_description);

    watch(json.filename)
}

let timer;

function watch(filename) {
    timer = setInterval(async () => {
        const params = {
            method: "GET",
            mode: "cors",
        }

        const response = await fetch("/exports/" + filename, params);

        if (response.status !== 200)
            return;

        clearInterval(timer);

        const button = document.querySelector("button#download");
        button.disabled = false;
        button.innerText = "Download";

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = filename;
        a.href = url;
        document.body.appendChild(a);
        a.click();
    }, 5000);
}