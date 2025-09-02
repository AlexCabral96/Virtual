document.addEventListener("DOMContentLoaded", () => {
    // Your JS stays the same (not touched)
    const packPointsData = [
        { symbol: "◊", value: 35 }, { symbol: "◊◊", value: 70 }, { symbol: "◊◊◊", value: 150 },
        { symbol: "◊◊◊◊", value: 500 }, { symbol: "☆", value: 400 }, { symbol: "☆☆", value: 1250 },
        { symbol: "☆☆☆", value: 1500 }, { symbol: "✷", value: 1000 }, { symbol: "✷✷", value: 1350 },
        { symbol: "♛", value: 2500 }
    ];
    const tradePointsData = [
        { symbol: "◊", value: 0 }, { symbol: "◊◊", value: 0 }, { symbol: "◊◊◊", value: 120 },
        { symbol: "◊◊◊◊", value: 500 }, { symbol: "☆", value: 400 }, { symbol: "☆☆", value: "-" },
        { symbol: "☆☆☆", value: "-" }, { symbol: "✷", value: "-" }, { symbol: "✷✷", value: "-" },
        { symbol: "♛", value: "-" }
    ];
    const packPointsAvailableData = [
        { pack: "Genetic Apex", value: 0 }, { pack: "Mythical Island", value: 30 }, { pack: "Space-Time Smackdown", value: 40 },
        { pack: "Triumphant Light", value: 0 }, { pack: "Shining Revelry", value: 0 }, { pack: "Celestial Guardians", value: 0 },
        { pack: "Extradimensional Crisis", value: 150 }, { pack: "Eevee Grove", value: 10 }, { pack: "Wisdow of Sea and Sky", value: 565 },
        { pack: "Secluded Springs", value: 85 }
    ];

    function fillTable(tableId, data, keys) {
        const tbody = document.getElementById(tableId).querySelector('tbody');
        data.forEach(item => {
            const tr = document.createElement('tr');
            keys.forEach(k => {
                const td = document.createElement('td');
                td.textContent = item[k];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    fillTable('packPointsTable', packPointsData, ['symbol', 'value']);
    fillTable('tradePointsTable', tradePointsData, ['symbol', 'value']);
    fillTable('packPointsAvailableTable', packPointsAvailableData, ['pack', 'value']);

    const uglyRarities = ["◊", "◊◊", "◊◊◊"];

    function computeBuckets(data) {
        const result = { total: {}, ugly: {}, fancy: {} };

        data.forEach(entry => {
            const bucket = entry.bucket;
            const rarity = entry.rarity;

            if (!result.total[bucket]) {
                result.total[bucket] = 0;
                result.ugly[bucket] = 0;
                result.fancy[bucket] = 0;
            }

            result.total[bucket]++;

            if (uglyRarities.includes(rarity)) {
                result.ugly[bucket]++;
            } else {
                result.fancy[bucket]++;
            }
        });

        return result;
    }

    let allData = [];
    Object.values(dataSets).forEach(set => {
        allData = allData.concat(set);
    });

    const buckets = computeBuckets(allData);

    function transformForTable(obj) {
        return Object.entries(obj).map(([bucket, value]) => ({
            bucket,
            value
        }));
    }

    fillTable("totalTable", transformForTable(buckets.total), ["bucket", "value"]);
    fillTable("uglyCardsTable", transformForTable(buckets.ugly), ["bucket", "value"]);
    fillTable("fancyCardsTable", transformForTable(buckets.fancy), ["bucket", "value"]);

    const rightColumn = document.getElementById('right-column');

    Object.keys(dataSets).sort().reverse().forEach(setKey => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        const h3 = document.createElement('h3');
        h3.textContent = setKey.toUpperCase();
        wrapper.appendChild(h3);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = `<tr><th>#</th><th>Card</th><th>Bucket</th><th>Rarity</th></tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        dataSets[setKey].forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${item.id}</td><td>${item.card}</td><td>${item.bucket}</td><td>${item.rarity}</td>`;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrapper.appendChild(table);
        rightColumn.appendChild(wrapper);
    });
});