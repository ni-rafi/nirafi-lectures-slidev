import React from 'react';
import { SlideSchema } from '@/features/presentation/types/schema';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import { SlideProps } from '@/features/presentation/components/slides/SlideRenderer';
import presenterData from '@/config/presenter.json';
import strategyData from '@/config/cee-tl-assessment-strategy-v1.json';

const { tlLegends, assessmentLegends } = strategyData;

const metadata = {
  courseCode: 'CEE 0731 2224',
  courseTitle: 'Quantity Surveying',
  credit: '1.0',
  category: 'Sessional',
  courseType: 'Practice/Lab',
  yearSemester: '2nd Year / 2nd Semester',
  teacher: presenterData,
  session: '2023-24',
  usn: '2025-2',
};

const outcomes = [
  { id: 1, description: 'Demonstrate skills for the budget preparation of a project' },
  { id: 2, description: 'Prepare the bill of quantity for different work packages of a project' },
  { id: 3, description: 'Evaluate the contractor’s progress payment.' },
];

const rationale = "This course will familiarize the students with the quantity take-off or bill of quantity (BoQ) of different materials, equipment, and resources for a civil engineering project. This knowledge is essential for the budget preparation, material/resource scheduling, and time and cost management of any civil structure and infrastructure projects.";

const contents = [
  { id: 1, title: 'Fundamentals of Quantity Surveying', description: 'Basic theories and concepts of quantity surveying, different tools and techniques of estimation, and introduction of the relevant documents required to prepare estimation for a project.' },
  { id: 2, title: 'Estimation of the building structure', description: 'Measurement of materials and works, types of estimates, conceptual and detail estimates of a two-storied building. Estimation of quantities of steel & RCC elements of a multi-storied residential building. Estimation of plumbing and drainage (pipes, fittings, and fixtures) system of a building, water reservoir, and septic tank. Detail estimation of a one-story steel structure.' },
  { id: 3, title: 'Estimation of roadway', description: 'Computation of earth cutting and filling using various methods, basic estimation of materials required for the rigid and flexible pavements.' },
  { id: 4, title: 'Estimation of a retaining wall and a culvert', description: 'Introduction to various types of retaining walls and culverts. Estimation of materials required to construct a retaining wall and a culvert.' },
];

const references = [
  {
    id: 1,
    title: 'Estimating and Costing in Civil Engineering: Theory and Practice',
    author: 'B.N. Dutta',
    edition: '28th Edition',
    publisher: 'UBS Publishers Distributors',
  },
  {
    id: 2,
    title: 'Quantity Surveying: For Building and Civil Engineering Works',
    author: 'P.L. Bhasin',
    edition: '3rd Edition',
    publisher: 'S. Chand & Company',
  },
];

