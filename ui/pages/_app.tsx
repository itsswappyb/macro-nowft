import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";

import "../styles/globals.css";

import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const colors = {
    brand: {
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
};

const theme = extendTheme({ colors });

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMYKEY

const client = createClient(
  getDefaultClient({
    appName: "nowft",
    alchemyId,
  }),
);

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={client}>
                <ConnectKitProvider
                    customTheme={{
                        "--ck-body-background": "#111827",
                        "--ck-body-background-secondary": "#374151",
                        "--ck-font-family": "satoshi"
                    }}
                >
                    <Component {...pageProps} />
                </ConnectKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
}

export default MyApp;
