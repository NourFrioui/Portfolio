import {
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MigrationService } from '../common/services/migration.service';
import { LocalizationService } from '../common/services/localization.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('migration')
@ApiBearerAuth()
@Controller('migration')
export class MigrationController {
  constructor(
    private readonly migrationService: MigrationService,
    private readonly localizationService: LocalizationService,
  ) {}

  @Post('localize-fields')
  @ApiOperation({
    summary: 'Migrate all collections to use localized fields',
    description:
      'Converts all string fields to localized objects {en: string, fr: string} in all collections',
  })
  @ApiResponse({
    status: 200,
    description: 'Migration completed successfully',
  })
  @ApiResponse({ status: 500, description: 'Migration failed' })
  async migrateToLocalizedFields() {
    try {
      const result = await this.migrationService.migrateToLocalizedFields();
      const totalMigrated =
        result.projects + result.technologies + result.contacts + result.users;

      return {
        ...result,
        totalMigrated,
        success: result.errors.length === 0,
        message: `Migration completed. ${totalMigrated} documents migrated successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        `Migration failed: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('rollback-localized-fields')
  @ApiOperation({
    summary: 'Rollback localized fields to simple strings',
    description:
      'Converts all localized objects back to simple strings (uses English value)',
  })
  @ApiResponse({
    status: 200,
    description: 'Rollback completed successfully',
  })
  @ApiResponse({ status: 500, description: 'Rollback failed' })
  async rollbackLocalizedFields() {
    try {
      const result = await this.migrationService.rollbackLocalizedFields();
      const totalRolledBack =
        result.projects + result.technologies + result.contacts + result.users;

      return {
        ...result,
        totalRolledBack,
        success: result.errors.length === 0,
        message: `Rollback completed. ${totalRolledBack} documents rolled back successfully.`,
      };
    } catch (error) {
      throw new HttpException(
        `Rollback failed: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get migration status',
    description: 'Check the current status of localized fields in the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Migration status retrieved successfully',
  })
  getMigrationStatus() {
    try {
      return {
        collections: {
          projects: { status: 'unknown', count: 0 },
          technologies: { status: 'unknown', count: 0 },
          contacts: { status: 'unknown', count: 0 },
          users: { status: 'unknown', count: 0 },
        },
        overallStatus: 'unknown',
        message: 'Migration status check not fully implemented yet',
      };
    } catch (error) {
      throw new HttpException(
        `Status check failed: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test-localization')
  @ApiOperation({
    summary: 'Test localization service',
    description: 'Test the localization service with sample data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        field: {
          type: 'object',
          properties: {
            en: { type: 'string' },
            fr: { type: 'string' },
          },
        },
        language: {
          type: 'string',
          enum: ['en', 'fr'],
          default: 'en',
        },
      },
      required: ['field'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Localization test completed successfully',
  })
  testLocalization(body: {
    field: { en?: string; fr?: string } | string;
    language?: 'en' | 'fr';
  }) {
    try {
      const { field, language = 'en' } = body;
      const output = this.localizationService.getLocalizedText(field, language);
      const availableLanguages =
        this.localizationService.getAvailableLanguages(field);
      const hasContent = this.localizationService.hasLocalizedContent(
        field,
        language,
      );

      return {
        input: { field, language },
        output,
        availableLanguages,
        hasContent,
        message: 'Localization test completed successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Localization test failed: ${(error as Error).message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('localization-helpers')
  @ApiOperation({ summary: 'Get localization service helper methods' })
  @ApiResponse({
    status: 200,
    description: 'Localization helpers documentation',
  })
  getLocalizationHelpers() {
    return {
      methods: [
        'getLocalizedText(field, language, fallback)',
        'getLocalizedArray(fields, language)',
        'hasLocalizedContent(field, language)',
        'getAvailableLanguages(field)',
        'createLocalizedField(text, language)',
        'mergeLocalizedFields(field1, field2)',
      ],
      examples: {
        getLocalizedText: {
          input: { field: { en: 'Hello', fr: 'Bonjour' }, language: 'fr' },
          output: 'Bonjour',
        },
        getLocalizedArray: {
          input: {
            fields: [{ en: 'Skill 1', fr: 'Compétence 1' }],
            language: 'en',
          },
          output: ['Skill 1'],
        },
        hasLocalizedContent: {
          input: { field: { en: 'Hello', fr: '' }, language: 'en' },
          output: true,
        },
      },
      usage: {
        migrate: {
          endpoint: 'POST /migration/localize-fields',
          description: 'Migrate all collections to use localized fields',
          example:
            'curl -X POST http://localhost:3000/migration/localize-fields',
        },
        rollback: {
          endpoint: 'POST /migration/rollback-localized-fields',
          description: 'Rollback localized fields to simple strings',
          example:
            'curl -X POST http://localhost:3000/migration/rollback-localized-fields',
        },
        test: {
          endpoint: 'POST /migration/test-localization',
          description: 'Test localization service with sample data',
          example: {
            method: 'POST',
            url: 'http://localhost:3000/migration/test-localization',
            body: {
              field: { en: 'Hello', fr: 'Bonjour' },
              language: 'fr',
            },
          },
        },
      },
    };
  }
}
