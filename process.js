// Create event listener for window load
// when window is loaded, fetch JSON data
window.onload = () => {
    const speech = new SpeechSynthesisUtterance("Page Loaded");
    window.speechSynthesis.speak(speech);
    
    // fetch JSON Data
    fetch('data.json')
    // convert data string back into JSON format
    .then(response => response.json())
    .then(
        // pass data to a function called displayData
        data => {
            displayData(data);
        }
    )
    // If there is error log it in console
    .catch(error => console.error('Error: ', error))
};


// Create and format data to display on screen
function displayData(data) 
{
    // reference our div in index.html
    const displayData = document.getElementById("dataDisplay");

    // loop through JSON data, display each key/value in html
    data.forEach(
        item => {
            // create div
            const div = document.createElement("div");
            div.classList.add("SCPCard");
            // Format layout of data for display
            const content = `
            <div class="image">
                <img src="assets/${item.subject}.jpg" alt="${item.subject}">
                <h1>Item #: ${item.subject}</h1>
                <h1>Object Class: ${item.class}</h1>
            </div>
            <br><strong>Containment Procedures: </strong> ${item.containment}
            <br><br><strong>Description: </strong> ${item.summary}
            <br>`;

            // Create button for text to speech
            const speechbutton = document.createElement('button');
            speechbutton.textContent = "Read Description Aloud";
            // Adds ID to button with same name as the subject
            speechbutton.id = item.subject;
            // when button clicked read back name
            const monster = item.subject + ". " + item.class + ". " + item.summary;

            //--- Button Event Listener
            speechbutton.addEventListener('click', ()=>{speakText(monster, item.subject)});

            
            // Append divs and button to index page
            div.innerHTML = content;
            div.appendChild(speechbutton);
            displayData.appendChild(div);
            
        }
    );

}

// Var to track what the current playing button is
let currentbutton; 

// When button is clicked
async function speakText(text, subject)
{
    // Set Speech and Synth Variables and button context
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance(text);
    const button = document.getElementById(subject);

    // If the synth is already speaking cancel it and reset button
    if (synth.speaking) {
        synth.cancel();
        currentbutton.style.border = "2px solid var(--darkgraybg)";
        currentbutton.textContent = "Read Description Aloud";
    }

    // If synth isnt currently speaking (or got canceled from the above if), 
    // and the button clicked is not the "current button" (It would just keep playing the same SCP over instead of canceling)
    // Speak the text and set "current button" to button that was clicked
    if (!synth.speaking && button != currentbutton) {
        synth.speak(speech);
        currentbutton = button;
    }

    // When speech starts set button border to red and change message
    speech.onstart = () => {
        button.style.border = "2px solid red";
        button.textContent = "Cancel Reading";
    };

    // When speech ends reset the button and set "Current button" to null
    speech.onend = () => {
        button.style.border = "2px solid var(--darkgraybg)";
        button.textContent = "Read Description Aloud";
        currentbutton = null;
    };
}
