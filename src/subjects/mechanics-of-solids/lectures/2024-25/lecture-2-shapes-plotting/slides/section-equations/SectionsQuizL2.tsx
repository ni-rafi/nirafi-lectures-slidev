import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';
import { LatexFormula } from '@/features/presentation/components/elements';

export const SectionsQuizL2: React.FC = () => {
  return (
    <FullWidthLayout title="Method of Sections Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec2_q2"
          questionText={
            <span>
              In Interval 2 (<LatexFormula math="5 \le x < 12\text{ m}" />), the beam is loaded with a Uniformly Distributed Load (UDL). What is the relationship between the mathematical order (degree) of the Shear Force <LatexFormula math="V(x)" /> and Bending Moment <LatexFormula math="M(x)" /> equations?
            </span>
          }
          quizType="multiple-choice"
          options={[
            "Linear Shear and Quadratic Bending Moment",
            "Constant Shear and Linear Bending Moment",
            "Quadratic Shear and Cubic Bending Moment",
            "Linear Shear and Cubic Bending Moment"
          ]}
          defaultDuration={60}
          defaultBuffer={10}
        />
      </div>
    </FullWidthLayout>
  );
};

export default SectionsQuizL2;
