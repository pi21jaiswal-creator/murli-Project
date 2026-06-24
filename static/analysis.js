async function loadFrequency() {

    const response =
        await fetch("/api/word-frequency");

    const data =
        await response.json();

    const tbody =
        document.querySelector("#wordTable tbody");

    tbody.innerHTML = "";

    const grouped = {};

    data.forEach(([word, count]) => {

        if (!grouped[count]) {
            grouped[count] = [];
        }

        grouped[count].push(word);

    });

    Object.keys(grouped)
        .sort((a, b) => b - a)
        .forEach(count => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${count}</td>
                <td>${grouped[count].join(", ")}</td>
            `;

            tbody.appendChild(row);

        });

}