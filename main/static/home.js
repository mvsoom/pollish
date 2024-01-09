$(document).ready(function () {
    // Function to make a request to ChatGPT API
    function improveLastSentenceWithChatGPT() {
        let textArea = $('#textEdit');
        let text = textArea.val();

        // Find the last sentence
        let lastPeriodIndex = text.lastIndexOf('.');
        if (lastPeriodIndex !== -1) {
            let lastSentence = text.substring(lastPeriodIndex + 1).trim();

            // Make a request to ChatGPT API (replace 'YOUR_OPENAI_API_KEY' with your actual API key)
            const apiKey = 'XXX';
            const apiUrl = 'https://api.openai.com/v1/chat/completions';
            const messages = [{ 'role': 'system', 'content': 'You are a helpful assistant.' }, { 'role': 'user', 'content': `Improve the following sentence: ${lastSentence}` }];

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.choices && data.choices.length > 0) {
                    let improvedSentence = data.choices[0].message.content.trim();
                    let newText = text.substring(0, lastPeriodIndex + 1) + " " + improvedSentence;

                    // Update the text area
                    textArea.val(newText);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Event listener for keypress events
    $('#textEdit').on('keypress', function (e) {
        // Check if Ctrl key is pressed (event.ctrlKey) and if the pressed key is "."
        if (e.ctrlKey && e.key === '.') {
            console.log('Ctrl+. pressed');
            improveLastSentenceWithChatGPT();
        }
    });
});