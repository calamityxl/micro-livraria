function createBookCard(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shadowed">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img src="${book.photo}" alt="${book.name}" class="modal-button"/>
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <h4 class="title is-3 has-text-primary">${book.name}</h4>
                    <p class="subtitle">${book.author}</p>
                     <p class="is-size-4 has-text-weight-bold">R$${book.price.toFixed(2)}</p>
                    <p class="is-size-6">Estoque: 5 unidades</p>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <button class="button button-shipping" data-id="${book.id}" style="background-color: #ff69b4; color: white; border: none;">Frete</button>
                        </div>
                    </div>
                    <button class="button button-buy is-fullwidth" style="background-color: #ff69b4; color: white; border: none;">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function fetchShipping(id, cep) {
    fetch(`http://localhost:3000/shipping/${cep}`)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .then(data => swal('Frete', `Valor: R$${data.value.toFixed(2)}`, 'success'))
        .catch(() => swal('Erro', 'Não foi possível calcular o frete', 'error'));
}

document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.querySelector('.books');
    
    const searchBar = document.createElement('div');
    searchBar.className = 'search-container field has-addons has-text-centered';
    searchBar.style.display = 'flex';
    searchBar.style.justifyContent = 'center';
    searchBar.style.marginBottom = '20px';
    searchBar.innerHTML = `
        <div class="control">
            <input type="text" class="input" placeholder="Busque o livro pelo ID"/>
        </div>
        <div class="control">
            <button class="button" style="background-color: #ff69b4; color: white; border: none;">Buscar</button>
        </div>`;
    booksContainer.parentElement.insertBefore(searchBar, booksContainer);

    const searchInput = searchBar.querySelector('input');
    const searchButton = searchBar.querySelector('button');

    searchButton.addEventListener('click', () => {
        const bookId = searchInput.value.trim();
        bookId ? loadSingleBook(bookId) : loadAllBooks();
    });

    function loadSingleBook(bookId) {
        fetch(`http://localhost:3000/product/${bookId}`)
            .then(response => response.ok ? response.json() : Promise.reject('Livro não encontrado'))
            .then(book => {
                booksContainer.innerHTML = '';
                booksContainer.appendChild(createBookCard(book));
            })
            .catch(() => swal('Erro', 'Livro não encontrado', 'error'));
    }

    function loadAllBooks() {
        fetch('http://localhost:3000/products')
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao carregar livros'))
            .then(books => {
                booksContainer.innerHTML = '';
                books.forEach(book => booksContainer.appendChild(createBookCard(book)));
                attachEventListeners();
            })
            .catch(() => swal('Erro', 'Erro ao listar os produtos', 'error'));
    }

    function attachEventListeners() {
        document.querySelectorAll('.button-shipping').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.getAttribute('data-id');
                const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                fetchShipping(id, cep);
            });
        });
        document.querySelectorAll('.button-buy').forEach(btn => {
            btn.addEventListener('click', () => swal('Compra', 'Compra realizada com sucesso!', 'success'));
        });
    }

    loadAllBooks();
});