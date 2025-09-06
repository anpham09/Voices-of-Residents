# Voices of Residents
![Voices of Resident](./img/Screenshot%202025-09-06%20at%201.02.50 PM.png)

## Introduction

**Voices of Residents** highlights local voices on the issues they observe in their communities. People can submit concerns, browse and discuss with neighbors, and explore solutions: helping relieve worries and creating visibility. Local leaders can use summaries to better understand residents’ needs and challenges.

---

## Features

- **Submit an Issue** title, description, category, and optional image  
- **View Issues** fast list with category filters, keyword search (WIP), and time presets  
- **Discussion-first** page to join conversations about each issue (scoped for MVP)  
- **Email Summary** send a titles-only summary of filtered issues to any email via EmailJS  
- **Client-side Storage** issues are stored in local storage for a simple MVP

## Roadmap: 
- Move from localStorage to a shared cloud backend (Firebase) so everyone sees the same data.
- Better search & filters across categories and time.
- Issue status labels (reported, investigating, resolved).
- Exportable summaries for neighborhood meetings.
- Optional notifications for updates in your area.

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)  
- **Data (MVP):** local storage
- **Email:** [EmailJS](https://www.emailjs.com/) (no backend required)  
- **Optional (earlier prototype):** jsPDF for PDF export
