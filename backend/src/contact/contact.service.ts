import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact, ContactDocument } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const created = new this.contactModel(createContactDto);
    return created.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.contactModel.findById(id).exec();
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const updated = await this.contactModel
      .findByIdAndUpdate(id, updateContactDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Contact not found');
    return updated;
  }

  async markAsRead(id: string): Promise<Contact> {
    const updated = await this.contactModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Contact not found');
    return updated;
  }

  async remove(id: string): Promise<Contact> {
    const deleted = await this.contactModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Contact not found');
    return deleted;
  }
}
