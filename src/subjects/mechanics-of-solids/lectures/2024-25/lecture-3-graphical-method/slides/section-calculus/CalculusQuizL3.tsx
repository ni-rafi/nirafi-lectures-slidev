import React from 'react';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { QuizCardOrchestrator } from '@/features/quiz';

export const CalculusQuizL3: React.FC = () => {
  return (
    <FullWidthLayout title="Calculus Relationships Checkpoint Quiz">
      <div className="w-full max-w-[720px] mx-auto mt-6">
        <QuizCardOrchestrator
          quizId="mos_2024_lec3_q1"
          questionText={
            <span>
              {"If the load on a beam segment is linear (\\(w(x) = c_1 \\cdot x + c_2\\)), what are the mathematical degrees (orders) of the resulting internal Shear Force \\(V(x)\\) and Bending Moment \\(M(x)\\) equations respectively?"}
            </span>
          }
          quizType="multiple-choice"
          options={[
            "Quadratic Shear and Cubic Bending Moment",
            "Linear Shear and Quadratic Bending Moment",
            "Constant Shear and Linear Bending Moment",
            "Quadratic Shear and Quartic Bending Moment"
          ]}
          defaultDuration={60}
          defaultBuffer={10}
        />
      </div>
    </FullWidthLayout>
  );
};

export default CalculusQuizL3;
