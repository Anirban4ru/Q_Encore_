# 🎸 Q-ENCORE | Official Music Club Website

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-blueviolet)
![Responsive](https://img.shields.io/badge/Design-Responsive-blue)

> **"Rhythm in Motion."** > The official web portal for Q-Encore, the premier music collective of Quantum University.

## 🌟 Overview

This project is a modern, minimalist, and fully responsive website designed to showcase the club's activities, team hierarchy, and facility. It features a **client-side Admin Portal** that allows club heads to post events dynamically without needing a backend server.

**[🔗 View Live Demo](https://your-username.github.io/your-repo-name/)** *(Replace the link above with your actual GitHub Pages URL after deploying)*

---

## 🚀 Key Features

### 🎨 User Interface (UI)
* **Cinematic Hero Section:** Features a silent, looping video background (`viz.mp4`) with overlay text.
* **Interactive "The Room":** A grayscale-to-color hover effect on the music room section.
* **Hierarchical Team Display:** A custom-coded "Pyramid" layout highlighting the President, followed by VPs and Coordinators side-by-side.
* **Mobile Optimized:** Includes a hamburger menu and responsive grids that adapt perfectly to phone screens.
* **Smooth Scrolling:** Polished navigation experience.

### 🔐 Admin Dashboard
* **Secure Login:** Simple password-protected entry gate.
* **Event Management:** Create, Read, and Delete events directly from the browser.
* **Image Uploads:** Supports uploading event thumbnails from the device (converted to Base64).
* **Google Forms Integration:** Admins can attach registration links to event cards.

### 💾 Technology (No Backend Required)
* **LocalStorage Database:** Uses the browser's LocalStorage API to save event data. This makes the project persistent on a single device without needing a database like MongoDB or SQL.
* **Vanilla JavaScript:** No heavy frameworks (React/Angular), ensuring lightning-fast load times.

---

## 📂 File Structure

```text
/ (Root Directory)
├── index.html          # Main landing page (Public view)
├── admin.html          # Admin Dashboard (Protected view)
├── 404.html            # Custom Error page
├── styles.css          # Main stylesheet (Light theme + Responsive)
├── main.js             # Logic for Events, Storage, and UI toggles
└── assets/             # Images and Media
    ├── viz.mp4         # Background video
    ├── favicon.png     # Browser tab icon
    ├── club-logo.png   # Navbar logo
    └── (Team images)   # Ayush.jpg, Anirban.jpeg, etc.
