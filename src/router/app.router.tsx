import { createBrowserRouter } from 'react-router';
import { Home } from '../home/pages/Home';
import { Uno } from '../game/pages/Uno';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/uno',
    element: <Uno />,
  },
]);
