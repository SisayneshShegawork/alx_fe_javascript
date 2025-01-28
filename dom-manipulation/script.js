const quotes = [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
      { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteForm = document.getElementById('addQuoteForm');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    function addQuote(event) {
      event.preventDefault(); // Prevent form submission from reloading the page

      const quoteText = newQuoteText.value.trim();
      const quoteCategory = newQuoteCategory.value.trim();

      if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        newQuoteText.value = ""; // Clear the input fields
        newQuoteCategory.value = "";
        alert('New quote added successfully!');
      } else {
        alert('Please fill out both fields.');
      }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteForm.addEventListener('submit', addQuote);