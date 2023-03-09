import type { LinksFunction, MetaFunction, ActionArgs } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { login, createUserSession, register } from "~/utils/session.server";
import ErrorMessage from "~/components/ErrorMessage";

import styleUrl from "~/styles/login.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleUrl },
];

export const meta: MetaFunction = () => ({
  title: "Remix Jokes | Login",
  description: `ログインしてあなたのお気に入りのジョークを登録しましょう！`,
});

function validateUsername(username: string) {
  if (typeof username !== "string" || username.length < 3) {
    return `Username は3文字以上の文字列にしてください`;
  }
}

function validatePassword(password: string) {
  if (typeof password !== "string" || password.length < 6) {
    return `Password は6文字以上の文字列にしてください`;
  }
}

function validateUrl(url: string) {
  let validUrls = ["/jokes", "/", "https://remix.run"];
  if (validUrls.includes("url")) {
    return url;
  }
  return "/jokes";
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  let redirectTo = form.get("redirectTo") || "/jokes";

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof loginType !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly`,
    });
  }

  redirectTo = validateUrl(redirectTo);

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `ユーザー名とパスワードが正しくありません`,
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({ where: { username } });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        });
      }

      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `ユーザーの作成中に予期せぬエラーが発生しました`,
        });
      }

      return createUserSession(user.id, redirectTo);
    }
    default: {
      console.log("field", fields);

      return badRequest({
        fieldErrors: null,
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />

          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                id="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields.loginType === "login"
                }
              />
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                id="register"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />
              Register
            </label>
          </fieldset>

          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              name="username"
              id="username-input"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <ErrorMessage id="username-error">
                {actionData.fieldErrors.username}
              </ErrorMessage>
            ) : null}
          </div>

          <div>
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              name="password"
              id="password-input"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <ErrorMessage id="password-error">
                {actionData.fieldErrors.password}
              </ErrorMessage>
            ) : null}
          </div>

          <div id="form-error-message">
            {actionData?.formError ? (
              <ErrorMessage>{actionData.formError}</ErrorMessage>
            ) : null}
          </div>

          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>

      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
