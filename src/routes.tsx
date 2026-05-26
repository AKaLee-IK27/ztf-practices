import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ExamList } from './components/ExamList';
import { ExamRunner } from './components/ExamRunner';
import { ResultsView } from './components/ResultsView';

export const router = createBrowserRouter([
  { path: '/', element: <ExamList /> },
  { path: '/exam/:examId', element: <ExamRunner /> },
  { path: '/exam/:examId/result/:attemptId', element: <ResultsView /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
