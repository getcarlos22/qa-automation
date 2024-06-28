describe('Google Books API', () => {
  it('should get a book and verify the title', () => {
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=qa+automation';

    // Perform a GET request to the Google Books API
    cy.request(apiUrl).then((response) => {
      // Verify the status code is 200
      expect(response.status).to.eq(200);

      // Check if the book with the title "Basiswissen Testautomatisierung" exists
      const book = response.body.items.find((item: { volumeInfo: { title: string; }; }) => item.volumeInfo.title === 'Basiswissen Testautomatisierung');
      
      // Verify that the book was found
      expect(book).to.not.be.undefined;

      // Log the book title specifically
      cy.log('Book title:', book.volumeInfo.title);

      // Optionally, you can still log other book details
      cy.log('Book details:', JSON.stringify(book.volumeInfo, null, 2));
    });
  });
});