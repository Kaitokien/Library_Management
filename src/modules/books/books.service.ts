import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { CreateRentalDto } from 'src/modules/rental/dtos/create-rental.dto';
import { Books } from 'src/modules/books/entity/book.entity';
import { Membership } from 'src/modules/membership/entity/membership.entity';
import { Rental, RentalStatus } from 'src/modules/rental/entity/rental.entity';
import { RentalBook, RentalBookStatus } from 'src/modules/rental/entity/rental_book.entity';
import { Users } from 'src/modules/users/entity/user.entity';
import { Repository, DataSource } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books) private bookRepository: Repository<Books>,
    private dataSource: DataSource
  ) {}
  async create(createBookDto: CreateBookDto[]) {
    try {
      const existingBooks = await this.bookRepository
        .createQueryBuilder('books')
        .where('books.isbn = :isbn', { isbn: createBookDto[0].isbn })
        .getOne();
      console.log(existingBooks)
      if (existingBooks) {
        return(`Book with ISBN ${existingBooks.isbn} already exists.`);
      }
      await this.bookRepository
        .createQueryBuilder()
        .insert()
        .into('books')
        .values(createBookDto)
        .execute();
        return {
          message: "Created successfully"
        }
    } catch (error) {
      return {
        error
      }
    }
  }

  async findAll() {
    const all_books = await this.bookRepository.find()
    return all_books;
  }

  async findOne(id: number) {
    const result = await this.bookRepository
      .createQueryBuilder('books')
      .where("books.id = :id", { id })
      .getOne()
    console.log(`Inside findOne function of book.service.`)
    if(result === null) {
      return {
        message: 'Cannot find book required. Please go back!'
      }
    }
    return result;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const { isbn, ...data } = updateBookDto;
      const result = await this.bookRepository
      .createQueryBuilder()
      .update('books')
      .set(data)
      .where("id = :id", {id})
      .execute()
      return `Book with ID ${id} has been updated successfully!`;
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async remove(id: number) {
    try {
      // Kiem tra xem sach co ton tai hay khong
      const result = await this.bookRepository
      .createQueryBuilder('books')
      .where("books.id = :id", { id })
      .getOne()
      if(result === null) {
        return {
          message: `Book with ID ${id} cannot be found or has already been deleted`
        }
      }
      await this.bookRepository
        .createQueryBuilder()
        .delete()
        .from(Books)
        .where("id = :id", { id })
        .execute()
      return `Book with ID ${id} has been deleted successfully!`;
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async searchBook(query: string) {
    const result = await this.bookRepository
      .createQueryBuilder('books')
      .where('books.title ILIKE :query', { query: `%${query}%` })
      .orWhere('books.author ILIKE :query', { query: `%${query}%` })
      .getMany();
    return result;
  }

  async rentBook(id: number, createRentalDto: CreateRentalDto) {
    console.log(`ID of user: ${id}`);
    console.log('Inside src/services/booksservice/rentBook')
    return await this.dataSource.transaction(async (manager) => {
      // 1. Check if user exists
      const user = await manager.findOne(Users, { where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      console.log(`rentBook: Found user`)

      // 2. Check if user can create new rental (no pending rentals or unpaid penalties)
      const canRent = await this.canUserRent(id, manager);
      if (!canRent.allowed) {
        throw new BadRequestException(canRent.reason);
      }

      console.log(`rentBook: Danh sach cac sach dang yeu cau: `, createRentalDto.books)
      // 3. Validate all books and check stock
      const bookValidations = await Promise.all(
        createRentalDto.books.map(async (item) => {
          const book = await manager.findOne(Books, { where: { id: item.book_id } });
          
          if (!book) {
            throw new NotFoundException(`Book with ID ${item.book_id} not found`);
          }

          if (book.stock < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for book "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`
            );
          }

          // Validate dates
          const dateRented = new Date(item.date_rented);
          const dueDate = new Date(item.due_date);
          
          if (dueDate <= dateRented) {
            throw new BadRequestException(
              `Due date must be after rent date for book "${book.title}"`
            );
          }

          return { book, item, dateRented, dueDate };
        })
      );

      console.log(bookValidations)


      // 4. Check if user is an active member for discount
      const isActiveMember = await this.hasMembership(id, manager);
      const discountPercent = isActiveMember ? 20 : 0;

      // 5. Create Rental
      const rental = manager.create(Rental, {
        user: user,
        status: RentalStatus.PENDING,
        discount: discountPercent,
        revenue: 0, 
        penalty: 0,
      });

      console.log('Rental looks like this: ', rental)
      const savedRental = await manager.save(Rental, rental);

      // 6. Create RentalBook entries
      const rentalBooks: RentalBook[] = [];
      for (const validation of bookValidations) {
        const { book, item } = validation;

        const rentalBook = manager.create(RentalBook, {
          rental: savedRental,
          book: book,
          quantity: item.quantity,
          date_rented: item.date_rented,
          price_per_day: 2000, 
          due_date: item.due_date,
          status: RentalBookStatus.PROGRESSING,
        });

        const savedRentalBook = await manager.save(RentalBook, rentalBook);
        rentalBooks.push(savedRentalBook);
        book.stock -= item.quantity;
        await manager.save(Books, book);
      }

      console.log('rentBook: ', rentalBooks);

      // 7. Return the complete rental with rental books
      return {
        id: savedRental.id,
        status: savedRental.status,
        discount: savedRental.discount,
        revenue: savedRental.revenue,
        penalty: savedRental.penalty,
        created_at: Date.now(),
        rental_books: rentalBooks.map(rb => ({
          id: rb.id,
          book_id: rb.book.id,
          book_title: rb.book.title,
          quantity: rb.quantity,
          price_per_day: rb.price_per_day,
          date_rented: rb.date_rented,
          due_date: rb.due_date,
          status: rb.status,
        })),
        message: 'Rental created successfully. Please proceed to payment to confirm the rental.',
      };
    });
  }

  /* 
    Hàm kiểm tra xem user có khoản phạt nào không, nếu có thì không cho thuê
  */
  private async canUserRent(userId: number, manager): Promise<{ allowed: boolean; reason?: string }> {
    // Check for pending rentals
    const pendingRentals = await manager.count(Rental, {
      where: {
        user: { id: userId },
        status: RentalStatus.PENDING,
      },
    });

    if (pendingRentals > 0) {
      return {
        allowed: false,
        reason: 'You have pending rentals. Please complete or cancel them before creating a new rental.',
      };
    }

    // Check for unpaid penalties
    const unpaidPenalties = await manager
      .createQueryBuilder(Rental, 'rental')
      .where('rental.user.id = :userId', { userId })
      .andWhere('rental.penalty > 0')
      .getMany();

    if (unpaidPenalties.length > 0) {
      const totalUnpaid = unpaidPenalties.reduce((sum, rental) => sum + rental.penalty, 0);
      return {
        allowed: false,
        reason: `You have unpaid penalties totaling ${totalUnpaid} VND. Please pay them before creating a new rental.`,
      };
    }

    return { allowed: true };
  }

  /* 
  Ham kiem tra xem user co hoi vien không, nếu có thì kiểm tra trong danh
  sách các lần đăng ký hội viên thì có lần đăng ký nào còn trong thời hạn hay không
   */
  private async hasMembership(userId: number, transactionalEntityManager) {
    const latestMembership = await transactionalEntityManager
      .createQueryBuilder(Membership, 'membership')
      .where('membership.id_user = :userId', { userId })
      .orderBy('membership.end_date', 'DESC')
      .getOne();

    if (!latestMembership) {
      return false;
    }

    // Check if membership is still valid
    const now = new Date();
    const endDate = new Date(latestMembership.end_date);

    return endDate >= now; 
  }
}