const schedule = [
  { week: 1, topic: 'Fundamentals of Quantity Surveying', contentCode: '1', coCovered: '1, 2', tlStrategy: ['TL 01', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 2, topic: 'Estimation of Building Structure: Substructure', contentCode: '2', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 3, topic: 'Estimation of Building Structure: Superstructure', contentCode: '2', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 4, topic: 'Estimation of Steel & RCC Elements', contentCode: '2', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 5, topic: 'Detail Estimation of Steel Structure', contentCode: '2', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 6, topic: 'Estimation of Plumbing and Drainage System', contentCode: '2', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 7, topic: 'Mid-Semester Portfolio Check', contentCode: '---', coCovered: '---', tlStrategy: ['---'], assessmentStrategy: ['CA 01'] },
  { week: 8, topic: 'Estimation of Water Reservoir and Septic Tank', contentCode: '2', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 9, topic: 'Estimation of Roadway: Earthwork', contentCode: '3', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 10, topic: 'Estimation of Roadway: Pavements, Retaining Wall & Culvert', contentCode: '3, 4', coCovered: '2', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 11, topic: 'Contractor Progress Payments & Project Budgeting', contentCode: '2', coCovered: '1, 3', tlStrategy: ['TL 01', 'TL 03', 'TL 06'], assessmentStrategy: ['CA 03', 'CA 04', 'SA 01', 'SA 02'] },
  { week: 12, topic: 'Final Review & Viva', contentCode: '---', coCovered: '---', tlStrategy: ['---'], assessmentStrategy: ['SA 02'] },
];

export const courseOutlineData: SlideSchema[] = [
  {
    id: 1,
    section: 'Overview',
    metadata: { title: 'Cover Page', type: 'Course Metadata' },
    layout: 'title-v2',
    props: {
      courseCode: metadata.courseCode,
      courseTitle: metadata.courseTitle,
      yearSemester: metadata.yearSemester,
      creditHours: `${metadata.credit} (${metadata.category})`,
      usnCode: metadata.usn,
      session: metadata.session,
    },
  },
  {
    id: 2,
    section: 'Rationale',
    metadata: { title: 'Course Rationale', type: 'Syllabus Overview' },
    layout: 'fullwidth',
    props: {
      title: 'Course Rationale',
      element: {
        type: 'rich-paragraph',
        data: {
          fragments: [
            rationale,
          ],
        },
      },
    },
  },
  {
    id: 3,
    section: 'Outcomes & Contents',
    metadata: { title: 'Outcomes & Chapters', type: 'Syllabus Breakdown' },
    layout: 'twocolumn',
    props: {
      title: 'Course Outcomes & Content Structure',
      leftWidth: '28%',
      leftElement: { type: 'highlightable-list', data: { outcomes, coCoveredIds: [1, 2, 3] } },
      rightElement: { type: 'master-detail-panel', data: { contents, ccCoveredIds: [1, 2, 3, 4] } },
    },
  },
  {
    id: 4,
    section: 'Schedule Part 1',
    metadata: { title: 'Schedule Weeks 1-7', type: 'Weekly Outline' },
    layout: 'fullwidth',
    props: {
      title: 'Weekly Outline (Part 1)',
      element: {
        type: 'interactive-schedule-table',
        config: { part: 1 },
        data: { schedule, tlLegends, assessmentLegends, outcomes, contents },
      },
    },
  },
  {
    id: 5,
    section: 'Schedule Part 2',
    metadata: { title: 'Schedule Weeks 8-12', type: 'Weekly Outline' },
    layout: 'fullwidth',
    props: {
      title: 'Weekly Outline (Part 2)',
      element: {
        type: 'interactive-schedule-table',
        config: { part: 2 },
        data: { schedule, tlLegends, assessmentLegends, outcomes, contents },
      },
    },
  },
  {
    id: 6,
    section: 'Legends',
    metadata: { title: 'Teaching & Assessment', type: 'Strategies index' },
    layout: 'fullwidth',
    props: {
      title: 'Teaching & Assessment Strategies',
      element: {
        type: 'reference-legends',
        data: { leftLegends: tlLegends, rightLegends: assessmentLegends },
      },
    },
  },
  {
    id: 7,
    section: 'References',
    metadata: { title: 'Reference Books', type: 'Course Materials' },
    layout: 'fullwidth',
    props: {
      title: 'Reference Books & Course Materials',
      element: {
        type: 'reference-books-list',
        data: { references },
      },
    },
  },
  {
    id: 8,
    section: 'Wrap Up',
    metadata: { title: 'Conclusion', type: 'Thank You Slide' },
    layout: 'thankyou',
    props: {
      title: 'Thank You',
      subtitle: 'Questions on Course Syllabus & Assessment Scheme?',
    },
  },
];

export const slides: Record<number, React.ComponentType<SlideProps>> = courseOutlineData.reduce((acc, curr) => {
  acc[curr.id] = (props) => <SlideSchemaEngine {...props} slideNo={curr.id} deck={courseOutlineData} />;
  return acc;
}, {} as Record<number, React.ComponentType<SlideProps>>);

export const slideMetadata = courseOutlineData.reduce((acc, curr) => {
  acc[curr.id] = {
    title: curr.metadata.title,
    type: curr.metadata.type,
    section: curr.section,
  };
  return acc;
}, {} as Record<number, { title: string; type: string; section: string }>);
