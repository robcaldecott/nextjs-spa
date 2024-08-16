import * as React from "react";
import type { Preview } from "@storybook/react";
import { Inter } from "next/font/google";
import "../src/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

function HtmlFont(props: { children: React.ReactNode }) {
  // We need the Inter font variable on the HTML body
  // so portalled components work
  React.useLayoutEffect(() => {
    document.documentElement.classList.add(inter.variable);
    return () => {
      document.documentElement.classList.remove(inter.variable);
    };
  }, []);

  return (
    <div className={`text-foreground ${inter.variable} font-sans`}>
      {props.children}
    </div>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <HtmlFont>
        <Story />
      </HtmlFont>
    ),
  ],
};

export default preview;
