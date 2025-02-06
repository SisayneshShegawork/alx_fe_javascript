const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

function saveQuotesToLocalStorage() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available. Please add a new one.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>Category: ${randomQuote.category}</em></p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }
    
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotesToLocalStorage();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    
    showRandomQuote();
}

document.getElementById("addQuoteButton").addEventListener("click", addQuote);

document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    fetchQuotesFromServer();
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        document.getElementById("quoteDisplay").innerHTML = `<p>"${lastViewedQuote.text}"</p><p><em>Category: ${lastViewedQuote.category}</em></p>`;
    } else {
        showRandomQuote();
    }
});

function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    categorySelect.innerHTML = '<option value="all">All</option>';
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function filterQuote() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerText = "No quotes available for this category.";
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>Category: ${randomQuote.category}</em></p>`;
}

document.getElementById("categoryFilter").addEventListener("change", filterQuote);

function exportToJsonFile() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "quotes.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotesToLocalStorage();
                populateCategories();
                alert("Quotes imported successfully!");
                showRandomQuote();
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            alert("Error reading file.");
        }
    };
    reader.readAsText(file);
}

document.getElementById("importQuotes").addEventListener("change", importFromJsonFile);

async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://mockapi.io/quotes"); // Replace with actual API endpoint
        const serverQuotes = await response.json();
        quotes.push(...serverQuotes);
        saveQuotesToLocalStorage();
        populateCategories();
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

async function syncQuotes() {
    try {
        await fetch("https://mockapi.io/quotes", { // Replace with actual API endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quotes)
        });
        alert("Quotes synced successfully with server!");
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
}

document.getElementById("syncQuotes").addEventListener("click", syncQuotes);
