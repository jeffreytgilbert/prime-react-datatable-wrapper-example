import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { LoadingData } from "../components/LoadingData";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { z } from "zod";
import { Box, Title } from "@mantine/core";
import Welcome from "../pages/Welcome/Welcome";

const queryClient = new QueryClient();

function NotFoundComponent() {
  const pathName = window.location.pathname;
  return (
    <>
      <Title order={1}>Could not find page: {pathName}</Title>
    </>
  );
}

function ErrorComponent({ error }: { error: Error | unknown }) {
  if(error instanceof Error){
    console.error(error);
    return (
      <Box p="xl">
        <Title order={1}>An error occurred with your request.</Title>
        <p>
          Please report this to support if you continue to encounter this issue along with a screen shot and URL of the page you're viewing.
        </p>
        <Title order={2}>Important stuff for our technicians:</Title>
        <div>
          <p><small>URL: {location.href}</small></p>
          <p><small>{error.message}</small></p>
          <pre style={{
            width: '100%',
            fontSize: '10px',
          }}>
            <small>{error.stack}</small>
          </pre>
        </div>
      </Box>
    );
  }
  else {
    console.error(error);
    return (
      <Box p="xl">
        <Title order={1}>An unknown error occurred.</Title>
        <p>
          Something went wrong. Please report this to support if you continue to encounter this issue along with a screen shot and URL of the page you're viewing.
        </p>
        <p><small>URL: {location.href}</small></p>
      </Box>
    );
  }
}

const RootComponent = () => {
  const favoriteTheme = localStorage.getItem('theme');
  useEffect(() => {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement | null;
    // Hate to see template called on useEffect but based on
    // https://stackoverflow.com/questions/68327342/how-can-one-have-a-theme-switcher-in-primereact
    // This is the only solution for PrimeReact theming fix on load
    // This has to be on rootRoute to work if not it will only work if the route is visited
    if(favoriteTheme) {
      if(themeLink && favoriteTheme !== 'light') {
        themeLink.href = "/themes/lara-dark-teal/theme.css";
      }
    }
  }, [favoriteTheme]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet/>
      </QueryClientProvider>
    </>
  );
};

const rootRoute = createRootRoute({
  component: RootComponent,
});

const zodSfpValidator = z.any().optional();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/`,
  validateSearch: z.object({
    sfp: zodSfpValidator
  }),
  component: () => <Welcome/>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
]);

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <LoadingData/>
  ),
  defaultNotFoundComponent: () => <NotFoundComponent/>,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error}/>,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Routes = () => {
  return <RouterProvider router={router}/>;
};

export default Routes;