# HTF25-Team-420

# Auto-Record: The Automated Lab Record Generator 📄✨

A full-stack web application built in 24 hours for the **CBIT Hacktoberfest 2025** (Problem Statement: PS25).

Auto-Record solves the tedious, manual problem of formatting lab records. It's a **dual-use tool** for both students and faculty:
1.  **Students** can fill out a simple wizard to generate a professional, standardized PDF for submission.
2.  **Faculty** can use it to create and distribute clean, standardized lab manuals for the entire class.

---

## 🚀 Live Demo & Screenshots

Our app features a clean, multi-step wizard that guides the user from start to finish.

**App Interface:**
<img width="1599" height="1122" alt="Screenshot 2025-10-26 142252" src="https://github.com/user-attachments/assets/60dcf004-24e2-4e67-856c-f712747f2a58" />
``

**Final PDF Output:**
The final result is a pixel-perfect PDF with a title page, headers, footers, and styled code blocks.
<img width="2238" height="1222" alt="Screenshot 2025-10-26 131551" src="https://github.com/user-attachments/assets/8ae73bce-e243-44b2-9f93-465378433faa" />
``

---

## 🌟 Key Features

* **Multi-Step Wizard:** A simple, guided UI built with **React** and **Chakra UI**.
* **Custom PDF Generation:** Uses **`pdf-lib`** on the backend to create a PDF from scratch.
* **Professional Formatting:** Includes a dynamic title page, page-numbering, and headers/footers.
* **Code-Aware Styling:** Automatically formats text in the "Code" and "Output" sections with a monospaced font and a shaded background.
* **"Remember Me" Feature:** Uses `localStorage` to save student details (Name, Roll No.) so they only have to type them once.

---

## 💻 Tech Stack

| Category | Technology |
| :----------------- | :------------------------- |
| **Frontend**       | React.js, Chakra UI, Axios |
| **Backend**        | Node.js, Express.js        |
| **PDF Generation** | `pdf-lib`                  |

---

## 🛠️ How to Run Locally

To get a local copy up and running, follow these simple steps.

### **Prerequisites**
* Node.js (v18 or later)
* npm

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd my-hackathon-project
    ```

2.  **Set up the Backend (Server):**
    * Open a terminal and navigate to the `server` folder:
    ```bash
    cd server
    ```
    * Install the packages:
    ```bash
    npm install
    ```

3.  **Set up the Frontend (Client):**
    * Open a **second terminal** and navigate to the `client` folder:
    ```bash
    cd client
    ```
    * Install the packages:
    ```bash
    npm install
    ```

4.  **Run the App:**
    * In your **server terminal**, start the backend:
    ```bash
    npm start
    ```
    * In your **client terminal**, start the frontend:
    ```bash
    npm run dev
    ```

5.  Open your browser and go to `http://localhost:5173`.

---

## 🧠 Our Team (Team 420)

* [cite_start]**Mohammed Abdul Azeem Arshad** [cite: 406]
* [cite_start]**Akshith Mateti** [cite: 407]
* [cite_start]**Satyam Pandey** [cite: 408]
* [cite_start]**Akira Aravind Indravath** [cite: 409]
* [cite_start]**Mohd Asrar Uddin** [cite: 410]

---

## 🔮 Future Scope

* **User Accounts:** Allow users to sign up and save their generated PDFs to a personal dashboard.
* **Image Uploads:** Let users upload screenshots of graphs or program outputs directly into the PDF.
* **More Templates:** Add a dropdown to select different formatting templates for different subjects (e.g., Physics, Chemistry, ECE).
