import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import styleUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styleUrl }];
};

export const meta: MetaFunction = () => ({
  title: "Remix はとても偉大でおかしいです",
  description: `Remix Joke app. Remix と笑いを一緒に学習しよう！`,
});

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
