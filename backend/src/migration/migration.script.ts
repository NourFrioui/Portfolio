#!/usr/bin/env ts-node

/**
 * Migration Script for Portfolio Database
 *
 * This script allows you to run database migrations from the command line.
 *
 * Usage:
 *   npm run migration:localize    - Migrate to localized fields
 *   npm run migration:rollback    - Rollback localized fields
 *   npm run migration:status      - Check migration status
 *   npm run migration:test        - Test localization service
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MigrationService } from '../common/services/migration.service';
import { LocalizationService } from '../common/services/localization.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationService);
  const localizationService = app.get(LocalizationService);

  const command = process.argv[2];

  try {
    switch (command) {
      case 'localize':
        console.log('🚀 Starting migration to localized fields...');
        const migrateResult = await migrationService.migrateToLocalizedFields();
        console.log('✅ Migration completed!');
        console.log(`📊 Results:`, migrateResult);
        break;

      case 'rollback':
        console.log('🔄 Starting rollback of localized fields...');
        const rollbackResult = await migrationService.rollbackLocalizedFields();
        console.log('✅ Rollback completed!');
        console.log(`📊 Results:`, rollbackResult);
        break;

      case 'status':
        console.log('📋 Checking migration status...');
        // This would implement actual status checking
        console.log('ℹ️  Status check not fully implemented yet');
        break;

      case 'test':
        console.log('🧪 Testing localization service...');
        const testField = { en: 'Hello World', fr: 'Bonjour le Monde' };
        const testResult = {
          input: testField,
          output: localizationService.getLocalizedText(testField, 'fr'),
          availableLanguages:
            localizationService.getAvailableLanguages(testField),
          hasContent: localizationService.hasLocalizedContent(testField, 'fr'),
        };
        console.log('✅ Test completed!');
        console.log(`📊 Results:`, testResult);
        break;

      default:
        console.log(`
🔧 Portfolio Database Migration Tool

Usage:
  npm run migration:localize    - Migrate to localized fields
  npm run migration:rollback    - Rollback localized fields  
  npm run migration:status      - Check migration status
  npm run migration:test        - Test localization service

Available commands:
  localize   Convert all string fields to localized objects {en, fr}
  rollback   Convert localized objects back to simple strings
  status     Check current migration status
  test       Test localization service functionality
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
