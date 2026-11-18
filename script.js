const SEARCH_ENGINES = {
    google: { name: "Google", url: "https://www.google.com/search?q=" },
    bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
    duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" }
};

function buildSearchQuery(query, fileType, searchPoint) {
    const terms = [query.trim()];

    // Keep a normal full-text search by default; filters apply only when selected.
    if (fileType) terms.push(`filetype:${fileType}`);
    if (searchPoint === "article") terms.push("article");
    else if (searchPoint === "book") terms.push("book");
    else if (searchPoint) terms.push(`site:${searchPoint}`);

    return terms.join(" ");
}

function performSearch() {
    const input = document.getElementById("searchQuery");
    const query = input.value.trim();
    const status = document.getElementById("searchStatus");

    if (!query) {
        status.textContent = "Lütfen aramak istediğiniz kelimeyi yazın.";
        input.focus();
        return;
    }

    const fileType = document.querySelector('input[name="fileType"]:checked')?.value || "";
    const searchPoint = document.querySelector('input[name="searchPoint"]:checked')?.value || "";
    const engine = SEARCH_ENGINES[document.getElementById("searchEngine").value] || SEARCH_ENGINES.google;
    const searchUrl = `${engine.url}${encodeURIComponent(buildSearchQuery(query, fileType, searchPoint))}`;

    // Open synchronously from the submit event to avoid popup-blocker false positives.
    const resultTab = window.open(searchUrl, "_blank", "noopener,noreferrer");
    if (!resultTab) {
        window.location.assign(searchUrl);
        return;
    }

    status.textContent = `${engine.name} araması yeni sekmede açıldı.`;
}

function redirectVirusTotal() {
    const url = "https://www.virustotal.com/";
    const resultTab = window.open(url, "_blank", "noopener,noreferrer");
    if (!resultTab) window.location.assign(url);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchForm").addEventListener("submit", event => {
        event.preventDefault();
        performSearch();
    });
});
