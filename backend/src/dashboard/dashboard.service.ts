import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../projects/entities/project.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { Contact, ContactDocument } from '../contact/entities/contact.entity';
import {
  Technology,
  TechnologyDocument,
} from '../technologies/entities/technology.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Technology.name)
    private technologyModel: Model<TechnologyDocument>,
  ) {}

  async getStatistics() {
    const [
      totalProjects,
      completedProjects,
      inProgressProjects,
      totalTechnologies,
      totalMessages,
      unreadMessages,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      this.projectModel.countDocuments(),
      this.projectModel.countDocuments({ status: 'completed' }),
      this.projectModel.countDocuments({ status: 'in-progress' }),
      this.technologyModel.countDocuments(),
      this.contactModel.countDocuments(),
      this.contactModel.countDocuments({ isRead: false }),
      this.projectModel.find().sort({ createdAt: -1 }).limit(5).exec(),
      this.contactModel.find().sort({ createdAt: -1 }).limit(5).exec(),
    ]);

    return {
      overview: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        totalTechnologies,
        totalMessages,
        unreadMessages,
      },
      charts: {
        projectsByStatus: [
          { name: 'Completed', value: completedProjects },
          { name: 'In Progress', value: inProgressProjects },
          {
            name: 'Planning',
            value: totalProjects - completedProjects - inProgressProjects,
          },
        ],
        monthlyActivity: await this.getMonthlyActivity(),
      },
      recent: {
        projects: recentProjects,
        messages: recentMessages,
      },
    };
  }

  private async getMonthlyActivity() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const projectActivity = await this.projectModel.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const messageActivity = await this.contactModel.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format data for charts
    const months: Array<{
      name: string;
      projects: number;
      messages: number;
    }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short' }),
        projects: 0,
        messages: 0,
      });
    }

    // Map aggregated data to months
    projectActivity.forEach((item: any) => {
      const monthIndex = months.findIndex((month) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - months.indexOf(month)));
        return (
          date.getFullYear() === item._id.year &&
          date.getMonth() + 1 === item._id.month
        );
      });
      if (monthIndex !== -1) {
        months[monthIndex].projects = item.count;
      }
    });

    messageActivity.forEach((item: any) => {
      const monthIndex = months.findIndex((month) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - months.indexOf(month)));
        return (
          date.getFullYear() === item._id.year &&
          date.getMonth() + 1 === item._id.month
        );
      });
      if (monthIndex !== -1) {
        months[monthIndex].messages = item.count;
      }
    });

    return months;
  }
}
