import type { Joke } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

type JokeDisplayProps = {
  canDelete?: boolean;
  isOwner: boolean;
  joke: Pick<Joke, "content" | "name">;
};

export default function JokeDisplay({
  canDelete = true,
  isOwner,
  joke,
}: JokeDisplayProps) {
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
      {isOwner && (
        <Form method="post">
          <button
            type="submit"
            disabled={!canDelete}
            name="intent"
            value="delete"
            className="button"
          >
            Delete
          </button>
        </Form>
      )}
    </div>
  );
}
