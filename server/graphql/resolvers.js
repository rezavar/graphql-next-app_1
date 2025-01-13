const Book = require('../models/Book'); // مدل کتاب

const resolvers = {
  Query: {
    books: async () => {
      try {
        // برای Mongoose
        const books = await Book.find();  // این متد تمام کتاب‌ها را می‌آورد

        // برای Sequelize
        // const books = await Book.findAll(); // اگر از Sequelize استفاده می‌کنید

        return books;
      } catch (error) {
        throw new Error('Error fetching books: ' + error.message);
      }
    },
  },
  Mutation: {
    createBook: async (parent, { title, author }) => {
      const book = new Book({ title, author });
      await book.save();
      return book;
    },
    updateBook: async (parent, { id, title, author }) => {
      const book = await Book.findById(id);
      if (!book) throw new Error('Book not found');
      book.title = title || book.title;
      book.author = author || book.author;
      await book.save();
      return book;
    },
    deleteBook: async (parent, { id }) => {
      const book = await Book.findById(id);
      if (!book) throw new Error('Book not found');
      await Book.deleteOne({ _id: id });
      return true;
    },
  },
};

module.exports = resolvers;
