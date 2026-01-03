/* =========================================================================
   MAIN.JS - FIREBASE CLOUD DATABASE & MOBILE LOGIC
   ========================================================================= */

// 1. Import Firebase SDKs (No installation needed, works via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. PASTE YOUR FIREBASE CONFIG HERE 
// (Replace these placeholder strings with your actual keys from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCQzPFFuYIh65K1mn8QpLG3ZpCvVgcioIY",
  authDomain: "qencore26.firebaseapp.com",
  projectId: "qencore26",
  storageBucket: "qencore26.firebasestorage.app",
  messagingSenderId: "113774256060",
  appId: "1:113774256060:web:36323bc0c97b88357415b9",
  measurementId: "G-2MCEHTRPT5"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const DB_COLLECTION = "events"; // The name of your database folder

/* =================================
   PUBLIC PAGE LOGIC (index.html)
   ================================= */
async function loadPublicEvents() {
    const container = document.getElementById('events-grid');
    if (!container) return; // Exit if not on the main page

    container.innerHTML = '<p style="text-align:center; width:100%; color:#888;">Loading latest events from cloud...</p>';

    try {
        // Fetch events from Cloud, sorted by newest first
        const q = query(collection(db, DB_COLLECTION), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        container.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="empty-msg">No active events currently.</div>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const ev = doc.data();
            // Generate HTML for each event
            container.innerHTML += `
                <div class="event-card">
                    <div class="event-thumb">
                        <img src="${ev.image}" alt="Event Thumb">
                    </div>
                    <div class="event-info">
                        <h3>${ev.title}</h3>
                        <p>${ev.desc}</p>
                        <a href="${ev.link}" target="_blank" class="register-link">Register Now</a>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading events:", error);
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load events. Check console.</p>';
    }
}

/* =================================
   ADMIN PAGE LOGIC (admin.html)
   ================================= */

// A. Handle Login
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const pass = document.getElementById('adminPass').value;
        // Simple hardcoded password
        if (pass === "Anirban@73650") {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            renderAdminList(); // Load admin data
        } else {
            document.getElementById('errorMsg').style.display = 'block';
        }
    });
}

// B. Handle Create Event (Upload to Cloud)
const createForm = document.getElementById('createEventForm');
if (createForm) {
    createForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Uploading...";
        submitBtn.disabled = true;

        const fileInput = document.getElementById('evImageFile');
        const file = fileInput.files[0];

        if (file) {
            // Firestore limit check (Approx 1MB limit per doc)
            if (file.size > 800 * 1024) { // 800KB Limit
                alert("Image is too large! Please use an image smaller than 800KB.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            const reader = new FileReader();
            // Convert Image to Text (Base64)
            reader.onload = async function (event) {
                const base64Image = event.target.result;

                try {
                    // Send data to Firebase
                    await addDoc(collection(db, DB_COLLECTION), {
                        title: document.getElementById('evName').value,
                        image: base64Image,
                        desc: document.getElementById('evDesc').value,
                        link: document.getElementById('evLink').value,
                        timestamp: Date.now()
                    });

                    alert("Event Published Successfully!");
                    createForm.reset();
                    renderAdminList(); // Refresh list
                } catch (e) {
                    console.error("Error adding document: ", e);
                    alert("Upload failed. See console for details.");
                }

                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });
}

// C. Render Admin List (With Delete Button)
async function renderAdminList() {
    const list = document.getElementById('adminList');
    if (!list) return;

    list.innerHTML = '<p style="color:#666;">Syncing with cloud...</p>';

    try {
        const q = query(collection(db, DB_COLLECTION), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        list.innerHTML = '';

        if (querySnapshot.empty) {
            list.innerHTML = '<p style="color:#999;">No events found in database.</p>';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const ev = docSnap.data();
            const docId = docSnap.id; // Unique ID from Firebase

            // Create list item
            const itemDiv = document.createElement('div');
            itemDiv.className = 'admin-item';
            itemDiv.innerHTML = `
                <div class="item-details">
                    <img src="${ev.image}">
                    <div>
                        <strong>${ev.title}</strong><br>
                        <small style="color:#888;">${ev.desc.substring(0, 20)}...</small>
                    </div>
                </div>
                <button class="btn-delete">Remove</button>
            `;

            // Delete Logic
            itemDiv.querySelector('.btn-delete').addEventListener('click', async () => {
                if (confirm('Permanently delete this event?')) {
                    await deleteDoc(doc(db, DB_COLLECTION, docId));
                    renderAdminList(); // Refresh UI
                }
            });

            list.appendChild(itemDiv);
        });
    } catch (e) {
        console.error("Error fetching admin list:", e);
    }
}

/* =================================
   MOBILE MENU LOGIC (UI Only)
   ================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Nav Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-link-item').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // 2. Load events if on home page
    if (document.getElementById('events-grid')) {
        loadPublicEvents();
    }
});