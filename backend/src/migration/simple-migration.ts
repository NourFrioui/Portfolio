#!/usr/bin/env ts-node

/**
 * Simple Migration Script for Portfolio Database
 *
 * This script directly connects to MongoDB and performs the migration
 * without going through the NestJS application context.
 */

import { MongoClient } from 'mongodb';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

interface MigrationResult {
  projects: number;
  technologies: number;
  contacts: number;
  users: number;
  experiences: number;
  studies: number;
  errors: string[];
}

async function migrateToLocalizedFields(): Promise<MigrationResult> {
  const client = new MongoClient(MONGO_URI);
  const result: MigrationResult = {
    projects: 0,
    technologies: 0,
    contacts: 0,
    users: 0,
    experiences: 0,
    studies: 0,
    errors: [],
  };

  try {
    await client.connect();
    console.log('🔌 Connected to MongoDB');

    const db = client.db();

    // Migrate Projects
    try {
      const projectsCollection = db.collection('projects');
      const projects = await projectsCollection.find({}).toArray();

      for (const project of projects) {
        const updateDoc: any = {};
        let hasChanges = false;

        // String fields to migrate
        const stringFields = [
          'title',
          'description',
          'longDescription',
          'detailedDescription',
        ];

        for (const field of stringFields) {
          if (project[field] && typeof project[field] === 'string') {
            updateDoc[field] = { en: project[field], fr: '' };
            hasChanges = true;
          }
        }

        // Nested fields
        if (
          project.team &&
          project.team.role &&
          typeof project.team.role === 'string'
        ) {
          updateDoc['team.role'] = { en: project.team.role, fr: '' };
          hasChanges = true;
        }

        if (hasChanges) {
          await projectsCollection.updateOne(
            { _id: project._id },
            { $set: updateDoc },
          );
          result.projects++;
        }
      }
      console.log(`✅ Migrated ${result.projects} projects`);
    } catch (error) {
      result.errors.push(`Projects migration error: ${error.message}`);
    }

    // Migrate Technologies
    try {
      const technologiesCollection = db.collection('technologies');
      const technologies = await technologiesCollection.find({}).toArray();

      for (const tech of technologies) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = ['name', 'description'];

        for (const field of stringFields) {
          if (tech[field] && typeof tech[field] === 'string') {
            updateDoc[field] = { en: tech[field], fr: '' };
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await technologiesCollection.updateOne(
            { _id: tech._id },
            { $set: updateDoc },
          );
          result.technologies++;
        }
      }
      console.log(`✅ Migrated ${result.technologies} technologies`);
    } catch (error) {
      result.errors.push(`Technologies migration error: ${error.message}`);
    }

    // Migrate Contacts
    try {
      const contactsCollection = db.collection('contacts');
      const contacts = await contactsCollection.find({}).toArray();

      for (const contact of contacts) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = ['name', 'message', 'projectType'];

        for (const field of stringFields) {
          if (contact[field] && typeof contact[field] === 'string') {
            updateDoc[field] = { en: contact[field], fr: '' };
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await contactsCollection.updateOne(
            { _id: contact._id },
            { $set: updateDoc },
          );
          result.contacts++;
        }
      }
      console.log(`✅ Migrated ${result.contacts} contacts`);
    } catch (error) {
      result.errors.push(`Contacts migration error: ${error.message}`);
    }

    // Migrate Users
    try {
      const usersCollection = db.collection('users');
      const users = await usersCollection.find({}).toArray();

      for (const user of users) {
        const updateDoc: any = {};
        let hasChanges = false;

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
          if (user[field] && typeof user[field] === 'string') {
            updateDoc[field] = { en: user[field], fr: '' };
            hasChanges = true;
          }
        }

        // Array fields
        const arrayFields = [
          'skills',
          'experiences',
          'education',
          'certifications',
          'languages',
        ];
        for (const field of arrayFields) {
          if (user[field] && Array.isArray(user[field])) {
            const localizedArray = user[field].map((item: any) => {
              if (typeof item === 'string') {
                return { en: item, fr: '' };
              }
              return item;
            });
            updateDoc[field] = localizedArray;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: updateDoc },
          );
          result.users++;
        }
      }
      console.log(`✅ Migrated ${result.users} users`);
    } catch (error) {
      result.errors.push(`Users migration error: ${error.message}`);
    }

    // Migrate Experiences
    try {
      const experiencesCollection = db.collection('experiences');
      const experiences = await experiencesCollection.find({}).toArray();

      for (const experience of experiences) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = [
          'company',
          'name',
          'position',
          'description',
          'location',
        ];

        for (const field of stringFields) {
          if (experience[field] && typeof experience[field] === 'string') {
            updateDoc[field] = { en: experience[field], fr: '' };
            hasChanges = true;
          }
        }

        // Array fields
        if (experience.achievements && Array.isArray(experience.achievements)) {
          const localizedArray = experience.achievements.map((item: any) => {
            if (typeof item === 'string') {
              return { en: item, fr: '' };
            }
            return item;
          });
          updateDoc.achievements = localizedArray;
          hasChanges = true;
        }

        if (hasChanges) {
          await experiencesCollection.updateOne(
            { _id: experience._id },
            { $set: updateDoc },
          );
          result.experiences++;
        }
      }
      console.log(`✅ Migrated ${result.experiences} experiences`);
    } catch (error) {
      result.errors.push(`Experiences migration error: ${error.message}`);
    }

    // Migrate Studies
    try {
      const studiesCollection = db.collection('studies');
      const studies = await studiesCollection.find({}).toArray();

      for (const study of studies) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = [
          'institution',
          'degree',
          'field',
          'description',
          'location',
        ];

        for (const field of stringFields) {
          if (study[field] && typeof study[field] === 'string') {
            updateDoc[field] = { en: study[field], fr: '' };
            hasChanges = true;
          }
        }

        // Array fields
        const arrayFields = [
          'subjects',
          'achievements',
          'coursework',
          'honors',
        ];
        for (const field of arrayFields) {
          if (study[field] && Array.isArray(study[field])) {
            const localizedArray = study[field].map((item: any) => {
              if (typeof item === 'string') {
                return { en: item, fr: '' };
              }
              return item;
            });
            updateDoc[field] = localizedArray;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await studiesCollection.updateOne(
            { _id: study._id },
            { $set: updateDoc },
          );
          result.studies++;
        }
      }
      console.log(`✅ Migrated ${result.studies} studies`);
    } catch (error) {
      result.errors.push(`Studies migration error: ${error.message}`);
    }
  } catch (error) {
    result.errors.push(`Database connection error: ${error.message}`);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }

  return result;
}

