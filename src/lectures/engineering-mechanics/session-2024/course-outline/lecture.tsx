import React from 'react';
import { SlideSchema } from '@/features/presentation/types/schema';
import { SlideSchemaEngine } from '@/features/presentation/components/slides/SlideSchemaEngine';
import presenterData from '@/config/presenter.json';

const metadata = {
  courseCode: 'CEE 0541 1233',
  courseTitle: 'Engineering Mechanics II',
  credit: '02',
  category: 'Core',
  courseType: 'Theory',
  yearSemester: '1st Year / 2nd Semester',
  teacher: presenterData,
  session: '2024-25',
  usn: '2024-2',
};

const outcomes = [
  { id: 1, description: 'Explain basic friction concepts and solve problems on wedges, belts, and bearings using these concepts.' },
  { id: 2, description: 'Interpret parabolic cable and catenary and calculate force on a cable support system.' },
  { id: 3, description: 'Identify basic concepts of kinematics and calculate displacement, velocity and acceleration of a particle and rigid body in motion.' },
  { id: 4, description: 'Apply different principles of kinetics to solve related problems.' },
];

const rationale = "This course introduces the relevant physical properties and fundamental laws governing materials and structures' behavior, and students will learn how to solve various problems of interest to civil and environmental engineers. In this course, the emphasis is on the physical understanding of why a material or structure behaves the way it does in the engineering design of materials and structures.";

const contents = [
  { id: 1, title: 'Fundamentals of Friction', description: 'This chapter presents frictional force, limiting frictional force, coefficient of kinetic friction, laws of friction, angle of friction, belt friction, and pivot friction.' },
  { id: 2, title: 'Flexible Cord', description: 'This chapter presents the parabolic chord, the length of the parabolic curve, the catenary.' },
  { id: 3, title: 'Plane Motion', description: 'Review of Displacement, Velocity, Acceleration, Constant Acceleration-Rectilinear Motion, Variable Acceleration, Angular Velocity, Relation Between Angular And Linear Speeds, Angular Acceleration, Constant Angular Acceleration, Curvilinear Motion, Tangential And Normal Accelerations.' },
  { id: 4, title: 'Fundamentals of Relative Motion', description: 'This chapter presents relative displacement, relative velocity, and relative motion of points in a rigid body.' },
  { id: 5, title: 'Force System for Rectilinear Motion', description: 'Introduction, Newton’s Laws of Motion, Component Forces and Accelerations, Motion on an Inclined Planes, Motion of Connected Bodies, Motion of Center of Gravity of a Rigid Body, Location of the Resultant – Body in Rectilinear Translation, Inertia Force, Methods of Solving Problems.' },
  { id: 6, title: 'Work, Kinetic Energy and Power', description: 'Work, Work of a System of Forces Acting on a Rigid Body, Principle of Work and Kinetic Energy, Kinetic Energy of a Rigid Body in Translation, Potential Energy, Work of a Couple, Kinetic Energy of a Rotating Body, Bodies in Plane Motion, Frictional Force in Plane Rolling, Power, Efficiency.' },
  { id: 7, title: 'Fundamentals of Impulse and Momentum', description: 'This chapter presents impulse and momentum, principle of impulse and momentum, angular impulse and angular momentum, linear momentum and conservation of linear momentum.' },
];

const tlLegends = [
  { code: 'TL 01', strategy: 'Lecture using board/LCD projectors/OHP Projectors' },
  { code: 'TL 02', strategy: 'Assignment/project/seminar/workshop/tutorial' },
  { code: 'TL 03', strategy: 'Laboratory/Other teaching aids (Audio-visual: film, documentaries, virtual classroom)' },
  { code: 'TL 04', strategy: 'Guest lectures/industrial visit/field visit' },
  { code: 'TL 05', strategy: 'Self-learning using reference books/research article/case study/other online materials' },
  { code: 'TL 06', strategy: 'Simulation/field demonstration/Hands on practice' },
  { code: 'TL 07', strategy: 'Examples and in class problem solving' },
  { code: 'TL 08', strategy: 'Self-study, group discussion' },
];

const assessmentLegends = [
  { code: 'CA 01', strategy: 'Midterm Examination 1' },
  { code: 'CA 02', strategy: 'Midterm Examination 2' },
  { code: 'CA 03', strategy: 'Assignment / Report' },
  { code: 'CA 04', strategy: 'Quiz / Sudden test' },
  { code: 'CA 05', strategy: 'Presentation (Individual/group) / Interim viva voce' },
  { code: 'SA 01', strategy: 'Final Exam (Semester-end examination) / Final Quiz' },
  { code: 'SA 02', strategy: 'Viva (Semester-end oral examination)' },
  { code: 'SA 03', strategy: 'Seminar paper / field / thesis report evaluation' },
];

