import { LiveReload, Outlet } from "@remix-run/react";

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