async function rollbackLocalizedFields(): Promise<MigrationResult> {
  const client = new MongoClient(MONGO_URI);
  const result: MigrationResult = {
    projects: 0,
    technologies: 0,
    contacts: 0,
    users: 0,
    experiences: 0,
    studies: 0,
    errors: [],
  };

  try {
    await client.connect();
    console.log('🔌 Connected to MongoDB');

    const db = client.db();

    // Rollback Projects
    try {
      const projectsCollection = db.collection('projects');
      const projects = await projectsCollection.find({}).toArray();

      for (const project of projects) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = [
          'title',
          'description',
          'longDescription',
          'detailedDescription',
        ];

        for (const field of stringFields) {
          if (
            project[field] &&
            typeof project[field] === 'object' &&
            project[field].en
          ) {
            updateDoc[field] = project[field].en;
            hasChanges = true;
          }
        }

        if (
          project.team &&
          project.team.role &&
          typeof project.team.role === 'object' &&
          project.team.role.en
        ) {
          updateDoc['team.role'] = project.team.role.en;
          hasChanges = true;
        }

        if (hasChanges) {
          await projectsCollection.updateOne(
            { _id: project._id },
            { $set: updateDoc },
          );
          result.projects++;
        }
      }
      console.log(`✅ Rolled back ${result.projects} projects`);
    } catch (error) {
      result.errors.push(`Projects rollback error: ${error.message}`);
    }

    // Rollback Technologies
    try {
      const technologiesCollection = db.collection('technologies');
      const technologies = await technologiesCollection.find({}).toArray();

      for (const tech of technologies) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = ['name', 'description'];

        for (const field of stringFields) {
          if (
            tech[field] &&
            typeof tech[field] === 'object' &&
            tech[field].en
          ) {
            updateDoc[field] = tech[field].en;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await technologiesCollection.updateOne(
            { _id: tech._id },
            { $set: updateDoc },
          );
          result.technologies++;
        }
      }
      console.log(`✅ Rolled back ${result.technologies} technologies`);
    } catch (error) {
      result.errors.push(`Technologies rollback error: ${error.message}`);
    }

    // Rollback Contacts
    try {
      const contactsCollection = db.collection('contacts');
      const contacts = await contactsCollection.find({}).toArray();

      for (const contact of contacts) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = ['name', 'message', 'projectType'];

        for (const field of stringFields) {
          if (
            contact[field] &&
            typeof contact[field] === 'object' &&
            contact[field].en
          ) {
            updateDoc[field] = contact[field].en;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await contactsCollection.updateOne(
            { _id: contact._id },
            { $set: updateDoc },
          );
          result.contacts++;
        }
      }
      console.log(`✅ Rolled back ${result.contacts} contacts`);
    } catch (error) {
      result.errors.push(`Contacts rollback error: ${error.message}`);
    }

    // Rollback Users
    try {
      const usersCollection = db.collection('users');
      const users = await usersCollection.find({}).toArray();

      for (const user of users) {
        const updateDoc: any = {};
        let hasChanges = false;

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
          if (
            user[field] &&
            typeof user[field] === 'object' &&
            user[field].en
          ) {
            updateDoc[field] = user[field].en;
            hasChanges = true;
          }
        }

        // Array fields
        const arrayFields = [
          'skills',
          'experiences',
          'education',
          'certifications',
          'languages',
        ];
        for (const field of arrayFields) {
          if (user[field] && Array.isArray(user[field])) {
            const simpleArray = user[field].map((item: any) => {
              if (typeof item === 'object' && item.en) {
                return item.en;
              }
              return item;
            });
            updateDoc[field] = simpleArray;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: updateDoc },
          );
          result.users++;
        }
      }
      console.log(`✅ Rolled back ${result.users} users`);
    } catch (error) {
      result.errors.push(`Users rollback error: ${error.message}`);
    }

    // Rollback Experiences
    try {
      const experiencesCollection = db.collection('experiences');
      const experiences = await experiencesCollection.find({}).toArray();

      for (const experience of experiences) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = [
          'company',
          'name',
          'position',
          'description',
          'location',
        ];

        for (const field of stringFields) {
          if (
            experience[field] &&
            typeof experience[field] === 'object' &&
            experience[field].en
          ) {
            updateDoc[field] = experience[field].en;
            hasChanges = true;
          }
        }

        // Array fields
        if (experience.achievements && Array.isArray(experience.achievements)) {
          const simpleArray = experience.achievements.map((item: any) => {
            if (typeof item === 'object' && item.en) {
              return item.en;
            }
            return item;
          });
          updateDoc.achievements = simpleArray;
          hasChanges = true;
        }

        if (hasChanges) {
          await experiencesCollection.updateOne(
            { _id: experience._id },
            { $set: updateDoc },
          );
          result.experiences++;
        }
      }
      console.log(`✅ Rolled back ${result.experiences} experiences`);
    } catch (error) {
      result.errors.push(`Experiences rollback error: ${error.message}`);
    }

    // Rollback Studies
    try {
      const studiesCollection = db.collection('studies');
      const studies = await studiesCollection.find({}).toArray();

      for (const study of studies) {
        const updateDoc: any = {};
        let hasChanges = false;

        const stringFields = [
          'institution',
          'degree',
          'field',
          'description',
          'location',
        ];

        for (const field of stringFields) {
          if (
            study[field] &&
            typeof study[field] === 'object' &&
            study[field].en
          ) {
            updateDoc[field] = study[field].en;
            hasChanges = true;
          }
        }

        // Array fields
        const arrayFields = [
          'subjects',
          'achievements',
          'coursework',
          'honors',
        ];
        for (const field of arrayFields) {
          if (study[field] && Array.isArray(study[field])) {
            const simpleArray = study[field].map((item: any) => {
              if (typeof item === 'object' && item.en) {
                return item.en;
              }
              return item;
            });
            updateDoc[field] = simpleArray;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          await studiesCollection.updateOne(
            { _id: study._id },
            { $set: updateDoc },
          );
          result.studies++;
        }
      }
      console.log(`✅ Rolled back ${result.studies} studies`);
    } catch (error) {
      result.errors.push(`Studies rollback error: ${error.message}`);
    }
  } catch (error) {
    result.errors.push(`Database connection error: ${error.message}`);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }

  return result;
}

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'localize':
        console.log('🚀 Starting migration to localized fields...');
        const migrateResult = await migrateToLocalizedFields();
        console.log('✅ Migration completed!');
        console.log(`📊 Results:`, migrateResult);
        break;

      case 'rollback':
        console.log('🔄 Starting rollback of localized fields...');
        const rollbackResult = await rollbackLocalizedFields();
        console.log('✅ Rollback completed!');
        console.log(`📊 Results:`, rollbackResult);
        break;

      default:
        console.log(`
🔧 Simple Portfolio Database Migration Tool

Usage:
  npm run simple-migration:localize    - Migrate to localized fields
  npm run simple-migration:rollback    - Rollback localized fields

Available commands:
  localize   Convert all string fields to localized objects {en, fr}
  rollback   Convert localized objects back to simple strings

Collections migrated:
  - Projects: title, description, longDescription, detailedDescription, team.role, technologyIds[], tagIds[]
  - Technologies: name, description
  - Contacts: name, message, projectType
  - Users: firstName, lastName, address, city, country, state, company, jobTitle, bio, description, details, fullName, title, location, skills[], experiences[], education[], certifications[], languages[], linkedinUrl, resumeUrl
  - Experiences: company, name, position, description, location, achievements[]
  - Studies: institution, degree, field, description, location, subjects[], achievements[], coursework[], honors[]
  - Tags: name, description, category, color, iconUrl
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
