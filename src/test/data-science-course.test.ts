import { describe, it, expect } from 'vitest';
import { dataScienceCourseData } from '@/data/courses/data-science';

describe('Data Science Course Data Completeness Verification', () => {
  it('contains all 7 core modules with titles, domains, and practical projects', () => {
    expect(dataScienceCourseData.modules).toHaveLength(7);

    const expectedModuleTitles = [
      'Spreadsheet Analytics with Microsoft Excel',
      'SQL and Relational Database Analytics',
      'Power BI and Interactive Business Intelligence',
      'Tableau and Exploratory Visual Analytics',
      'Python Programming and Automation',
      'Python for Data Analytics, Statistics, and Exploratory Data Analysis',
      'Machine Learning and AI-Assisted Business Intelligence',
    ];

    dataScienceCourseData.modules.forEach((mod, idx) => {
      expect(mod.moduleNumber).toBe(idx + 1);
      expect(mod.title).toBe(expectedModuleTitles[idx]);
      expect(mod.domain).toBeTruthy();
      expect(mod.practicalProject).toBeTruthy();
      expect(mod.projectOutcome).toBeTruthy();
      expect(mod.skillsDeveloped.length).toBeGreaterThan(0);
      expect(mod.submodules.length).toBeGreaterThan(0);
    });
  });

  it('contains all 7 practical projects matching the curriculum outcomes', () => {
    expect(dataScienceCourseData.projects).toHaveLength(7);
    const expectedProjectTitles = [
      'Retail Sales Analytics Dashboard',
      'Digital Banking Database and Financial Analytics System',
      'Global Population Analytics Dashboard',
      'Airbnb Market Insights Dashboard',
      'Railway Reservation System',
      'Retail Sales Insights and Analytics Dashboard',
      'Integrated Machine Learning Business Intelligence Platform',
    ];

    dataScienceCourseData.projects.forEach((proj, idx) => {
      expect(proj.title).toBe(expectedProjectTitles[idx]);
      expect(proj.number).toBe(idx + 1);
      expect(proj.outcome).toBeTruthy();
      expect(proj.skills.length).toBeGreaterThan(0);
    });
  });

  it('contains all 6 software and technology stack categories', () => {
    expect(dataScienceCourseData.techStack).toHaveLength(6);
    const categories = dataScienceCourseData.techStack.map((c) => c.category);
    expect(categories).toContain('Programming and Data Processing');
    expect(categories).toContain('Spreadsheet and Business Intelligence');
    expect(categories).toContain('Data Visualization');
    expect(categories).toContain('Machine Learning and AI');
    expect(categories).toContain('Data Extraction and Image Processing');
    expect(categories).toContain('Development and Productivity');
  });

  it('contains all 12 expected learning outcomes', () => {
    expect(dataScienceCourseData.learningOutcomes.items).toHaveLength(12);
    expect(dataScienceCourseData.learningOutcomes.disclaimer).toBeTruthy();
  });

  it('contains all 7 learning progression stages', () => {
    expect(dataScienceCourseData.learningProgression).toHaveLength(7);
    dataScienceCourseData.learningProgression.forEach((stage, idx) => {
      expect(stage.stage).toBe(idx + 1);
      expect(stage.title).toBeTruthy();
      expect(stage.domain).toBeTruthy();
    });
  });

  it('contains all 5 additional learning areas with notes', () => {
    expect(dataScienceCourseData.additionalLearningAreas).toHaveLength(5);
    const titles = dataScienceCourseData.additionalLearningAreas.map((a) => a.title);
    expect(titles.some((t) => t.includes('Deep Learning'))).toBe(true);
    expect(titles.some((t) => t.includes('Natural Language Processing'))).toBe(true);
    expect(titles.some((t) => t.includes('Computer Vision'))).toBe(true);
    expect(titles.some((t) => t.includes('Generative AI'))).toBe(true);
    expect(titles.some((t) => t.includes('IBM Cloud'))).toBe(true);
  });
});
