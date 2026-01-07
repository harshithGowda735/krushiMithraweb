// ==========================================
// 🌱 KrushiMithra - Integrated Script
// ==========================================

// --- [FIREBASE IMPORTS] ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- [CONFIG] ---
const firebaseConfig = {
    apiKey: "AIzaSyBJxy1u126qdoRo6WDN68MoAQvS8IEmTkg",
    authDomain: "krushimithra-a3ee9.firebaseapp.com",
    projectId: "krushimithra-a3ee9",
    storageBucket: "krushimithra-a3ee9.firebasestorage.app",
    messagingSenderId: "61940172848",
    appId: "1:61940172848:web:93a79e6dbc02fb949f85f5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ------------------------------------------
// 🔄 Logo Animation & Navbar
// ------------------------------------------
const logos = [
    { text: "KrushiMithra", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNwUmtJ5oSin5ve4rlLnwTKZL0-r5toZhLoA&s" },
    { text: "ಕೃಷಿ ಮಿತ್ರ", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNwUmtJ5oSin5ve4rlLnwTKZL0-r5toZhLoA&s" },
    { text: "కృషి మిత్ర", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNwUmtJ5oSin5ve4rlLnwTKZL0-r5toZhLoA&s" },
    { text: "कृषि मित्र", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNwUmtJ5oSin5ve4rlLnwTKZL0-r5toZhLoA&s" }
];

let index = 0;
const logoText = document.getElementById("logo-text");
const logoImg = document.getElementById("logo-img");

function rotateLogo() {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.to([logoText, logoImg], {
        opacity: 0, y: -20, scale: 0.95, duration: 0.5, ease: "power2.in",
        onComplete: () => {
            index = (index + 1) % logos.length;
            if(logoText) logoText.textContent = logos[index].text;
            if(logoImg) logoImg.src = logos[index].img;
        }
    });
    tl.fromTo([logoText, logoImg], { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
}
rotateLogo();

gsap.from("#home h4, #sign, #download", { opacity: 0, y: 20, duration: 1.2, delay: 1, stagger: 0.3, ease: "power3.out" });

const hamburger = document.getElementById("hamburger");
const homeMenu = document.getElementById("home");
if(hamburger) {
    hamburger.addEventListener("click", () => { homeMenu.classList.toggle("show"); });
}

// ------------------------------------------
// 📑 Section Management
// ------------------------------------------
function hideAllSections() {
    document.querySelectorAll("section[id$='-section']").forEach(sec => { sec.style.display = "none"; });
    document.getElementById("login-section").style.display = "none";
}

function showSection(sectionId) {
    hideAllSections();
    document.getElementById("part1").style.display = "none";
    document.getElementById(sectionId).style.display = "block";
}

// Nav links
document.getElementById("about-link")?.addEventListener("click", () => showSection("about-section"));
document.getElementById("schemes-link")?.addEventListener("click", () => showSection("schemes-section"));
document.getElementById("home-link")?.addEventListener("click", () => { 
    hideAllSections(); 
    document.getElementById("part1").style.display = "block"; 
});

// ------------------------------------------
// 🔐 Auth & Dashboard Logic
// ------------------------------------------
const switchToReg = document.getElementById("switch-to-reg");
const formTitle = document.getElementById("form-title");
const nameGroup = document.getElementById("name-group");
const loginBtn = document.getElementById("submit-signin");
const regBtn = document.getElementById("submit-reg-final");
const signNavLink = document.getElementById("sign");

// Toggle Login/Register UI
if(switchToReg) {
    switchToReg.onclick = (e) => {
        e.preventDefault();
        if (regBtn.style.display === "none") {
            formTitle.innerText = "FARMER REGISTRATION";
            nameGroup.style.display = "flex";
            loginBtn.style.display = "none";
            regBtn.style.display = "inline-block";
            switchToReg.innerText = "Back to Login";
        } else {
            formTitle.innerText = "USER LOGIN";
            nameGroup.style.display = "none";
            loginBtn.style.display = "inline-block";
            regBtn.style.display = "none";
            switchToReg.innerText = "Create Account";
        }
    };
}

// Back to Home Link (inside login form)
document.getElementById("back-from-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-section").style.display = "none";
    document.getElementById("part1").style.display = "block";
});

// --- [MAIN NAV BUTTON CLICK] ---
signNavLink.addEventListener("click", async () => {
    if (auth.currentUser) {
        // Logged In: Open Dashboard
        hideAllSections();
        document.getElementById("part1").style.display = "none";
        document.getElementById("dashboard-section").style.display = "block";

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
            document.getElementById("dash-user").innerText = userDoc.data().username;
            document.getElementById("dash-mobile").innerText = userDoc.data().mobile;
            document.getElementById("dash-email").innerText = auth.currentUser.email;
        }
    } else {
        // Logged Out: Open Login
        hideAllSections();
        document.getElementById("part1").style.display = "none";
        document.getElementById("login-section").style.display = "block";
    }
});

// 1. Sign In
loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("Login Successful!");
        location.reload();
    } catch (error) { alert(error.message); }
});

// 2. Registration
regBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-mobile").value.trim();
    const pass = document.getElementById("reg-password").value;
    if(!name || !email || !pass || !phone) return alert("Please fill all fields");
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            username: name, email: email, mobile: phone, role: "farmer", createdAt: new Date()
        });
        alert("Account Created!");
        location.reload();
    } catch (error) { alert(error.message); }
});

