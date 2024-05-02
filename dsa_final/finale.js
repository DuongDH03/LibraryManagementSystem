class Book {
    constructor(id, title, author, borrowedBy) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.borrowedBy = borrowedBy;
    }
}

class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

const libraryQueue = new Queue();
const borrowedQueue = new Queue();

function addBook() {
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    
    if (!id || !title || !author) {
        alert('Please fill in all fields.');
        return;
    }

    let idExists = false;
    libraryQueue.items.forEach(book => {
        if (book.id === id) {
            idExists = true;
        }
    });
    borrowedQueue.items.forEach(book => {
        if (book.id === id) {
            idExists = true;
        }
    });
    if (idExists) {
        alert('A book with the same ID already exists.');
        return;
    }
    
    const newBook = new Book(id, title, author, null);
    libraryQueue.enqueue(newBook);
    displayBooks(libraryQueue.items.concat(borrowedQueue.items)); 
    clearForm();
}

function deleteBook() {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the ID of the book to delete.');
        return;
    }

    let deleted = false;
    for (let i = 0; i < libraryQueue.items.length; i++) {
        if (libraryQueue.items[i].id === id) {
            libraryQueue.items.splice(i, 1);
            deleted = true;
            break;
        }
    }
    if (!deleted) {
        alert('Book not found in the library.');
        return;
    }

    displayBooks();
    clearForm();
}

function updateBook() {
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    if (!id || (!title && !author)) {
        alert('Please fill in at least one field (title or author) and provide the book ID.');
        return;
    }
    let bookToUpdate = null;
    for (let i = 0; i < libraryQueue.items.length; i++) {
        if (libraryQueue.items[i].id === id) {
            bookToUpdate = libraryQueue.items[i];
            break;
        }
    }
    if (!bookToUpdate) {
        for (let i = 0; i < borrowedQueue.items.length; i++) {
            if (borrowedQueue.items[i].id === id) {
                bookToUpdate = borrowedQueue.items[i];
                break;
            }
        }
    }
    if (!bookToUpdate) {
        alert('Book not found in the library or borrowed books.');
        return;
    }
    if (title) {
        bookToUpdate.title = title;
    }
    if (author) {
        bookToUpdate.author = author;
    }
    displayBooks();
    clearForm();
}

function borrowBook() {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the ID of the book to borrow.');
        return;
    }
    const borrowerId = document.getElementById('borrowerId').value;
    if (!borrowerId) {
        alert('Please enter borrower ID.');
        return;
    }
    let found = false;
    for (let i = 0; i < libraryQueue.items.length; i++) {
        if (libraryQueue.items[i].id === id) {
            found = true;
            const borrowedBook = libraryQueue.items.splice(i, 1)[0];
            borrowedBook.status = 'borrowed';
            borrowedBook.borrowerId = borrowerId;
            borrowedQueue.enqueue(borrowedBook);
            displayBooks();
            clearForm();
            break;
        }
    }
    if (!found) {
        alert('Book not found in the library.');
    }
}

function returnBook() {
    const id = document.getElementById('id').value;
    if (!id) {
        alert('Please enter the ID of the book to return.');
        return;
    }
    let found = false;
    for (let i = 0; i < borrowedQueue.items.length; i++) {
        if (borrowedQueue.items[i].id === id) {
            found = true;
            const returnedBook = borrowedQueue.items.splice(i, 1)[0];
            returnedBook.status = 'available';
            returnedBook.borrowerId = null;
            libraryQueue.enqueue(returnedBook);
            displayBooks();
            clearForm();
            break;
        }
    }
    if (!found) {
        alert('Book not found in the borrowed books.');
    }
}

function searchBooks() {
    const searchInput = document.getElementById('search').value.trim().toLowerCase();
    allBooks = libraryQueue.items.concat(borrowedQueue.items)
        // include the borrowed books to the search space
        // libraryQueue only contains the non-borrowed books
    if (!searchInput) {
        displayBooks(allBooks);
        return;
    }
    const filteredBooks = allBooks.filter(book => 
        book.id.includes(searchInput) || 
        book.title.toLowerCase().includes(searchInput) || 
        book.author.toLowerCase().includes(searchInput)
    );
    displayBooks(filteredBooks);
    }

function displayBooks(books = libraryQueue.items.concat(borrowedQueue.items)) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    const allBooks = libraryQueue.items.concat(borrowedQueue.items);
    books.forEach(book => {
        const status = book.status === 'borrowed' ? 'Borrowed' : 'Available';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${status}</td>
            <td>${book.borrowerId || '-'}</td>
        `;
        if (book.status === 'borrowed') {
            row.style.backgroundColor = 'pink';
        }
        bookList.appendChild(row);
    });
}


function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('borrowerId').value = '';
}