const schedule = [
  { week: 1, topic: 'Introduction to CEE 0541 1233', contentCode: '---', coCovered: '---', tlStrategy: ['TL 01'], assessmentStrategy: ['---'] },
  { week: 2, topic: 'Fundamentals of friction', contentCode: '1', coCovered: '1', tlStrategy: ['TL 01', 'TL 02'], assessmentStrategy: ['CA 01', 'SA 01'] },
  { week: 3, topic: 'Friction Problem Solving / Applications of Friction', contentCode: '1', coCovered: '1', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['CA 01', 'CA 03', 'SA 01'] },
  { week: 4, topic: 'Wedge Mechanics & Problem Solving / Wedge Problems', contentCode: '1', coCovered: '1', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['CA 01', 'CA 03', 'SA 01'] },
  { week: 5, topic: 'Belt Friction: Concepts & Problems / Analysis and Applications of Belt Friction', contentCode: '1', coCovered: '1', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['CA 01', 'SA 01'] },
  { week: 6, topic: 'Plane Motion: Fundamental Concepts & Problems', contentCode: '2', coCovered: '3', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['SA 01'] },
  { week: 7, topic: 'Mid-Term Examination. Covers all material from Weeks 2 through 5.', contentCode: '---', coCovered: '---', tlStrategy: ['---'], assessmentStrategy: ['---'] },
  { week: 8, topic: 'Erratic Motion & Graphical Method', contentCode: '2', coCovered: '3', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['SA 01'] },
  { week: 9, topic: 'Curvilinear Motion: Concepts & Problems', contentCode: '2', coCovered: '3', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['CA 03', 'SA 01'] },
  { week: 10, topic: 'Relative Motion: Theory & Problems', contentCode: '3', coCovered: '3', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['CA 03', 'SA 01'] },
  { week: 11, topic: 'Parabolic Cords: Analysis & Problems', contentCode: '4', coCovered: '2', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['SA 01'] },
  { week: 12, topic: 'Catenary Cords: Analysis & Problems', contentCode: '4', coCovered: '2', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['SA 01'] },
  { week: 13, topic: 'Problem solving related to cords.', contentCode: '4', coCovered: '2', tlStrategy: ['TL 01', 'TL 02', 'TL 07'], assessmentStrategy: ['SA 01'] },
  { week: 14, topic: 'Review Session', contentCode: '---', coCovered: '---', tlStrategy: ['---'], assessmentStrategy: ['---'] },
];

export const courseOutlineData: SlideSchema[] = [
  {
    id: 1,
    section: 'Overview',
    metadata: { title: 'Cover Page', type: 'Course Metadata' },
    layout: 'twocolumn',
    props: {
      leftWidth: '55%',
      leftElement: { type: 'course-outline-cover', data: { metadata } },
      rightElement: {
        type: 'composite',
        data: {
          elements: [
            {
              type: 'rich-paragraph',
              data: {
                fragments: [
                  'Rationale of the Course:\n\n',
                  rationale,
                ],
              },
            },
          ],
        },
      },
    },
  },
  {
    id: 2,
    section: 'Outcomes & Contents',
    metadata: { title: 'Outcomes & Chapters', type: 'Syllabus Breakdown' },
    layout: 'fullwidth',
    props: {
      title: 'Course Outcomes & Content Structure',
      element: { type: 'course-outline-outcomes', data: { outcomes, contents } },
    },
  },
  {
    id: 3,
    section: 'Schedule Part 1',
    metadata: { title: 'Schedule Weeks 1-7', type: 'Weekly Outline' },
    layout: 'fullwidth',
    props: {
      element: {
        type: 'course-outline-table',
        config: { part: 1 },
        data: { schedule, tlLegends, assessmentLegends },
      },
    },
  },
  {
    id: 4,
    section: 'Schedule Part 2',
    metadata: { title: 'Schedule Weeks 8-14', type: 'Weekly Outline' },
    layout: 'fullwidth',
    props: {
      element: {
        type: 'course-outline-table',
        config: { part: 2 },
        data: { schedule, tlLegends, assessmentLegends },
      },
    },
  },
  {
    id: 5,
    section: 'Legends',
    metadata: { title: 'Teaching & Assessment', type: 'Strategies index' },
    layout: 'fullwidth',
    props: {
      element: {
        type: 'course-outline-legends',
        data: { tlLegends, assessmentLegends },
      },
    },
  },
  {
    id: 6,
    section: 'Wrap Up',
    metadata: { title: 'Conclusion', type: 'Thank You Slide' },
    layout: 'thankyou',
    props: {
      title: 'Thank You',
      subtitle: 'Questions on Course Syllabus & Assessment Scheme?',
    },
  },
];

export const slides: Record<number, React.ComponentType<any>> = courseOutlineData.reduce((acc, curr) => {
  acc[curr.id] = (props) => <SlideSchemaEngine slideNo={curr.id} deck={courseOutlineData} {...props} />;
  return acc;
}, {} as Record<number, React.ComponentType<any>>);

export const slideMetadata = courseOutlineData.reduce((acc, curr) => {
  acc[curr.id] = {
    title: curr.metadata.title,
    type: curr.metadata.type,
    section: curr.section,
  };
  return acc;
}, {} as Record<number, { title: string; type: string; section: string }>);
