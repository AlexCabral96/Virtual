document.addEventListener("DOMContentLoaded", () => {
    // ---- Pack & Trade Tables ----
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
        tbody.innerHTML = ''; // clear existing
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

    // ---- Overview Tables ----
    const uglyRarities = ["◊", "◊◊", "◊◊◊", "◊◊◊◊"];

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
            if (uglyRarities.includes(rarity)) result.ugly[bucket]++;
            else result.fancy[bucket]++;
        });
        return result;
    }

    let allData = [];
    Object.values(dataSets).forEach(set => allData = allData.concat(set));
    const buckets = computeBuckets(allData);

    function transformForTable(obj) {
        return Object.entries(obj).map(([bucket, value]) => ({ bucket, value }));
    }

    fillTable("totalTable", transformForTable(buckets.total), ["bucket", "value"]);
    fillTable("uglyCardsTable", transformForTable(buckets.ugly), ["bucket", "value"]);
    fillTable("fancyCardsTable", transformForTable(buckets.fancy), ["bucket", "value"]);

    // ---- Missing Cards Page ----
    const rightColumn = document.getElementById('right-column');

    function renderMissingCardsPage() {
        rightColumn.innerHTML = ''; // clear
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
    }

    // ---- Missions Page ----

    // Build a lookup (ids + names) for ONE set key
    function buildSetIndex(setKey) {
        const set = dataSets[setKey] || [];
        const ids = new Set();
        const names = new Set();
        set.forEach(item => {
            if (item.id != null) ids.add(Number(item.id));
            if (item.card) names.add(String(item.card).toLowerCase().trim());
        });
        return { ids, names };
    }

    // Normalize section title -> set key ("A1-a" -> "a1-a")
    function titleToSetKey(title) {
        return String(title).trim().toLowerCase();
    }

    function renderMissionsPage() {
        const container = document.getElementById("missions").querySelector(".missions-content");
        container.innerHTML = '';

        dataA1.sections.forEach(section => {
            const setKey = titleToSetKey(section.title);        // e.g. "a1-a"
            const idx = buildSetIndex(setKey);                  // ONLY this set

            // Section title
            const heading = document.createElement("h3");
            heading.textContent = section.title;
            container.appendChild(heading);

            // Row to hold all tables for this section
            const tablesRow = document.createElement("div");
            tablesRow.className = "right-tables";

            // Each table
            section.tables.forEach(tableData => {
                const wrapper = document.createElement("div");
                wrapper.className = "table-wrapper";

                // Table name
                const tableTitle = document.createElement("h4");
                tableTitle.textContent = tableData.tableName;
                tableTitle.style.textAlign = "center";
                wrapper.appendChild(tableTitle);

                const table = document.createElement("table");
                const thead = document.createElement("thead");
                thead.innerHTML = `<tr><th>#</th><th>Name</th><th>Rarity</th></tr>`;
                table.appendChild(thead);

                const tbody = document.createElement("tbody");
                tableData.cards.forEach(card => {
                    const tr = document.createElement("tr");

                    // Check ONLY this set: by id OR by normalized name
                    const hasId = idx.ids.has(Number(card.number));
                    const hasName = idx.names.has(String(card.name).toLowerCase().trim());
                    const presentInThisSet = hasId ;//|| hasName;

                    if (!presentInThisSet) tr.classList.add("missing-card"); // green

                    tr.innerHTML = `<td>${card.number}</td><td>${card.name}</td><td>${card.rarity}</td>`;
                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                wrapper.appendChild(table);
                tablesRow.appendChild(wrapper);
            });

            container.appendChild(tablesRow);
        });
    }

    // ---- For Trade Page (placeholder) ----
    function renderTradePage() {
        // For now just clear & show placeholder
        const container = document.getElementById("for-trade");
        container.querySelector("p").textContent = "For Trade Cards page (coming soon)";
    }

    // ---- Page switching ----
    function showPage(pageId) {
        document.querySelectorAll('.right-page').forEach(page => page.style.display = 'none');
        document.getElementById(pageId).style.display = 'block';
    }

    document.getElementById("btn-missing").addEventListener("click", () => {
        renderMissingCardsPage();
        showPage("missing-cards");
    });

    document.getElementById("btn-missions").addEventListener("click", () => {
        renderMissionsPage();
        showPage("missions");
    });

    document.getElementById("btn-trade").addEventListener("click", () => {
        renderTradePage();
        showPage("for-trade");
    });

    // Initial render
    renderMissingCardsPage();
});