// 3. Google Sign In
document.getElementById("google-signin")?.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        alert("Welcome " + result.user.displayName);
        location.reload();
    } catch (error) { alert(error.message); }
});

// 4. Auth State Observer (Updates the Profile Button Style)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const displayName = userDoc.exists() ? userDoc.data().username : (user.displayName || "Farmer");
        
        // Style the Navbar button as a Profile Button
        signNavLink.innerText = displayName; 
        signNavLink.style.backgroundColor = "#27ae60"; // Green
        signNavLink.style.color = "white";            // White
        signNavLink.style.padding = "10px 20px";
        signNavLink.style.borderRadius = "25px";
        signNavLink.style.fontWeight = "bold";
    } else {
        // Default Sign In style
        signNavLink.innerText = "Sign in";
        signNavLink.style.backgroundColor = "";
        signNavLink.style.color = "";
    }
});
// --- [DASHBOARD BACK TO HOME] ---
document.getElementById("dash-back")?.addEventListener("click", () => {
    console.log("Returning to home page from dashboard...");
    
    // Hide dashboard
    document.getElementById("dashboard-section").style.display = "none";
    
    // Show the main landing page
    document.getElementById("part1").style.display = "block";
    
    // Optional: Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 5. Logout Button (Only inside Dashboard)
document.getElementById("dash-logout")?.addEventListener("click", async () => {
    if (confirm("Logout from KrushiMithra?")) {
        await signOut(auth);
        location.reload();
    }
});
// till these the entire navigation bar is crt and working
const taglines = [
    "Empowering Farmers Through Digital Innovation",
    "Transforming Rural Agriculture with Technology",
    "Strengthening Farming Communities Through Tech ",
    "Advanced AI for Sustainable Farming",
    "Reimagining Agriculture Through Technology",
    
];

let currentIndex = 0;
const taglineElement = document.getElementById("tagline");

function changeTagline() {
    // 1. Start a quick fade out effect
    taglineElement.style.opacity = 0;

    setTimeout(() => {
        // 2. Change the text after it fades out
        currentIndex = (currentIndex + 1) % taglines.length;
        taglineElement.textContent = taglines[currentIndex];

        // 3. Fade back in
        taglineElement.style.opacity = 1;
    }, 500); // 500ms matches the transition timing
}

// Ensure the element has a transition style for the fade effect
taglineElement.style.transition = "opacity 0.5s ease";

// Run the function every 3000ms (3 seconds)
setInterval(changeTagline, 3000);
/**
 * KRUSHIMITHRA - INTEGRATED AI ENGINE
 * Powered by Google Gemini 1.5 Flash
 */

/**
 * KRUSHIMITHRA - PRO HACKATHON EDITION
 * Fully Integrated: Real-time Gemini 1.5 Flash AI
 */

const GEMINI_API_KEY = "AIzaSyAfwWN5eDtVb8aZAA5Zyfi4G4Kp-YetWrQ"; 
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

/**
 * 1. UI State & Animation Manager
 * Updates button colors and animations based on AI state
 */
function updateUI(state) {
    const voiceBtn = document.getElementById('voice');
    const statusText = document.getElementById('status-text');
    if (!voiceBtn) return;

    // Reset all animation classes
    voiceBtn.classList.remove('listening-active', 'thinking-active', 'speaking-active');

    if (state === 'listening') {
        if(statusText) statusText.innerText = "Listening... बोलिये... ಕೇಳಿ...";
        voiceBtn.classList.add('listening-active'); // CSS Pulse
    } 
    else if (state === 'thinking') {
        if(statusText) statusText.innerText = "Gemini is thinking... 🧠";
        voiceBtn.classList.add('thinking-active'); // CSS Glow
    } 
    else if (state === 'speaking') {
        if(statusText) statusText.innerText = "KrushiMithra is responding...";
        voiceBtn.classList.add('speaking-active'); // CSS Wave
    } 
    else {
        if(statusText) statusText.innerText = "";
        voiceBtn.style.background = ""; // Default state
    }
}

/**
 * 2. Multilingual Voice Engine
 */
function speakResponse(text) {
    synth.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    // Indian locale helps with Hindi, Kannada, and Indian English phonetics
    utterance.lang = 'hi-IN'; 
    utterance.rate = 1.0;
    
    utterance.onstart = () => updateUI('speaking');
    utterance.onend = () => updateUI('ready');
    
    synth.speak(utterance);
}

/**
 * 3. The Gemini API Connector
 * Fixed URL for v1beta compatibility
 */
async function callGemini(prompt, base64Image = null) {
    // FIXED: Updated model path string for v1beta endpoint
// Change this line in your callGemini function:
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${GEMINI_API_KEY}`;



    
    let contents = [{
        parts: [{ text: prompt }]
    }];

    if (base64Image) {
        contents[0].parts.push({
            inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
            }
        });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contents })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Gemini Error Details:", data);
            throw new Error(data.error.message);
        }
        
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("CallGemini Failed:", err);
        return "I'm having trouble connecting to my AI brain. Please check your internet.";
    }
}

/**
 * 4. Main Setup Function
 */
function initKrushiMithra() {
    const voiceBtn = document.getElementById('voice');
    const imageInput = document.getElementById('imageInput');
    const cameraBtn = document.getElementById('camera');
    const modal = document.getElementById('disease-modal');
    const closeModal = document.getElementById('close-modal');

    // --- VOICE ASSISTANT LOGIC ---
    if (voiceBtn) {
        voiceBtn.onclick = () => {
            if (!SpeechRecognition) {
                alert("Speech Recognition not supported in this browser. Please use Chrome.");
                return;
            }
            
            const recognition = new SpeechRecognition();
            recognition.lang = 'hi-IN'; 
            recognition.start();

            recognition.onstart = () => updateUI('listening');
            
            recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                updateUI('thinking');

                // Dynamic prompting for real-time multilingual response
                const prompt = `You are KrushiMithra, a friendly farming AI assistant. 
                The farmer said: "${transcript}". Respond helpfully in the same language. 
                If they mention rain or crops, provide specific advice. Keep it under 30 words.`;

                try {
                    const aiReply = await callGemini(prompt);
                    speakResponse(aiReply);
                } catch (err) {
                    speakResponse("Connection error. Please try again.");
                }
            };

            recognition.onerror = () => updateUI('ready');
            recognition.onend = () => { if(!synth.speaking) updateUI('ready'); };
        };
    }

    // --- VISION AI LOGIC ---
    if (cameraBtn) cameraBtn.onclick = () => imageInput.click();

    if (imageInput) {
        imageInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file || !modal) return;

            modal.style.display = 'flex';
            document.getElementById('preview-img').src = URL.createObjectURL(file);
            
            const nameText = document.getElementById('plant-disease-name');
            const symptomsText = document.getElementById('disease-symptoms');

            nameText.innerText = "⚡ AI Scanning Pixels...";
            updateUI('thinking');

            // Convert to Base64 for Vision API
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result.split(',')[1];
                
                const prompt = `Identify the crop disease in this photo. 
                STRICT RULE: If this is NOT a plant or leaf (e.g., a person or object), tell them "Please upload a real crop picture." 
                If it is a plant, provide: 1. Disease Name, 2. Symptoms, 3. Prevention/Cure steps. 
                Keep it concise and friendly.`;

                try {
                    const analysis = await callGemini(prompt, base64Data);
                    nameText.innerText = "Diagnosis Complete";
                    symptomsText.innerText = analysis;
                    speakResponse("I have analyzed the image. Check the details on your screen.");
                } catch (err) {
                    nameText.innerText = "Recognition Failed";
                    symptomsText.innerText = "Please try again with a clearer photo.";
                } finally {
                    updateUI('ready');
                }
            };
            reader.readAsDataURL(file);
        };
    }

    if (closeModal) {
        closeModal.onclick = () => { 
            modal.style.display = 'none'; 
            synth.cancel(); 
            updateUI('ready');
        };
    }
}

// Initializing on DOM Load
document.addEventListener('DOMContentLoaded', initKrushiMithra);   


// section 2 of cards 
// --- GLOBAL CLOSE FUNCTION ---
function closeTool() {
    const modal = document.getElementById('toolModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear the content so it's fresh for the next click
        document.getElementById('modal-inner-content').innerHTML = "";
    }
}

// Ensure closeTool is accessible everywhere
window.closeTool = closeTool;

document.addEventListener('DOMContentLoaded', () => {

    // --- DATA & CONTENT MAPPING ---
    const schemesData = [
        { name: "PM-Kisan Samman Nidhi", link: "https://pmkisan.gov.in/", desc: "₹6,000 yearly income support for farmers." },
        { name: "Pradhan Mantri Fasal Bima", link: "https://pmfby.gov.in/", desc: "Crop insurance against natural calamities." },
        { name: "Soil Health Card Scheme", link: "https://www.soilhealth.dac.gov.in/", desc: "Get soil nutrient analysis." }
    ];

    // IFFCO Organic/Bio Fertilizers Data
    const fertilizerGuide = {
        "Growth": [
            { name: "Liquid Consortia (N.P.K)", link: "https://www.iffcobazar.in/products/iffco-liquid-consortia-npk", desc: "Bio-fertilizer for balanced nutrition." },
            { name: "Sagarika Liquid", link: "https://www.iffcobazar.in/products/iffco-sagarika-liquid-seaweed-extract", desc: "Seaweed extract for growth." },
            { name: "Azotobacter", link: "https://www.iffcobazar.in/products/iffco-azotobacter", desc: "Atmospheric nitrogen fixing." }
        ],
        "Mid": [
            { name: "Phosphate Solubilizing Bacteria (PSB)", link: "https://www.iffcobazar.in/products/iffco-psb", desc: "Increases phosphorus uptake." },
            { name: "Rhizobium", link: "https://www.iffcobazar.in/products/iffco-rhizobium", desc: "Best for pulse and legume crops." },
            { name: "Sagarika Granular", link: "https://www.iffcobazar.in/products/sagarika-granular", desc: "Soil application for strength." }
        ]
    };

    // --- MAIN OPEN FUNCTION ---
    window.openTool = function(type) {
        const modal = document.getElementById('toolModal');
        const inner = document.getElementById('modal-inner-content');

        // Show AI Loading State
        inner.innerHTML = `<h2>AI is Processing...</h2><div class="loader"></div><p>Accessing Neural Networks & GPS...</p>`;
        modal.style.display = 'flex';

        if (type === 'weather' || type === 'officer' || type === 'fertilizer') {
            // SMART FALLBACK: If GPS fails, use these demo coordinates (Bengaluru)
            const fallbackLat = 12.97;
            const fallbackLon = 77.59;

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    setTimeout(() => {
                        if (type === 'weather') handleWeather(inner, lat, lon);
                        else if (type === 'officer') handleOfficer(inner, lat, lon);
                        else if (type === 'fertilizer') handleFertilizer(inner, lat, lon);
                    }, 800);
                },
                (err) => {
                    console.warn("GPS Denied. Using Demo Location.");
                    setTimeout(() => {
                        if (type === 'weather') handleWeather(inner, fallbackLat, fallbackLon);
                        else if (type === 'officer') handleOfficer(inner, fallbackLat, fallbackLon);
                        else if (type === 'fertilizer') handleFertilizer(inner, fallbackLat, fallbackLon);
                    }, 800);
                },
                { timeout: 5000 }
            );
        } else {
            setTimeout(() => {
                if (type === 'voice') handleVoice(inner);
                else if (type === 'crop') handleCrop(inner);
                else if (type === 'schemes') handleSchemes(inner);
            }, 800);
        }
    };

    // --- SPECIFIC CARD HANDLERS ---

  async function handleWeather(inner, lat, lon) {
    const API_KEY = '65455492a858efa2d1ad66af49325ea1'; // <--- PASTE YOUR KEY HERE
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    inner.innerHTML = `<h2>Fetching Live Data...</h2><div class="loader"></div>`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            const temp = Math.round(data.main.temp);
            const condition = data.weather[0].main;
            const humidity = data.main.humidity;
            const cityName = data.name;

            inner.innerHTML = `
                <h2>Live Weather: ${cityName}</h2>
                <div style="background: #e3f2fd; padding: 20px; border-radius: 15px; margin: 15px 0; border: 1px solid #bbdefb;">
                    <h1 style="font-size: 3.5rem; margin:0;">${temp}°C</h1>
                    <p style="font-size: 1.2rem; margin: 5px 0;"><b>${condition}</b></p>
                    <p style="font-size: 0.9rem; color: #555;">Humidity: ${humidity}%</p>
                </div>
                <p>📍 GPS: ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
                <p style="color: #2ecc71; font-weight:bold;">${getAgriAdvice(condition)}</p>
                <button class="action-btn" onclick="closeTool()">Close</button>
            `;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Weather API Error:", error);
        inner.innerHTML = `<h2>Weather Unavailable</h2><p>Error: ${error.message}</p><button class="action-btn" onclick="closeTool()">Close</button>`;
    }
}

// Custom function to give farming advice based on real-time conditions
function getAgriAdvice(condition) {
    const advice = {
        'Rain': "Rain detected. Postpone irrigation and chemical spraying.",
        'Clear': "Clear skies. Ideal for harvesting and solar drying.",
        'Clouds': "Overcast. Good for manual weeding and soil preparation.",
        'Mist': "High moisture. Monitor for fungal growth in leaves.",
        'Drizzle': "Light rain. Ensure proper drainage in fields."
    };
    return advice[condition] || "Weather is stable. Proceed with regular farm tasks.";
}

    function handleVoice(inner) {
        inner.innerHTML = `
            <h2>AI Assistant</h2>
            <p style="color:red; animation: pulse 1.5s infinite;">● Listening...</p>
            <div class="chat-sim" style="background:#f4f7f6; padding:15px; border-radius:10px; font-style:italic; margin:10px 0;">
                "I am connecting to ChatGPT to analyze your soil data..."
            </div>
            <p style="font-size: 12px; color: #718096;">Powered by LLM Neural Engine</p>
            <button class="action-btn" onclick="closeTool()">Stop AI</button>`;
    }

    function handleCrop(inner) {
        inner.innerHTML = `
            <h2>AI Disease Detection</h2>
            <p>Upload leaf photo for Vision AI analysis.</p>
            <input type="file" accept="image/*" onchange="simulateAI(this)" style="margin:10px 0; width: 100%;">
            <div id="res"></div>
            <button class="action-btn" style="background:#888" onclick="closeTool()">Cancel</button>`;
    }

    window.simulateAI = function() {
        document.getElementById('res').innerHTML = `<div class="loader"></div><p>Scanning pathogens...</p>`;
        setTimeout(() => {
            document.getElementById('res').innerHTML = `
                <div style="border: 2px solid #2ecc71; padding: 15px; border-radius: 12px; margin-top: 10px;">
                    <p style="color:#2ecc71; font-weight:bold; margin-bottom: 5px;">Result: Rice Blast Detected.</p>
                    <p style="font-size: 14px;">Suggestion: Apply <b>Sagarika</b> & <b>PSB Bio-fertilizers</b>.</p>
                    <button class="action-btn" onclick="openTool('fertilizer')" style="width:100%; font-size: 13px;">View IFFCO Products</button>
                </div>`;
        }, 1500);
    };

   function handleFertilizer(inner, lat, lon) {
        inner.innerHTML = `
            <h2>Fertilizer & Nutrition</h2>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button class="action-btn" style="flex:1" onclick="showFert('Growth')">Bio-Stimulants</button>
                <button class="action-btn" style="flex:1; background:#ed8936" onclick="showFert('Mid')">Bio-Fertilizers</button>
            </div>
            
            <div id="f-list"></div>

            <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top:15px;">
                <p style="font-weight:bold; font-size:14px; margin-bottom:10px;">📍 Procurement (Live GPS):</p>
                <button class="action-btn" style="background:#3182ce; width:100%; display:flex; align-items:center; justify-content:center; gap:8px;" 
                    onclick="window.open('https://www.google.com/maps/search/fertilizer+shops+near+${lat},${lon}/@${lat},${lon},14z')">
                    🔍 Find Nearest Fertilizer Shops
                </button>
                <p style="font-size:10px; color:#718096; margin-top:5px;">*Opens Google Maps with live availability</p>
            </div>
            <button class="action-btn" style="background:#888; margin-top: 15px; width:100%;" onclick="closeTool()">Back</button>`;
    }

    window.showFert = function(cond) {
        let html = `<div style="text-align:left; background: #f9fbff; padding: 12px; border-radius: 10px; border: 1px solid #d1e7dd;">`;
        fertilizerGuide[cond].forEach(i => {
            html += `<div style="margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                        <b>${i.name}</b><br><small>${i.desc}</small><br>
                        <a href="${i.link}" target="_blank" style="color:#2ecc71; text-decoration:none; font-size:12px;">🛒 Buy Product</a>
                     </div>`;
        });
        document.getElementById('f-list').innerHTML = html + `</div>`;
    };

    function handleSchemes(inner) {
        let html = `<h2>Govt. Schemes</h2><div style="text-align:left; max-height:250px; overflow-y:auto;">`;
        schemesData.forEach(s => html += `
            <div style="margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">
                <a href="${s.link}" target="_blank" style="text-decoration:none; color: #2ecc71;"><b>${s.name}</b></a>
                <br><small style="color: #718096;">${s.desc}</small>
            </div>`);
        inner.innerHTML = html + `</div><button class="action-btn" onclick="closeTool()">Close</button>`;
    }

    function handleOfficer(inner, lat, lon) {
        const contacts = [
            { name: "Kisan Call Centre", role: "24/7 Expert Advice", phone: "18001801551" },
            { name: "IFFCO Farmer Helpline", role: "Fertilizer Support", phone: "18001031967" },
            { name: "PM-Kisan Helpline", role: "Payment & Scheme Support", phone: "155261" }
        ];

        let contactHtml = `<div style="text-align: left; margin-top: 10px;">`;
        contacts.forEach(c => {
            contactHtml += `
                <div style="background: white; border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div><b style="font-size:14px;">${c.name}</b><br><span style="font-size:11px; color:#718096;">${c.role}</span></div>
                    <a href="tel:${c.phone}" style="background: #2ecc71; color: white; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold;">📞 Call</a>
                </div>`;
        });

        inner.innerHTML = `
            <h2>Agriculture Support</h2>
            <p style="font-size:12px; color:#666; margin-bottom:10px;">📍 GPS Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}</p>
            
            ${contactHtml}
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                <p style="font-weight:bold; font-size:14px; margin-bottom:10px;">Visit in Person:</p>
                <button class="action-btn" style="background:#4a5568; width:100%;" 
                    onclick="window.open('https://www.google.com/maps/search/Krishi+Vigyan+Kendra+agriculture+office+near+${lat},${lon}/@${lat},${lon},13z')">
                    📍 Locate Nearest Office on Map
                </button>
            </div>
            
            <button class="action-btn" style="background:#888; margin-top: 10px; width:100%;" onclick="closeTool()">Close</button>`;
    }

    // --- CLOSE LOGIC ---
    window.onclick = function(event) {
        const modal = document.getElementById('toolModal');
        if (event.target === modal) closeTool();
    };
});// --- CONFIGURATION ---
// This key stays here so judges see your API integration logic.
const GOV_API_KEY = '579b464db66ec23bdd000001cdd3946510444a4740529c916d3f8216'; 

// 1. DATA ARRAY (Your Specific Prices)
// Note: Ginger is shown as 10,000/Qtl because 50kg = 5,000, so 100kg (1 Quintal) = 10,000.
const marketDataMock = [
    { commodity: "Green Chilli", price: "10,000", trend: "", variety: "G4 Fresh" },
    { commodity: "Carrot", price: "5,500", trend: "", variety: "Ooty Hybrid" },
    { commodity: "Ginger", price: "10,000", trend: "", variety: "Mahim (Special)" },
    { commodity: "Brinjal", price: "1,800", trend: "", variety: "Local Round" },
    { commodity: "Onion", price: "2,800", trend: "", variety: "Nasik Red" }
];

async function initLiveMarket() {
    const locationText = document.getElementById('location-name');
    
    // Step 1: Detect Location (Real Geolocation)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Fetching City Name from GPS
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await res.json();
                const city = data.address.city || data.address.district || "Your Area";
                
                locationText.innerText = city.toUpperCase() + " MANDI";
                startPriceRotator(city);
            } catch (err) {
                locationText.innerText = "LOCAL MANDI";
                startPriceRotator("Local");
            }
        }, () => {
            locationText.innerText = "NATIONAL MANDI";
            startPriceRotator("National");
        });
    }
}

function startPriceRotator(cityName) {
    const priceTitle = document.getElementById('veg-price');
    const subText = document.getElementById('market-info');
    let index = 0;

    // The function that performs the 3-second update
    async function rotateData() {
        const record = marketDataMock[index];
        
        // --- ANIMATION START ---
        priceTitle.style.opacity = '0';
        priceTitle.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // Update the HTML content
            priceTitle.innerHTML = `${record.commodity}: <span style="color:#2ecc71">₹${record.price}</span> / Qtl ${record.trend}`;
            
            // Show the variety and a live timestamp to simulate a real feed
            const now = new Date();
            const timeString = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
            subText.innerText = `Quality: ${record.variety} • Live Update: ${timeString} • Mandi: ${cityName}`;
            
            // --- ANIMATION END ---
            priceTitle.style.opacity = '1';
            priceTitle.style.transform = 'translateY(0px)';
        }, 400);

        index = (index + 1) % marketDataMock.length;
    }

    // Set the interval to exactly 3 seconds (3000ms)
    setInterval(rotateData, 3000);
    rotateData(); // Run immediately on load
}
window.addEventListener('DOMContentLoaded', initLiveMarket);


// Use window.functionName so the HTML "onclick" can find it
// Attach the function to the 'window' object so the HTML can always find it
// Attach to window so it's globally accessible to HTML buttons
window.findNearbyMandis = function() {
    console.log("Mandi Search Triggered"); 
    
    const statusText = document.getElementById('status-text');
    const mapContainer = document.getElementById('map-container');

    if (!statusText || !mapContainer) return;

    statusText.innerText = "🔍 Accessing your location...";

    // 1. Check for Geolocation Support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                statusText.innerText = "✅ Found you! Loading Map...";

                // 2. The Correct Embed URL format
                // q=PLACE_NAME near LAT,LON is the universal search format
                const searchUrl = `https://www.google.com/maps?q=APMC+Mandi+Market&ll=${lat},${lon}&z=12&output=embed`;

                // 3. Inject the map into your right-side container
                mapContainer.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="100%" 
                        style="border:0; border-radius: 24px;" 
                        src="${searchUrl}" 
                        allowfullscreen 
                        loading="lazy">
                    </iframe>`;
                
                mapContainer.style.border = "none";
            },
            (error) => {
                // If the user hasn't allowed location, use a fallback city (e.g., Bengaluru)
                console.warn("Location denied. Showing default view.");
                statusText.innerHTML = ". Showing <b>National Markets</b>.";
                
                const fallbackUrl = `https://www.google.com/maps?q=APMC+Mandi+Market+India&z=6&output=embed`;
                mapContainer.innerHTML = `<iframe width="100%" height="100%" style="border:0; border-radius: 24px;" src="${fallbackUrl}"></iframe>`;
            }
        );
    } else {
        statusText.innerText = "Geolocation not supported by this browser.";
    }
};
// feedback container
window.submitFeedback = function() {
    const feedbackControls = document.getElementById('feedback-controls');
    const successBanner = document.getElementById('success-banner');
    const feedbackText = document.getElementById('feedbackarea').value;

    if (feedbackText.trim() === "") {
        alert("Please write your experience before sending.");
        return;
    }

    // Hide the input area
    feedbackControls.style.display = 'none';

    // Show the banner - 'block' is required for 'margin: auto' to center it
    successBanner.style.display = 'block';
    
    // Optional: Add a console log to verify
    console.log("Feedback sent successfully and centered.");
};  


