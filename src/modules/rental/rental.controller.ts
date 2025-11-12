import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/helpers/roles.decorator";
import { UserRole } from "src/modules/users/entity/user.entity";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RentalService } from "src/modules/rental/rental.service";
import { UpdateRentalBookStatusDto } from "src/modules/rental/dtos/updateRentalBookStatus.dto";

@ApiTags('Rental Management')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
@Controller('manage-rent')
export class RentalController {
  constructor(private rentalBookService: RentalService) {}

  // Tra ve danh sach cac rental di kem voi rental book cua user
  @Get(':userId/rental-list/')
  getRentalFromUser(
    /*@Body() updateRentalStatusDto: UpdateRentalBookStatusDto*/
    @Param('userId') userId: string
  ) {
    return this.rentalBookService.getRentalList(+userId);
  }

  // Xac nhan thanh toan mot rental_book cho user
  @Post(':userId/rental-list/:id_rental/rental-book/:id_rental_book/pay')
  confirmPayment(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
    @Param('id_rental_book') id_rental_book: string
  ) {
    return this.rentalBookService.confirmPayment(+userId, +id_rental, +id_rental_book);
  }

  // Xac nhan huy mot rental_book cho user
  @Post(':userId/rental-list/:id_rental/rental-book/:id_rental_book/cancel')
  confirmCancellation(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
    @Param('id_rental_book') id_rental_book: string
  ) {
    return this.rentalBookService.confirmCancellation(+userId, +id_rental, +id_rental_book);
  }

  // Xac nhan tra sach cua user
  @Post(':userId/rental-list/:id_rental/rental-book/:id_rental_book/return-book')
  confirmBookReturn(
    @Param('userId') userId: string,
    @Param('id_rental') id_rental: string,
    @Param('id_rental_book') id_rental_book: string
  ) {
    return this.rentalBookService.confirmBookReturn(+userId, +id_rental, +id_rental_book);
  }

  // Xac nhan thanh toan tien phat cho user
  
}