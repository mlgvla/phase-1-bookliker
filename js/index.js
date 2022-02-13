document.addEventListener("DOMContentLoaded", function () {
  fetchBooks()
  getRandomUser()
})

let currentUser = {}

function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then(r => r.json())
    .then(books => listBooks(books))
}

function getRandomUser() {
  let userId = Math.floor(Math.random() * 10 + 1)

  fetch(`http://localhost:3000/users/${userId}`)
    .then(r => r.json())
    .then(user => setUser(user))
}

function setUser(user) {
  currentUser = user
  console.log(currentUser)
}

function listBooks(books) {
  let ul = document.getElementById("list")

  books.forEach(book => {
    let li = document.createElement("li")
    li.innerHTML = book.title
    li.setAttribute("id", book.id)
    li.addEventListener("click", event => {
      const bookId = event.target.id
      getBook(bookId)
    })
    ul.appendChild(li)
  })
}

function getBook(bookId) {
  fetch(`http://localhost:3000/books/${bookId}`)
    .then(r => r.json())
    .then(book => showDetails(book))
}

function showDetails(book) {
  let div = document.getElementById("show-panel")

  let img = document.createElement("img")
  img.src = book.img_url

  let title = document.createElement("p")
  title.innerHTML = `<h1>${book.title}</h1>`

  let subtitle = document.createElement("p")
  subtitle.innerHTML = `<h3>${book.subtitle}</h3>`

  let author = document.createElement("p")
  author.innerHTML = `<h3>By ${book.author}</h3>`

  let description = document.createElement("p")
  description.innerHTML = book.description

  let usersUl = document.createElement("ul")
  usersUl.id = "book_users"

  book.users.forEach(user => {
    const li = document.createElement("li")
    li.innerHTML = user.username
    usersUl.appendChild(li)
  })

  let likeBtn = document.createElement("button")
  likeBtn.id = book.id
  likeBtn.innerHTML = "Like"
  likeBtn.addEventListener("click", event => {
    const bookId = event.target.id
    handleLikeBtn(bookId)
  })

  div.innerHTML = ""
  div.append(img, title, subtitle, author, description, usersUl, likeBtn)
}

function handleLikeBtn(bookId) {
  fetch(`http://localhost:3000/books/${bookId}`)
    .then(r => r.json())
    .then(book => {
      let foundUser = book.users.find(
        user => parseInt(user.id) === parseInt(currentUser.id)
      )
      !foundUser ? addUserToList(book) : deleteUserFromList(book)
    })
}

function addUserToList(book) {
  book.users.push(currentUser)
  updateDBUsersList(book)
}

function deleteUserFromList(book) {
  let updatedUsers = book.users.filter(user => user.id !== currentUser.id)
  book.users = updatedUsers
  updateDBUsersList(book)
}

function updateDBUsersList(book) {
  fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      users: book.users,
    }),
  })
    .then(r => r.json())
    .then(data => renderBookUsersList(data))
}

function renderBookUsersList(book) {
  let usersUl = document.getElementById("book_users")
  usersUl.innerHTML = ""

  book.users.forEach(user => {
    const li = document.createElement("li")
    li.innerHTML = user.username
    usersUl.appendChild(li)
  })
}
