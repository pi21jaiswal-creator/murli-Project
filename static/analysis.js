async function loadBucket(
    characterCount
)
{
    const response =
        await fetch(
            `/api/character-bucket/${characterCount}`
        );

    const data =
        await response.json();

    const tbody =
        document.querySelector(
            "#wordTable tbody"
        );

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

function buildButtons()
{
    const container =
        document.getElementById(
            "bucketButtons"
        );

    for (
        let count = 1;
        count <= 10;
        count++
    )
    {
        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            `${count} Character`;

        button.onclick =
            () => loadBucket(count);

        container.appendChild(
            button
        );
    }
}

buildButtons();