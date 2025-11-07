import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembershipService {
  constructor(
    
  ) {}
  
  createMembership() {
    return 'This is createMembership service!'
  }
}
