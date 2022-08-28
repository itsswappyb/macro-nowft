import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import merge from "lodash.merge";
import {
    ConnectButton,
    getDefaultWallets,
    lightTheme,
    RainbowKitProvider,
    Theme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMYKEY;

const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.localhost],
    [alchemyProvider({ apiKey: alchemyId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "nowft",
    chains,
});

const colors = {
    brand: {
        900: "#1a365d",
        800: "#153e75",
        700: "#2a69ac",
    },
};

const theme = extendTheme({ colors });

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const rainbowKitTheme = merge(lightTheme(), {
    colors: {
        accentColor: "#07296d",
    },
} as Theme);

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider
                    chains={chains}
                    theme={rainbowKitTheme}
                    modalSize="compact"
                    // TODO: change this for testnet / mainnet
                    initialChain={chain.localhost}
                >
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </WagmiConfig>
            //{" "}
        </ChakraProvider>
    );
}

export default MyApp;
