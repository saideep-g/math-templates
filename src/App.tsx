import React from 'react';
import { QuizRunner } from './components/QuizRunner';
import { MOCK_ITEMS } from './mock/items';

/**
 * App Component
 * * This is the root entry point of the math learning application.
 * It initializes the high-level layout and injects the question data 
 * into the QuizRunner.
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 antialiased selection:bg-indigo-100">
      {/* The QuizRunner is the primary engine of the app. 
        It manages navigation, scoring logic, and the transition 
        between main items and transfer tasks.
      */}
      {MOCK_ITEMS.length > 0 ? (
        <QuizRunner items={MOCK_ITEMS} />
      ) : (
        <div className="flex h-screen items-center justify-center">
          <p className="text-slate-400 font-medium">No items found in mock data.</p>
        </div>
      )}
    </div>
  );
};

export default App;