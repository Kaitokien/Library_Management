import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/helpers/roles.decorator";
import { UserRole } from "src/modules/users/entity/user.entity";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { RentalService } from "src/modules/rental/rental.service";

@ApiTags('Rental Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
@Controller('manage-rent')
export class RentalController {
  constructor(private rentalBookService: RentalService) {}

  // Tra ve danh sach cac rental di kem voi rental book cua user
  @ApiOperation({ summary: 'Lấy danh sách rental của user, kèm danh sách rental books' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiResponse({ status: 200, description: 'Danh sách rental trả về' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rental hoac user' })
  @Get(':userId/rental-list')
  getRentalFromUser(
    /*@Body() updateRentalStatusDto: UpdateRentalBookStatusDto*/
    @Param('userId') userId: string
  ) {
    return this.rentalBookService.getRentalList(+userId);
  }

  // Xac nhan thanh toan mot rental_book cho user
  @ApiOperation({ summary: 'Xác nhận thanh toán cho một rental book' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiParam({ name: 'id_rental', description: 'ID của rental' })
  @ApiParam({ name: 'id_rental_book', description: 'ID của rental book' })
  @ApiResponse({ status: 200, description: 'payment confirmed successfully' })
  @ApiResponse({ status: 400, description: 'This rental has already been cancelled/returned/borrowed' })
  @ApiResponse({ status: 404, description: 'User/Rental/Rental_book not found' })
  @Post(':userId/rental-list/:id_rental/rental-book/:id_rental_book/pay')
  confirmPayment(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
    @Param('id_rental_book') id_rental_book: string
  ) {
    return this.rentalBookService.confirmPayment(+userId, +id_rental, +id_rental_book);
  }

  // Xac nhan huy mot rental_book cho user
  @ApiOperation({ summary: 'Xác nhận hủy một rental book' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiParam({ name: 'id_rental', description: 'ID của rental' })
  @ApiParam({ name: 'id_rental_book', description: 'ID của rental book' })
  @ApiResponse({ status: 200, description: 'Cancellation confirmed successfully' })
  @ApiResponse({ status: 400, description: 'This rental has already been cancelled/returned/borrowed' })
  @ApiResponse({ status: 404, description: 'User/Rental/Rental_book not found' })
  @Post(':userId/rental-list/:id_rental/rental-book/:id_rental_book/cancel')
  confirmCancellation(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
    @Param('id_rental_book') id_rental_book: string
  ) {
    return this.rentalBookService.confirmCancellation(+userId, +id_rental, +id_rental_book);
  }

  // Xac nhan tra sach cua user
  @ApiOperation({ summary: 'Xác nhận trả sách của user' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiParam({ name: 'id_rental', description: 'ID của rental' })
  @ApiParam({ name: 'id_rental_book', description: 'ID của rental book' })
  @ApiResponse({ status: 200, description: 'Book returned confirmed successfully' })
  @ApiResponse({ status: 400, description: 'This rental has already been cancelled/returned/not paid' })
  @ApiResponse({ status: 404, description: 'User/Rental/Rental_book not found' })
  @Post(':userId/rental-list/:id_rental/rental-book/:id_rental_book/return-book')
  confirmBookReturn(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
    @Param('id_rental_book') id_rental_book: string
  ) {
    return this.rentalBookService.confirmBookReturn(+userId, +id_rental, +id_rental_book);
  }

  // Xac nhan thanh toan tien phat cho user
  @ApiOperation({ summary: 'Xác nhận thanh toán tiền phạt cho user' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiParam({ name: 'id_rental', description: 'ID của rental' })
  @ApiResponse({ status: 200, description: 'Penalty payment confirmed successfully' })
  @ApiResponse({ status: 404, description: 'User/Rental not found' })
  @Post(':userId/rental-list/:id_rental/penalty-payment')
  confirmPenaltyPayment(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
  ) {
    return this.rentalBookService.confirmPenaltyPayment(+userId, +id_rental);
  }
}