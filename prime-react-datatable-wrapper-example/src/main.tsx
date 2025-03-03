import "primeicons/primeicons.css";
import '@mantine/core/styles.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, DEFAULT_THEME, Loader, MantineColorScheme, MantineProvider, mergeMantineTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssLoader } from './components/CssLoader.tsx';
import { SearchThumbnailSizeProvider } from './context/SearchThumbnailSize/SearchThumbnailSizeProvider.tsx';

import { PrimeReactProvider } from 'primereact/api';

import Routes from './routes/Routes.tsx';

const themeOverride = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "green",
});
const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
theme.components.Loader = Loader.extend({
  defaultProps: {
    loaders: { ...Loader.defaultLoaders, custom: CssLoader },
    type: 'custom',
  },
});

const queryClient = new QueryClient();
const defaultColorScheme: MantineColorScheme = localStorage.getItem('theme') as MantineColorScheme || 'light';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SearchThumbnailSizeProvider>
        <MantineProvider
          theme={theme}
          defaultColorScheme={defaultColorScheme}>
          <PrimeReactProvider value={{ unstyled: false }}>
            <Routes />
          </PrimeReactProvider>
        </MantineProvider>
      </SearchThumbnailSizeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
