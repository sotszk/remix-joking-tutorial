import type { LinksFunction } from "@remix-run/node";
import { LiveReload, Outlet, Links, Scripts } from "@remix-run/react";

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

const useScript = false;

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
        {useScript && <Scripts />}
      </body>
    </html>
  );
}
