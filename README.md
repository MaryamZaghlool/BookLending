# 📚 Book Lending System - Angular

An Angular application for managing a book lending system. The system allows members to browse, borrow, and return books, while admins have full control over the catalog management.

## 🚀 Features

### 1. 🔐 User Authentication

- Register and login with JWT-based authentication.
- Role-based redirection:
  - **Admin**: Full book management access.
  - **Member**: View, borrow, and return books.

### 2. 📖 Book Catalog

- **Admin**:
  - Add, update, and delete books.
- **Member**:
  - View available books.
  - Borrow and return one book at a time.

### 3. 📅 Borrowing & Returning

- "Borrow" button visible for available books.
- "Return" button for borrowed books.
- Display due dates returned from backend.
- Sync availability status after returning books.

### 4. ⏰ Delayed Books

- Dedicated page to show all overdue books.
- Warning messages for books not returned on time.

### 5. ⚠️ Error Handling & Feedback

- Friendly error messages for failed actions.
- Loading indicators while communicating with the backend.
- Form validation for all user inputs.

### 6. 💻 UI/UX

- Responsive design across all devices.
- Smooth animations for hover, scroll, and loading.
- Clean and modern UI for user-friendly navigation.

---

## 🛠 Tech Stack

- **Frontend**: Angular 16+
- **State Management**: Angular Services / RxJS
- **Auth**: JWT stored in `localStorage`
- **Routing**: Angular Router
- **Styling**: SCSS / Bootstrap / Angular Animations
- **API**: RESTful backend (Node/NestJS or other)

---

## 📁 Folder Structure (Suggested)
