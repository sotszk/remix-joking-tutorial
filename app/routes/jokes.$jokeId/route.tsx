import type { LoaderArgs, ActionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams, useCatch } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { requireUserId, getUserId } from "~/utils/session.server";
import JokeDisplay from "~/components/Joke";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return {
      title: "No Joke",
      description: "No Joke found, no joke.",
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `"${data.joke.name}" joke を楽しんでね！`,
  };
};

export const action = async ({ params, request }: ActionArgs) => {
  const form = await request.formData();

  if (form.get("intent") !== "delete") {
    throw new Response(`${form.get("intent")} はサポートしていません。`, {
      status: 400,
    });
  }

  const userId = await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response(`Joke が存在しないので削除が実行できません`, {
      status: 404,
    });
  }
  if (joke.jokesterId !== userId) {
    throw new Response(
      `あなたはこの Joke の作成者ではないため、削除できません`,
      { status: 403 },
    );
  }
  await db.joke.delete({ where: { id: joke.id } });
  return redirect(`/jokes`);
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
    select: { content: true, name: true, jokesterId: true },
  });
  if (!joke) {
    throw new Response(`What a joke! Not found.`, { status: 404 });
  }
  const userId = await getUserId(request);
  return json({ joke, userId });
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();
  const isOwner = data.joke.jokesterId === data.userId;

  return <JokeDisplay isOwner={isOwner} joke={data.joke} />;
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  switch (caught.status) {
    case 400: {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }
    case 403: {
      return (
        <div className="error-container">
          {params.jokeId} is not your joke...
        </div>
      );
    }
    case 404: {
      return (
        <div className="error-container">
          なんかエラー起きてるぜ？ jokeId: {params.jokeId}
        </div>
      );
    }
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const params = useParams();
  return (
    <div className="error-container">{`jokeId ${params.jokeId} のジョークを読み込む際にエラーが発生しました`}</div>
  );
}
