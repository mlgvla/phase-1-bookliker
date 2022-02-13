document.addEventListener("DOMContentLoaded", function () {
  fetchBooks()
})

function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then(r => r.json())
    .then(books => listBooks(books))
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
  console.log(book)

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

  book.users.forEach(user => {
    const li = document.createElement("li")
    li.innerHTML = user.username
    usersUl.appendChild(li)
  })

  div.innerHTML = ""
  div.append(img, title, subtitle, author, description, usersUl)
}
