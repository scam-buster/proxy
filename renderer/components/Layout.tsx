import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { config, textStyles, styles } from '../styles/theme-config';

const theme = extendTheme({
  config,
  textStyles,
  styles,
});

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'SCAM BUSTER' }: Props) => (
  <main>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <ChakraProvider theme={theme}>
      <Box p={20}>{children}</Box>
    </ChakraProvider>
  </main>
);

export default Layout;
