
import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css'
 

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
     currentlyReading: [],
        wantToRead: [],
        read: [],
        books: [],
        query: '',
    showSearchPage: false
  }
  componentDidMount() {
    console.log("mount")
    this.getdata();
}
  getdata() {
   
    BooksAPI.getAll().then(books =>{
  
    let currentlyReading =  books.filter(book => book.shelf ==='currentlyReading' )

    
    let wantToRead = books.filter(book => book.shelf ==='wantToRead' )

    
    let read = books.filter(book => book.shelf ==='read' ) 

    this.setState({ currentlyReading, wantToRead, read });
  })
}
  shelfR(books,header){
    console.log()
    return( <div className="bookshelf">
    <h2 className="bookshelf-title">{header}</h2>
    <div className="bookshelf-books">
    <ol className="books-grid">
                       
                           {this.creatbook(books)}
                        
                    </ol>
    </div>
  </div>)
  }
  Query(query) {
      BooksAPI.search(query).then(books => books ? this.setState({ books }) : []);
      this.setState({ query });
  }
  Updateshelf(book, shelf) {
  
    BooksAPI.update(book, shelf).then(()=> this.getdata())
   
}

creatbook(books ) {
 if( books.error){
  return <div>No results found</div>
}else{
 return books.map((book, key) =>{
 
  const imageThumb = book.imageLinks? book.imageLinks.smallThumbnail :null

  return (
      <li key={key}>
          <div className="book">
              <div className="book-top">
                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${imageThumb})` }}></div>
                      <div className="book-shelf-changer">
                          <select onChange={e => this.Updateshelf(book, e.target.value)} value={book.shelf} >
                              <option value="none" >Move to...</option>
                              <option value="none">None</option>
                              <option value="currentlyReading">Currently Reading</option> 
                              <option value="wantToRead">Want to Read</option>  
                              <option value="read">Read</option>
                              
                          </select>
                      </div>
                  </div>
              <div className="book-title">{book.title}</div>
              <div className="book-authors">{book.authors}</div>
          </div>
      </li>
  );
})
}
}
  render() {
    const { currentlyReading, wantToRead, read,books } = this.state;
    return (
      
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={e => this.Query(e.target.value)}
              />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
              {this.creatbook(books)}
              </ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
            <div>      
                      
                       {this.shelfR(currentlyReading,'currentlyReading')}
                       {this.shelfR(read,'read')}
                       {this.shelfR(wantToRead,'wantToRead')}
            </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
