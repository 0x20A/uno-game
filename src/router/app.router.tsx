import { createHashRouter } from 'react-router';
import { Home } from '../home/pages/Home';
import { Uno } from '../game/pages/Uno';

export const appRouter = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/uno',
    element: <Uno />,
  },
]);
