import { RouterProvider } from 'react-router';
import { appRouter } from './router/app.router';

export const App = () => {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
};