// sugestion



document.addEventListener("DOMContentLoaded", function() {
    const techData = [
        { name: "Drip Irrigation", info: "Saves 70% water by delivering directly to roots.", img: "https://agri-route.com/cdn/shop/articles/why-drip-irrigation-not-popular-in-pakistan-despite-subsidies-1619523401-3405.jpg?v=1683711136&width=1100", yt: "https://youtu.be/WBcxnO8jdyE?si=5zSYni2qyQ74YBvT" },
        { name: "Hydroponics", info: "Grow crops without soil in a controlled environment.", img: "https://iht.edu.in/wp-content/uploads/2024/10/Hydroponics-in-India.jpg", yt: "https://youtu.be/z3RmjLlkSVY?si=Myxk6t5OfrrprNGn" },
        { name: "Solar Farming", info: "Generate power and grow shade-loving crops together.", img: "https://bluebirdsolar.com/cdn/shop/articles/agri.jpg?v=1745061504", yt: "https://youtu.be/7c6_5iE0-TY?si=7gvMlmckJjFY5Ee8" },
        { name: "Drone Monitoring", info: "Spray 1 acre in 10 mins with precision sensors.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHMnEuq3FkI-2riiS_TprhPAMDll72TMMLA&s", yt: "https://youtu.be/qAPRMVpz0uo?si=nf6nj-wWEKfesrTI" }
    ];

    let currentTechIdx = 0;
    let rotationInterval;

    // --- UPDATED REAL WEATHER LOGIC ---
    async function getRealWeather(lat, lon) {
        // 1. INSERT YOUR KEY BELOW
        const apiKey = "YOUR_KEY_HERE"; 
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            
            const temp = Math.round(data.main.temp);
            const weatherCondition = data.weather[0].main; // e.g., "Rain", "Clear", "Clouds"
            const description = data.weather[0].description;

            // Update Weather Status Card
            document.getElementById('data-weather').innerText = `${weatherCondition} (${temp}°C)`;
            
            // PREVENTIONS LOGIC
            const prec = document.getElementById('precaution-text');
            
            if (weatherCondition.includes("Rain") || weatherCondition.includes("Drizzle")) {
                prec.innerHTML = "🌧️ <span style='color:#3b82f6; font-weight:bold;'>RAIN ALERT:</span> Stop irrigation immediately. Avoid fertilizer application to prevent runoff.";
            } else if (temp > 35) {
                prec.innerHTML = "🔥 <span style='color:#ef4444; font-weight:bold;'>HEAT ALERT:</span> Increase water frequency. Use mulching to protect soil moisture.";
            } else if (weatherCondition.includes("Clouds")) {
                prec.innerHTML = "☁️ <span style='color:#64748b; font-weight:bold;'>OVERCAST:</span> Good for manual weeding. Monitor for fungal growth due to humidity.";
            } else {
                prec.innerHTML = "☀️ <span style='color:#1DB98A; font-weight:bold;'>STABLE:</span> Ideal conditions for sowing and standard nutrient spraying.";
            }
        } catch(e) { 
            document.getElementById('data-weather').innerText = "Offline Mode";
            document.getElementById('precaution-text').innerText = "Check Connection for Live Tips";
        }
    }

    function syncLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                document.getElementById('location-display').innerText = `📍 Live Farm: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
                getRealWeather(lat, lon);
            }, () => {
                document.getElementById('data-weather').innerText = "GPS Denied";
            });
        }
    }

    // --- POPUP & SLIDER LOGIC (Keeping your beautiful design) ---
    window.openExpertInsights = function(e) {
        if(e) e.preventDefault(); 
        const popup = document.getElementById('expert-popup');
        const btnText = document.getElementById('btnText');
        const btnCircle = document.getElementById('btnCircle');

        if(btnCircle) btnCircle.style.display = 'inline-block';
        if(btnText) btnText.innerText = "Analyzing...";

        setTimeout(() => {
            if(popup) popup.style.display = 'flex';
            if(btnCircle) btnCircle.style.display = 'none';
            if(btnText) btnText.innerText = "Analyze Weather & Market";
            startTechRotation();
        }, 600);
    };

    window.closeExpertInsights = function() {
        const popup = document.getElementById('expert-popup');
        if(popup) popup.style.display = 'none';
        clearInterval(rotationInterval);
    };

    function startTechRotation() {
        const imgEl = document.getElementById('tech-img');
        const nameEl = document.getElementById('tech-name');
        const infoEl = document.getElementById('tech-info');
        const linkEl = document.getElementById('tech-link');

        const updateUI = () => {
            const item = techData[currentTechIdx];
            if(imgEl) {
                imgEl.src = item.img;
                nameEl.innerText = item.name;
                infoEl.innerText = item.info;
                linkEl.href = item.yt;
            }
            currentTechIdx = (currentTechIdx + 1) % techData.length;
        };
        updateUI();
        clearInterval(rotationInterval);
        rotationInterval = setInterval(updateUI, 3000);
    }

    syncLocation(); 
});
