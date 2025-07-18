import { Resource, Project } from '../types';
import { RESOURCE_COLORS } from '../constants/colors';
import { formatDate, addDays } from './dateUtils';

export const generateTestData = (): { resources: Resource[]; projects: Project[] } => {
  const today = new Date();
  
  const resources: Resource[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Frontend Developer',
      color: RESOURCE_COLORS[0],
    },
    {
      id: '2',
      name: 'Mike Johnson',
      role: 'Backend Developer',
      color: RESOURCE_COLORS[1],
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'UI/UX Designer',
      color: RESOURCE_COLORS[2],
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'QA Engineer',
      color: RESOURCE_COLORS[3],
    },
    {
      id: '5',
      name: 'Lisa Wang',
      role: 'DevOps Engineer',
      color: RESOURCE_COLORS[4],
    },
    {
      id: '6',
      name: 'Tom Anderson',
      role: 'Product Manager',
      color: RESOURCE_COLORS[5],
    },
  ];

  const projects: Project[] = [
    // Sarah Chen projects
    {
      id: 'p1',
      title: 'Dashboard UI',
      startDate: formatDate(addDays(today, -15)),
      endDate: formatDate(addDays(today, 5)),
      resourceId: '1',
      priority: 'high',
    },
    {
      id: 'p2',
      title: 'Mobile App',
      startDate: formatDate(addDays(today, 8)),
      endDate: formatDate(addDays(today, 25)),
      resourceId: '1',
      priority: 'medium',
    },
    {
      id: 'p3',
      title: 'Component Library',
      startDate: formatDate(addDays(today, 30)),
      endDate: formatDate(addDays(today, 45)),
      resourceId: '1',
      priority: 'low',
    },
    
    // Mike Johnson projects
    {
      id: 'p4',
      title: 'API Gateway',
      startDate: formatDate(addDays(today, -10)),
      endDate: formatDate(addDays(today, 10)),
      resourceId: '2',
      priority: 'high',
    },
    {
      id: 'p5',
      title: 'Database Migration',
      startDate: formatDate(addDays(today, 12)),
      endDate: formatDate(addDays(today, 20)),
      resourceId: '2',
      priority: 'high',
    },
    {
      id: 'p6',
      title: 'Performance Optimization',
      startDate: formatDate(addDays(today, 25)),
      endDate: formatDate(addDays(today, 40)),
      resourceId: '2',
      priority: 'medium',
    },
    
    // Emily Rodriguez projects
    {
      id: 'p7',
      title: 'Design System',
      startDate: formatDate(addDays(today, -20)),
      endDate: formatDate(addDays(today, -5)),
      resourceId: '3',
      priority: 'medium',
    },
    {
      id: 'p8',
      title: 'User Research',
      startDate: formatDate(addDays(today, -2)),
      endDate: formatDate(addDays(today, 12)),
      resourceId: '3',
      priority: 'high',
    },
    {
      id: 'p9',
      title: 'Prototype',
      startDate: formatDate(addDays(today, 15)),
      endDate: formatDate(addDays(today, 35)),
      resourceId: '3',
      priority: 'medium',
    },
    
    // David Kim projects
    {
      id: 'p10',
      title: 'Automation Tests',
      startDate: formatDate(addDays(today, -5)),
      endDate: formatDate(addDays(today, 15)),
      resourceId: '4',
      priority: 'high',
    },
    {
      id: 'p11',
      title: 'Load Testing',
      startDate: formatDate(addDays(today, 18)),
      endDate: formatDate(addDays(today, 28)),
      resourceId: '4',
      priority: 'medium',
    },
    {
      id: 'p12',
      title: 'Security Audit',
      startDate: formatDate(addDays(today, 32)),
      endDate: formatDate(addDays(today, 50)),
      resourceId: '4',
      priority: 'high',
    },
    
    // Lisa Wang projects
    {
      id: 'p13',
      title: 'CI/CD Pipeline',
      startDate: formatDate(addDays(today, -12)),
      endDate: formatDate(addDays(today, 8)),
      resourceId: '5',
      priority: 'high',
    },
    {
      id: 'p14',
      title: 'Infrastructure',
      startDate: formatDate(addDays(today, 10)),
      endDate: formatDate(addDays(today, 22)),
      resourceId: '5',
      priority: 'medium',
    },
    {
      id: 'p15',
      title: 'Monitoring Setup',
      startDate: formatDate(addDays(today, 25)),
      endDate: formatDate(addDays(today, 42)),
      resourceId: '5',
      priority: 'low',
    },
    
    // Tom Anderson projects
    {
      id: 'p16',
      title: 'Product Strategy',
      startDate: formatDate(addDays(today, -8)),
      endDate: formatDate(addDays(today, 7)),
      resourceId: '6',
      priority: 'high',
    },
    {
      id: 'p17',
      title: 'Market Research',
      startDate: formatDate(addDays(today, 10)),
      endDate: formatDate(addDays(today, 25)),
      resourceId: '6',
      priority: 'medium',
    },
    {
      id: 'p18',
      title: 'Roadmap Planning',
      startDate: formatDate(addDays(today, 28)),
      endDate: formatDate(addDays(today, 45)),
      resourceId: '6',
      priority: 'low',
    },
  ];

  return { resources, projects };
};