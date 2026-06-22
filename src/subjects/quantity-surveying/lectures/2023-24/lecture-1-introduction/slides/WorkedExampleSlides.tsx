import React from 'react';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { InteractiveCard, SlideBullet } from '@/features/presentation/components/elements';
import { FootingDrawingCanvas } from '@/subjects/quantity-surveying/features';

// Slide 9: Introductory Footing Concept (Lecture 1)
export const Slide9: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Anatomy of a Typical Foundation Footing"
      bgVariant="default"
      leftWidth="52%"
      leftContent={
        <div className="flex flex-col gap-4">
          <InteractiveCard title="Conceptual Foundation Substructure" variant="default" className="w-full">
            <p className="text-xs text-muted-foreground mb-3 leading-normal">
              Foundations structurally transfer building loads safely down to the load-bearing sub-soil bed. A typical isolated footing consists of layered components.
            </p>
            <ul className="flex flex-col gap-2.5">
              <SlideBullet title="Sand Cushion:">
                <span>
                  Provides subgrade improvement and acts as a dynamic cushion against expansive soils.
                </span>
              </SlideBullet>
              <SlideBullet title="Brick Flat Soling (BFS):">
                <span>
                  A flat brick layer acting as a base buffer directly over the sand cushion.
                </span>
              </SlideBullet>
              <SlideBullet title="Lean Concrete Cushion:">
                <span>
                  A thin concrete leveling bed (often 1:3:6) cast to provide a clean structural platform.
                </span>
              </SlideBullet>
              <SlideBullet title="RCC Footing Base & Column:">
                <span>
                  The load-carrying reinforced concrete foundation base and connecting column stub.
                </span>
              </SlideBullet>
            </ul>
          </InteractiveCard>
        </div>
      }
      rightContent={
        <div className="flex flex-col justify-center h-full">
          <FootingDrawingCanvas
            width={1.50}
            length={1.50}
            depth={1.80}
            ccThickness={0.075}
            sandThickness={0.075}
            activeHighlight="none"
          />
        </div>
      }
    />
  );
};
