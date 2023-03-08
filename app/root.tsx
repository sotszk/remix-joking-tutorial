import type { ReactNode } from "react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  LiveReload,
  Outlet,
  Links,
  Scripts,
  useCatch,
  Meta,
} from "@remix-run/react";

import globalStyleUrl from "~/styles/global.css";
import globalStyleLargeUrl from "~/styles/global-large.css";
import globalStyleMediumUrl from "~/styles/global-medium.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStyleUrl },
    {
      rel: "stylesheet",
      href: globalStyleMediumUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalStyleLargeUrl,
      media: "screen, (min-width: 1024px)",
    },
  ];
};

export const meta: MetaFunction = () => {
  const description = "Remix と笑いを一緒に学習しましょう！";

  return {
    charset: "utf-8",
    description,
    keywords: "Remix,Jokes",
    "twitter:image": "https://remix-jokes.lol/social.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Remix Jokes",
    "twitter:description": description,
  };
};

const useScript = true;

function Document({
  children,
  title = `Remix: So great, it's funny!`,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
        {useScript && <Scripts />}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Oops!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
