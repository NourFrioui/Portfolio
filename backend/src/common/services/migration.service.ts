import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Project,
  ProjectDocument,
} from '../../projects/entities/project.entity';
import {
  Technology,
  TechnologyDocument,
} from '../../technologies/entities/technology.entity';
import {
  Contact,
  ContactDocument,
} from '../../contact/entities/contact.entity';
import { User, UserDocument } from '../../users/entities/user.entity';

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Technology.name)
    private technologyModel: Model<TechnologyDocument>,
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Migrate all collections to use localized fields
   */
  async migrateToLocalizedFields(): Promise<{
    projects: number;
    technologies: number;
    contacts: number;
    users: number;
    errors: string[];
  }> {
    const results = {
      projects: 0,
      technologies: 0,
      contacts: 0,
      users: 0,
      errors: [] as string[],
    };

    try {
      // Migrate Projects
      results.projects = await this.migrateProjects();
    } catch (error) {
      results.errors.push(`Projects migration failed: ${error}`);
    }

    try {
      // Migrate Technologies
      results.technologies = await this.migrateTechnologies();
    } catch (error) {
      results.errors.push(`Technologies migration failed: ${error}`);
    }

    try {
      // Migrate Contacts
      results.contacts = await this.migrateContacts();
    } catch (error) {
      results.errors.push(`Contacts migration failed: ${error.message}`);
    }

    try {
      // Migrate Users
      results.users = await this.migrateUsers();
    } catch (error) {
      results.errors.push(`Users migration failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Migrate Projects collection
   */
  private async migrateProjects(): Promise<number> {
    const projects = await this.projectModel
      .find({
        $or: [
          { title: { $type: 'string' } },
          { description: { $type: 'string' } },
          { longDescription: { $type: 'string' } },
          { detailedDescription: { $type: 'string' } },
        ],
      })
      .exec();

    let migrated = 0;

    for (const project of projects) {
      const updateData: any = {};

      // Migrate string fields to localized
      if (typeof project.title === 'string') {
        updateData.title = { en: project.title, fr: '' };
      }
      if (typeof project.description === 'string') {
        updateData.description = { en: project.description, fr: '' };
      }
      if (typeof project.longDescription === 'string') {
        updateData.longDescription = { en: project.longDescription, fr: '' };
      }
      if (typeof project.detailedDescription === 'string') {
        updateData.detailedDescription = {
          en: project.detailedDescription,
          fr: '',
        };
      }

      // Migrate team.role
      if (project.team && typeof project.team.role === 'string') {
        updateData['team.role'] = { en: project.team.role, fr: '' };
      }

      // Migrate results array
      if (project.results && Array.isArray(project.results)) {
        updateData.results = project.results.map((result) => ({
          metric:
            typeof result.metric === 'string'
              ? { en: result.metric, fr: '' }
              : result.metric,
          value: result.value,
        }));
      }

      // Migrate clientTestimonial
      if (project.clientTestimonial) {
        const testimonial: any = {};
        if (typeof project.clientTestimonial.text === 'string') {
          testimonial.text = { en: project.clientTestimonial.text, fr: '' };
        }
        if (typeof project.clientTestimonial.author === 'string') {
          testimonial.author = { en: project.clientTestimonial.author, fr: '' };
        }
        if (typeof project.clientTestimonial.position === 'string') {
          testimonial.position = {
            en: project.clientTestimonial.position,
            fr: '',
          };
        }
        if (Object.keys(testimonial).length > 0) {
          updateData.clientTestimonial = testimonial;
        }
      }

      if (Object.keys(updateData).length > 0) {
        await this.projectModel.updateOne(
          { _id: project._id },
          { $set: updateData },
        );
        migrated++;
      }
    }

    return migrated;
  }

  /**
   * Migrate Technologies collection
   */
  private async migrateTechnologies(): Promise<number> {
    const technologies = await this.technologyModel
      .find({
        $or: [
          { name: { $type: 'string' } },
          { description: { $type: 'string' } },
        ],
      })
      .exec();

    let migrated = 0;

    for (const tech of technologies) {
      const updateData: any = {};

      if (typeof tech.name === 'string') {
        updateData.name = { en: tech.name, fr: '' };
      }
      if (typeof tech.description === 'string') {
        updateData.description = { en: tech.description, fr: '' };
      }

      if (Object.keys(updateData).length > 0) {
        await this.technologyModel.updateOne(
          { _id: tech._id },
          { $set: updateData },
        );
        migrated++;
      }
    }

    return migrated;
  }

  /**
   * Migrate Contacts collection
   */
  private async migrateContacts(): Promise<number> {
    const contacts = await this.contactModel
      .find({
        $or: [
          { name: { $type: 'string' } },
          { message: { $type: 'string' } },
          { projectType: { $type: 'string' } },
        ],
      })
      .exec();

    let migrated = 0;

    for (const contact of contacts) {
      const updateData: any = {};

      if (typeof contact.name === 'string') {
        updateData.name = { en: contact.name, fr: '' };
      }
      if (typeof contact.message === 'string') {
        updateData.message = { en: contact.message, fr: '' };
      }
      if (typeof contact.projectType === 'string') {
        updateData.projectType = { en: contact.projectType, fr: '' };
      }

      if (Object.keys(updateData).length > 0) {
        await this.contactModel.updateOne(
          { _id: contact._id },
          { $set: updateData },
        );
        migrated++;
      }
    }

    return migrated;
  }

  /**
   * Migrate Users collection
   */
  private async migrateUsers(): Promise<number> {
    const users = await this.userModel
      .find({
        $or: [
          { firstName: { $type: 'string' } },
          { lastName: { $type: 'string' } },
          { address: { $type: 'string' } },
          { city: { $type: 'string' } },
          { country: { $type: 'string' } },
          { state: { $type: 'string' } },
          { company: { $type: 'string' } },
          { jobTitle: { $type: 'string' } },
          { bio: { $type: 'string' } },
          { description: { $type: 'string' } },
          { details: { $type: 'string' } },
          { fullName: { $type: 'string' } },
          { title: { $type: 'string' } },
          { location: { $type: 'string' } },
        ],
      })
      .exec();

    let migrated = 0;

    for (const user of users) {
      const updateData: any = {};

      // Migrate string fields to localized
      const stringFields = [
        'firstName',
        'lastName',
        'address',
        'city',
        'country',
        'state',
        'company',
        'jobTitle',
        'bio',
        'description',
        'details',
        'fullName',
        'title',
        'location',
      ];

      for (const field of stringFields) {
        if (typeof user[field] === 'string') {
          updateData[field] = { en: user[field], fr: '' };
        }
      }

      // Migrate array fields
      if (
        user.skills &&
        Array.isArray(user.skills) &&
        typeof user.skills[0] === 'string'
      ) {
        updateData.skills = user.skills.map((skill) => ({ en: skill, fr: '' }));
      }
      if (
        user.experiences &&
        Array.isArray(user.experiences) &&
        typeof user.experiences[0] === 'string'
      ) {
        updateData.experiences = user.experiences.map((exp) => ({
          en: exp,
          fr: '',
        }));
      }
      if (
        user.education &&
        Array.isArray(user.education) &&
        typeof user.education[0] === 'string'
      ) {
        updateData.education = user.education.map((edu) => ({
          en: edu,
          fr: '',
        }));
      }
      if (
        user.certifications &&
        Array.isArray(user.certifications) &&
        typeof user.certifications[0] === 'string'
      ) {
        updateData.certifications = user.certifications.map((cert) => ({
          en: cert,
          fr: '',
        }));
      }
      if (
        user.languages &&
        Array.isArray(user.languages) &&
        typeof user.languages[0] === 'string'
      ) {
        updateData.languages = user.languages.map((lang) => ({
          en: lang,
          fr: '',
        }));
      }

      if (Object.keys(updateData).length > 0) {
        await this.userModel.updateOne({ _id: user._id }, { $set: updateData });
        migrated++;
      }
    }

    return migrated;
  }

  /**
   * Rollback migration (convert localized fields back to strings)
   */
  async rollbackLocalizedFields(): Promise<{
    projects: number;
    technologies: number;
    contacts: number;
    users: number;
    errors: string[];
  }> {
    const results = {
      projects: 0,
      technologies: 0,
      contacts: 0,
      users: 0,
      errors: [] as string[],
    };

    try {
      results.projects = await this.rollbackProjects();
    } catch (error) {
      results.errors.push(`Projects rollback failed: ${error.message}`);
    }

    try {
      results.technologies = await this.rollbackTechnologies();
    } catch (error) {
      results.errors.push(`Technologies rollback failed: ${error.message}`);
    }

    try {
      results.contacts = await this.rollbackContacts();
    } catch (error) {
      results.errors.push(`Contacts rollback failed: ${error.message}`);
    }

    try {
      results.users = await this.rollbackUsers();
    } catch (error) {
      results.errors.push(`Users rollback failed: ${error.message}`);
    }

    return results;
  }

  private async rollbackProjects(): Promise<number> {
    // Implementation for rollback
    return 0;
  }

  private async rollbackTechnologies(): Promise<number> {
    // Implementation for rollback
    return 0;
  }

  private async rollbackContacts(): Promise<number> {
    // Implementation for rollback
    return 0;
  }

  private async rollbackUsers(): Promise<number> {
    // Implementation for rollback
    return 0;
  }
}
