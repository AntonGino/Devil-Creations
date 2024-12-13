document.addEventListener('DOMContentLoaded', async function () {
    const generateButton = document.querySelector('.btn');
    const inputArea = document.querySelector('.input-area textarea');
    const outputArea = document.querySelector('.output-area');
    
    // Fetch the API key from config.json
    const fetchApiKey = async () => {
        try {
            const response = await fetch('config.json');
            const data = await response.json();
            return data.apiKey;
        } catch (error) {
            console.error('Error fetching API key:', error);
            alert('Failed to load API key.');
            return null;
        }
    };

    // Function to query the API
    const queryImage = async (prompt, apiKey) => {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ inputs: prompt }),
                }
            );

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            return await response.blob();
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate the image. Please try again.');
            return null;
        }
    };

    // Function to save history to cookies
    const saveToHistory = (prompt, imageUrl) => {
        const history = getHistory(); // Retrieve existing history
        history.push({ prompt, imageUrl }); // Add new entry

        // Save updated history back to cookies (JSON stringified)
        document.cookie = `history=${encodeURIComponent(JSON.stringify(history))}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
    };

    // Function to retrieve history from cookies
    const getHistory = () => {
        const cookies = document.cookie.split("; ");
        const historyCookie = cookies.find(row => row.startsWith("history="));

        if (historyCookie) {
            const historyValue = historyCookie.split("=")[1];
            try {
                return JSON.parse(decodeURIComponent(historyValue)); // Parse the history
            } catch (error) {
                console.error("Error parsing history from cookies:", error);
            }
        }

        return []; // Return an empty array if no history exists
    };

    // Function to display history in the history viewer
    const displayHistory = () => {
        const historyContainer = document.querySelector('.history-container');
        const deleteButton = document.querySelector('.delete-history-btn'); // Select the delete button
        const generateButton = document.querySelector('.generate-history-btn'); // Select the generate button
        const history = getHistory(); // Retrieve history

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>No history found.</p>'; // Display message if no history
            deleteButton.style.display = 'none'; // Hide delete button
            generateButton.style.display = 'block'; // Show generate button
            return;
        }

        // Render history items
        historyContainer.innerHTML = history
            .map(
                (item, index) => `
                <div class="history-item">
                    <p><strong>Prompt ${index + 1}:</strong> ${item.prompt}</p>
                    <img src="${item.imageUrl}" alt="Generated Image ${index + 1}" class="history-image">
                    <a href="${item.imageUrl}" download="hist-download-${index + 1}.png" class="download-button">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
            `
            )
            .join('');

        deleteButton.style.display = 'block'; // Show delete button when there is history
        generateButton.style.display = 'none'; // Hide generate button when there is history
    };

    // Call displayHistory on page load to check for existing history
    displayHistory();

    // Function to clear history
    const clearHistory = () => {
        document.cookie = "history=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear history cookie
        displayHistory(); // Refresh the history display
    };

    // Function to show loading animation
    const showLoadingAnimation = () => {
        outputArea.innerHTML = `
            <div class="ui-abstergo">
                <div class="abstergo-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="ui-text">
                    Generating
                    <div class="ui-dot"></div>
                    <div class="ui-dot"></div>
                    <div class="ui-dot"></div>
                </div>
            </div>
        `;
        generateButton.innerHTML=`<span class="spinner"></span> Generating...`;
        generateButton.disabled=true;
    };

    // Function to hide loading animation
    const hideLoadingAnimation = () => {
        generateButton.innerHTML = `
            <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
            <span class="text">Generate</span>
        `; // Reset button text with spark effect
        generateButton.disabled = false; // Re-enable the button
    };

    // Function to show error message
    const showError = (message) => {
        outputArea.innerHTML = `
            <div class="error-message">
                <span class="material-icons" style="font-size: 48px; color: #d65563;">error</span>
                <p>${message}</p>
            </div>
        `;
    };

    // Handle image generation
    const generateImage = async (prompt, apiKey) => {
        showLoadingAnimation(); // Show loading animation

        try {
            const imageBlob = await queryImage(prompt, apiKey);
            if (imageBlob) {
                const imageUrl = URL.createObjectURL(imageBlob);
                outputArea.innerHTML = `
                    <img src="${imageUrl}" alt="Generated Image" class="generated-image">
                    <a href="${imageUrl}" download="generated-image.png" class="download-button">
                        <i class="fas fa-download"></i> Download Image
                    </a>
                `;
                saveToHistory(prompt, imageUrl); // Save to history after generating the image
                displayHistory(); // Call displayHistory to update the history view
            } else {
                showError('Image generation failed. Please try again.'); // Show error if no imageBlob
            }
        } catch (error) {
            console.error("Error generating image:", error);
            showError('Image generation failed. Please try again.'); // Show error message for any error
        } finally {
            hideLoadingAnimation(); // Hide loading animation and reset button
        }
    };

    // Add event listener to the generate button
    generateButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const prompt = inputArea.value.trim();
        const apiKey = await fetchApiKey(); // Ensure you have the API key
        if (prompt) {
            generateImage(prompt, apiKey); // Call the generate image function
        } else {
            showError('Please enter a prompt to generate an image!'); // Show error if prompt is empty
        }
    });

    // Add event listener for the delete history button
    document.querySelector('.delete-history-btn').addEventListener('click', clearHistory);

    // Add event listener for the generate history button
    document.querySelector('.generate-history-btn').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default button behavior
        const targetSection = document.getElementById('generate'); // Get the generating section
        const headerOffset = 60; // Offset for the fixed navbar
        const elementPosition = targetSection.offsetTop; // Get the position of the generating section
        const offsetPosition = elementPosition - headerOffset; // Calculate the position to scroll to

        // Smooth scroll to the generating section
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});
