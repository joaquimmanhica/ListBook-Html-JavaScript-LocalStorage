//Book class: representa um livro
class Livro{
    constructor(titulo, autor, isbn){
        this.titulo = titulo
        this.autor = autor
        this.isbn = isbn
    }
}
//UI CLASS: lida com tarefas de UI
class UI{
    static mostraLivros(){
       /* const livrosAdicionados = [
            {
                titulo: 'Livro um',
                autor: 'Plural editores',
                isbn: '3434434'
            },
            {
                titulo: 'Livro um',
                autor: 'Plural editores',
                isbn: '3434434'
            }
        ];*/



        //const livros = livrosAdicionados
        const livros = Store.getBooks()
        livros.forEach((livro) => UI.adicionarLivroALista(livro))
    }

    static adicionarLivroALista(livro){
        const lista = document.querySelector('#book-list');
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`

        lista.appendChild(row)
    }

    static removerLivro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove()

        }
    }

    static mostrAlerta(message, className){
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div,form)
        setTimeout(() => document.querySelector('.alert').remove(),3000)
    }

    static clearFields(){
        document.querySelector('#titulo-livro').value = ''
        document.querySelector('#autor-livro').value = ''
        document.querySelector('#isbn-livro').value = ''
    }
}

//STORE CLASS: lida com armazenamento

class Store {
    static getBooks(){
        let livros;
        if(localStorage.getItem('livros') === null){
            livros = []
        }else{
            livros = JSON.parse(localStorage.getItem('livros'))
        }
        return livros
    }

    static addBook(livro){
        const livros = Store.getBooks()
        livros.push(livro)
        localStorage.setItem('livros', JSON.stringify(livros))
    }


   static removeBook(isbn){
        const livros = Store.getBooks()
        livros.forEach((livro, index)=>{
            if(livro.isbn ===isbn){
                livros.splice(index, 1)
            }
        })
        localStorage.setItem('livros', JSON.stringify(livros))
    }


}

//EVENT: mostrar os livros
document.addEventListener('DOMContentLoaded',UI.mostraLivros())
//Event: Adicionar um livro
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    //pegar dados do formulario
    const titulo = document.querySelector('#titulo-livro').value
    const autor = document.querySelector('#autor-livro').value
    const isbn = document.querySelector('#isbn-livro').value

    //validar campus

    if(titulo === '' || autor === '' || isbn === ''){
       UI.mostrAlerta('porfavor, preenche todos os campus!','info')
    }else{
         //inicializar livro
    const livro = new Livro(titulo,autor,isbn)
    UI.adicionarLivroALista(livro)


    //adicionar livro ao armazenamento local
    Store.addBook(livro)

    //mostra mensagem de sucesso
    UI.mostrAlerta('Livro Adicionado!','success')
    //limpar campus
    UI.clearFields()
    }
})
//Event: Remover um Livro
document.querySelector('#book-list').addEventListener('click',(e)=>{
   
   
   //remove o livro da UI
    UI.removerLivro(e.target)

    //remove o livro do armazenamento local
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

     //mensagem de sucesso ao remover o livro
     UI.mostrAlerta('Livro removido!','success')
})