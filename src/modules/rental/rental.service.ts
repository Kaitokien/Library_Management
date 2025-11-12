import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/modules/books/entity/book.entity';
import { Rental, RentalStatus } from 'src/modules/rental/entity/rental.entity';
import { RentalBook, RentalBookStatus } from 'src/modules/rental/entity/rental_book.entity';
import { Users } from 'src/modules/users/entity/user.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(RentalBook) private rbRepo: Repository<RentalBook>,
    @InjectRepository(Rental) private rentalRepo: Repository<Rental>,
    private datasource: DataSource,
  ) {}

  private async findUser(userId: number) {
    return await this.datasource.transaction(async manager => {
      const user = await manager.findOne(Users, { where: { id: userId } });
      return user;
    } )
  }

  private async findRental(manager: EntityManager, rentalId: number, userId: number) {
    return await manager.findOne(Rental, {
      where: { user: { id: userId }, id: rentalId },
      relations: ['user', 'rental_books'],
      select: {
        id: true,
        status: true,
        discount: true,
        revenue: true,
        penalty: true,
        user: {
          id: true,
          username: true,
          email: true,
          role: true
        },
        rental_books: {
          id: true,
          status: true,
          quantity: true,
          price_per_day: true,
          date_rented: true,
          due_date: true,
          return_at: true
        }
      }
    }); 
  }

  // Ham tra ve danh sach rental + rentalbook cua nguoi dung
  async getRentalList(id: number,/* newStatus: RentalBookStatus */) {
    return await this.datasource.transaction(async manager => {

      // Kiem tra xem nguoi dung co ton tai hay khong
      const user = this.findUser(id);
      if (!user) throw new NotFoundException('User not found');

      console.log(`Inside Update Status of employee side`)
      // Kiem tra xem nguoi dung co rental nao hay khong
      const rental = await manager.find(Rental, {
        where: { user: { id } },
        relations: ['user', 'rental_books'],
        select: {
          id: true,
          status: true,
          discount: true,
          revenue: true,
          penalty: true,
          user: {
            id: true,
            username: true,
            email: true,
            role: true
          },
          rental_books: {
            id: true,
            status: true,
            quantity: true,
            price_per_day: true,
            date_rented: true,
            due_date: true,
            return_at: true
          }
        }
      });
      
      if(!rental) throw new NotFoundException('No rental found');

      console.log(rental)
      return rental;
      // Lay ra danh sach RentalBook co trang thai Progressing
      // rb.status = newStatus;
      // await manager.save(rb);

      // // Recalc revenue (based on BORROWED)
      // const rentalId = rb.rental.id;

      // const borrowedBooks = await manager.find(RentalBook, {
      //   where: { rental: { id: rentalId }, status: RentalBookStatus.BORROWED }
      // });

      // let revenue = borrowedBooks.reduce((sum, item) => sum + (item.quantity * item.price_per_day), 0);

      // // apply membership discount already stored in rental.discount
      // const rental = await manager.findOne(Rental, { where: { id: rentalId } });
      // if(!rental) {
      //   throw new NotFoundException(`Rental with ID ${rentalId} not found`);
      // }

      // const discountPercent = rental.discount || 0;
      // if (discountPercent > 0) {
      //   revenue = revenue - Math.floor(revenue * discountPercent / 100);
      // }

      // rental.revenue = revenue;

      // // update rental status
      // const allBooks = await manager.find(RentalBook, { where: { rental: { id: rentalId } } });
      // const allDone = allBooks.every(b =>
      //   b.status === RentalBookStatus.RETURNED || b.status === RentalBookStatus.CANCELLED
      // );

      // if (allDone) rental.status = RentalStatus.ACCEPTED;
      // else rental.status = RentalStatus.PENDING;

      // await manager.save(rental);

      // return {
      //   message: 'Status updated successfully',
      //   rental_id: rentalId,
      //   revenue: rental.revenue,
      //   rental_status: rental.status
      // };
    })
  }

  async confirmPayment(id: number, id_rental: number, id_rental_book: number) {
    return await this.datasource.transaction(async manager => {
      const user = await this.findUser(id);
      if (!user) throw new NotFoundException('User not found');

      // Kiem tra xem nguoi dung co rental nao hay khong
      const rental = await this.findRental(manager, id_rental, id);
      
      if(!rental) throw new NotFoundException('No rental found');

      // Kiem tra xem co rental_book nao khong
      const rental_book = await manager.findOne(RentalBook, {
        where: { id: id_rental_book },
        relations: ['book', 'rental'],
        select: {
          id: true,
          book: {
            title: true,
            author: true
          },
          status: true,
          quantity: true,
          price_per_day: true,
          date_rented: true,
          due_date: true,
          return_at: true
        }
      });
      if(!rental_book) throw new NotFoundException('Rental book not found');

      // Check status of rental_book
      if(rental_book.status === 'CANCELLED') {
        throw new BadRequestException('This rental book has already been cancelled');
      }
      else if(rental_book.status === 'RETURNED') {
        throw new BadRequestException('This rental book has already been returned');
      }
      else if(rental_book.status === 'BORROWED') {
        throw new BadRequestException('This rental book has already been borrowed');
      }

      // Calculate number of days rented (date_rented -> due_date)
      const date_rented = new Date(rental_book.date_rented);
      const due_date = new Date(rental_book.due_date)
      const diffTime = Math.abs(due_date.getTime() - date_rented.getTime());
      const daysRented = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(daysRented);

      // Calculate cost
      const totalBookRevenue = rental_book.quantity * rental_book.price_per_day * daysRented;

      // Update rentalbook status
      rental_book.status = RentalBookStatus.BORROWED;
      console.log('Before',rental.revenue)
      await manager.save(RentalBook, rental_book);
      if(rental.discount > 0) {
        rental.revenue += totalBookRevenue * (1 - rental.discount / 100)
      }
      else rental.revenue += totalBookRevenue
      console.log('After',rental.revenue)
      //  Check if all rentalBooks are returned
    const checkRentalBookStatus = rental.rental_books.every(
      rb => rb.status === RentalBookStatus.RETURNED || rb.status === RentalBookStatus.CANCELLED || rb.id === rental_book.id
    );
    if (checkRentalBookStatus) 
      rental.status = RentalStatus.ACCEPTED;
    await manager.save(Rental, rental);

    return {
        message: 'Payment confirmed successfully',
        rentalId: rental.id,
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
        },
        rentalBook: {
          id: rental_book.id,
          book: rental_book.book.title,
          quantity: rental_book.quantity,
          price_per_day: rental_book.price_per_day,
          date_rented: rental_book.date_rented,
          due_date: rental_book.due_date,
          return_at: rental_book.return_at,
        },
        totalBookRevenue,
        rentalRevenueAfterUpdate: rental.revenue,
        rentalStatus: rental.status,
      };
    })
  }

  async confirmCancellation(id: number, id_rental: number, id_rental_book: number) {
    return await this.datasource.transaction(async manager => {
      const user = await this.findUser(id);
      if (!user) throw new NotFoundException('User not found');

      // Kiem tra xem nguoi dung co rental nao hay khong
      const rental = await this.findRental(manager, id_rental, id);
      
      if(!rental) throw new NotFoundException('No rental found');

      // Kiem tra xem co rental_book nao khong
      const rental_book = await manager.findOne(RentalBook, {
        where: { id: id_rental_book },
        relations: ['book', 'rental'],
        select: {
          id: true,
          book: {
            id: true,
            categoryid: true,
            title: true,
            author: true,
            stock: true
          },
          status: true,
          quantity: true,
          price_per_day: true,
          date_rented: true,
          due_date: true,
          return_at: true
        }
      });
      if(!rental_book) throw new NotFoundException('Rental book not found');

      // Check status of rental_book
      if(rental_book.status === RentalBookStatus.CANCELLED) {
        throw new BadRequestException('This rental book has already been cancelled');
      }
      else if(rental_book.status === RentalBookStatus.RETURNED) {
        throw new BadRequestException('This rental book has already been returned');
      }
      else if(rental_book.status === RentalBookStatus.BORROWED) {
        throw new BadRequestException('This rental book has already been borrowed');
      }

      // Update rentalbook status and book stock
      rental_book.status = RentalBookStatus.CANCELLED;
      const book = rental_book.book;
      if(book) {
        console.log(book);
        book.stock += rental_book.quantity;
        await manager.save(Books, book);
      } else {
        throw new BadRequestException('Book not found');
      }
      await manager.save(RentalBook, rental_book);

      //  Check if all rentalBooks are returned or cancelled
    const checkRentalBookStatus = rental.rental_books.every(
      rb => rb.status === RentalBookStatus.RETURNED || rb.status === RentalBookStatus.CANCELLED
    );
    if (checkRentalBookStatus) 
      rental.status = RentalStatus.ACCEPTED;
    else 
      rental.status = RentalStatus.PENDING;
    await manager.save(Rental, rental);

    return {
        message: 'Cancellation confirmed successfully',
        rentalId: rental.id,
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
        },
        rentalBook: {
          id: rental_book.id,
          book: rental_book.book.title,
          quantity: rental_book.quantity,
          price_per_day: rental_book.price_per_day,
          date_rented: rental_book.date_rented,
          due_date: rental_book.due_date,
          return_at: rental_book.return_at,
        },
        rentalStatus: rental.status,
      };
    })
  }

  async confirmBookReturn(userId: number, id_rental: number, id_rental_book: number) {
    return await this.datasource.transaction(async manager => {
      console.log('Inside ConfirmBookReturn')
      const user = await this.findUser(userId);
      if (!user) throw new NotFoundException('User not found');

      // Kiem tra xem nguoi dung co rental nao hay khong
      const rental = await this.findRental(manager, id_rental, userId);
      
      if(!rental) throw new NotFoundException('No rental found');

      // Kiem tra xem co rental_book nao khong
      const rental_book = await manager.findOne(RentalBook, {
        where: { id: id_rental_book },
        relations: ['book', 'rental'],
        select: {
          id: true,
          book: {
            id: true,
            categoryid: true,
            title: true,
            author: true,
            stock: true
          },
          status: true,
          quantity: true,
          price_per_day: true,
          date_rented: true,
          due_date: true,
          return_at: true
        }
      });
      if(!rental_book) throw new NotFoundException('Rental book not found');

      // Make sure status of rental_book equals to BORROWED
      if(rental_book.status === RentalBookStatus.CANCELLED) {
        throw new BadRequestException('This rental book has already been cancelled');
      }
      else if(rental_book.status === RentalBookStatus.RETURNED) {
        throw new BadRequestException('This rental book has already been returned');
      }
      else if(rental_book.status === RentalBookStatus.PROGRESSING) {
        throw new BadRequestException('This rental book is not payed');
      }

      // Update rentalbook status and book stock
      rental_book.status = RentalBookStatus.RETURNED;
      const book = rental_book.book;
      if(book) {
        book.stock += rental_book.quantity;
        await manager.save(Books, book);
      } else {
        throw new BadRequestException('Book not found');
      }

      // Check if the returned date is later than the due date and calculate penalty
      const dueDate = new Date(rental_book.due_date);
      const returnDate = new Date();
      let penalty = rental.penalty;
      if (returnDate > dueDate) {
        const daysLate = Math.ceil(
          (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const penaltyPerDay = 10000;
        penalty += daysLate * penaltyPerDay;
      }
      
      //  Check if all rentalBooks are returned or cancelled
      const checkRentalBookStatus = rental.rental_books.every(
        rb => rb.status === RentalBookStatus.RETURNED || rb.status === RentalBookStatus.CANCELLED
      );
      if (checkRentalBookStatus && penalty === 0) 
        rental.status = RentalStatus.ACCEPTED;
      else 
        rental.status = RentalStatus.PENDING;

      rental.penalty = penalty;
      rental_book.return_at = returnDate

      await manager.save(RentalBook, rental_book);
      await manager.save(Rental, rental);
      return {
        message: 'Book returned confirmed successfully',
        rentalId: rental.id,
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
        },
        rentalBook: {
          id: rental_book.id,
          book: rental_book.book.title,
          quantity: rental_book.quantity,
          price_per_day: rental_book.price_per_day,
          date_rented: rental_book.date_rented,
          due_date: rental_book.due_date,
          return_at: rental_book.return_at,
        },
        rentalStatus: rental.status,
      };
    })
  }

  async confirmPenaltyPayment(userId: number, id_rental: number) {
    return await this.datasource.transaction(async manager => {
      const user = await this.findUser(userId);
      if (!user) throw new NotFoundException('User not found');

      // Kiem tra xem nguoi dung co rental nao hay khong
      const rental = await this.findRental(manager, id_rental, userId);
      
      if(!rental) throw new NotFoundException('No rental found');

      rental.revenue += rental.penalty;
      rental.penalty = 0;
      
      const checkRentalBookStatus = rental.rental_books.every(
        rb => rb.status === RentalBookStatus.RETURNED || rb.status === RentalBookStatus.CANCELLED
      );
      if (checkRentalBookStatus) 
        rental.status = RentalStatus.ACCEPTED;
      else 
        rental.status = RentalStatus.PENDING;
      await manager.save(Rental, rental);
    })
  }
}
