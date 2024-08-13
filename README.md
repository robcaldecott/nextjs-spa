# Classic SPA built using NextJS

This is a statically built SPA that can be deployed without a Node app server thanks to the following setting in `next.config.mjs`:

```js
output: "export";
```

Highlights:

- Uses the app router
- Data fetching using `@tanstack/query`
- UI components built using `shadcn/ui`
- API mocking in dev mode using `msw`
- Full set of Playwright tests

Note that this app is not fully complete and the UX still has plenty of room for improvement.

## Getting started

Run the app in dev mode with a mocked API:

```bash
npm run dev
```

Then point your browser at http://localhost:3000 to see the app in action.

## Notes on the developer experience

There are various issues you should be aware of if you want to create a classic SPA using NextJS.

The most important is that practically everything needs to be a client component so you should ensure that layouts and pages include a `use client` directive at the top of the file. If you forget then you may be faced with import errors that won't be immediately obvious.

### Pros

- There is an enormous amount of traction behind NextJS and many would consider it a safe bet.
- You could migrate to the full SSR/RSC experience at a later date with relative ease. Pages could be switched to `use server` one at a time and server-side data fetching added. Support to hydrate API data back to the client using `@tanstack/query` is also possible.
- The app router makes using custom layouts for different parts of your app a breeze and you get code-splitting for free.
- Static pages can be pre-rendered during the build for better initial performance.
- The out-of-the-box developer experience is good, with sensible `eslint` and `typescript` configurations.

### Cons

Getting up and running was not a smooth experience, and I suspect this is because NextJS really wants you to be using the full node server experience.

So, in no particular order.

#### msw

Getting `msw` working was painful. You do not have any real control over the application entry point so you cannot wait for `msw` to finish initialising before rendering your app.

The quick and dirty way would be to load and initialise `msw` at the top-level of your root `layout.tsx` component something like this:

```ts
if (process.env.NEXT_PUBLIC_MSW === "true") {
  import("@/mocks/browser").then((module) => {
    module.enableMocking();
  });
}
```

The problem here is that your app could end up loaded and making its first API call before `msw` has installed, causing the API call to fail. Instead you want to delay your app from rendering until `msw` is ready.

To achieve this I put together a wrapper component that blocks rendering until `msw` has been loaded but it's a bit messy. If you're only using `msw` in dev mode then you need to be careful to conditionally `import` it to ensure it does not end up in your production bundle.

There is also a secondary issue where imports from `msw/browser` do not work correctly which involves using `require` instead.

#### metadata for the document title

To set your document title in NextJS you should be using the special `metadata` export (from layout or page components). However, this only works for server components which means the root `layout.tsx` needed the client only provider code split out into a separate component in order to compile.

The old `page` router allowed you to render a special `<Head />` component but this is no longer supported.

There are alternatives, such as `useEffect` hooks to set the title, but I wanted to stick to doing things as described by the official docs. So `app/layout.tsx` is a server component that imports `app/providers.tsx` which is a client component.

There is a discussion on this limitation here:

https://github.com/vercel/next.js/discussions/50872

#### `useSearchParams` build errors

A number of the pages in the app consume the `useSearchParams` hook which works fine in dev mode, but caused errors when attempting to build the production app.

To fix these errors the pages had to be wrapped in `<React.Suspense>`:

```tsx
function DetailsPage() {
    const params = useSearchParams();
    ...
}

export default function Page() {
    return (
        <React.Suspense>
            <DetailsPage />
        </React.Suspense>
    );
}
```

https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout

**NOTE:** this issue was also solved using this hack: https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only

#### `localStorage` missing during build

I am using the `shadcn/ui` `<ThemeProvider />` component which loads your preferred theme setting from `localStorage`. Unfortunately `localStorage` is not available when prerendering your pages during a production build, which caused some errors. You can fix this using the client-only hack above or by checking that the `window` object is actually availble.

Before:

```tsx
const [theme, setTheme] = React.useState<Theme>(
  () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
);
```

After:

```tsx
const [theme, setTheme] = React.useState<Theme>(() => {
  if (typeof window === "undefined") {
    return defaultTheme;
  }
  return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
});
```

#### Hydration errors in Playwright tests

When running Playwright I noticed a red error box on all pages shortly after the tests navigated to the correct page. This error did not stop the tests from working but was unusual as it did not appear when running the app in dev mode outside of Playwright.

It turns out the issue was hydration mismatch caused by code that checked if the user was logged in. This took some tracking down but the following code was at fault:

```tsx
const [token] = React.useState(Cookies.get("token"));

return token ? props.children : null;
```

When the Playwright tests were running the code above was being executed in the NextJS `node` dev server, as well as in the browser. In a node env the call to `Cookies.get` was returning `null` which led to the hydration issue.

I understand what NextJS is doing here but it was odd to only see this in dev mode when Playwright was running.

Once again this issue can be fixed using the client-only hack: https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only

#### Production mode hydration errors

Once the app is built with `npm run build` and running, there were hydration errors showing in the console (the minified version: https://react.dev/errors/418) when attempting to load the home page without a valid session cookie.

Yet again this can be fixed using the client-only hack (I sense a theme here) but odd that the issue only occurred in production and not dev mode.

#### Checking if the user is logged in

Your app will probably need to know if the user is logged in, and you will probably need to check this when every page is rendered. This example app uses a contrived example of a session token stored as a cookie (this is not production ready, ha). If the cookie is missing then the app should redirect the user back to the login page.

To make this work I have used a template component inside the `(private)` route group. This component reads the cookie and, if it is missing, redirects the user via a `useRouter` and a `useEffect` hook.

While this is fine, it would be better if there was a more obvious way to intercept route changes in order to do this without hooks. I have learned the hard way that condtionally rendering in layouts can cause hydration issues. In React Router 6 all of this logic can live in the router itself which I personally think is a better pattern.

#### No support for dynamic routes

When using `output: export` you will not be able to use dynamic routing. In this example app, the vehicles details page was modified to use a search param instead of a dynamic route accordingly.

Ideally the structure would be something like this:

```
app/
  (private)/
    vehicles/
      page.tsx
      [id]/
        page.tsx
```

And a vehicle details page URL would look like this:

```
http://localhost:3000/vehicles/xyx
```

Where _xyz_ is the vehicle UUID.

However, `[id]` represents a dynamic route which is not supported for a static SPA build like this.

Instead I settled on:

```
app/
  (private)/
    vehicles/
      page.tsx
      details/
        page.tsx
```

And `details/page.tsx` reads the vehicle ID from an `?id=xyz` search param.

## Conclusion

If you're trying to move away from `create-react-app` but you aren't ready for the full SSR/RSC experience then NextJS is a great choice. **But you need to be aware that the build process involves prerendering your pages from node where `window` is not available.**

Remember that `use client` is your friend, and if your pages live behind authentication, or you expect to do much in the way of conditional rendering of entire pages, then you should use the client-only solution as recommended in the NextJS docs:

https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only

```tsx
function ClientOnly(props: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return props.children;
}
```

You will lose the benefit of static route pre-rendering during the build (your pages will be `null`), so you might need to be selective about the code you wrap with this... but it will potentially save you a lot of wasted time and pulled hair figuring out obscure errors and hydration warnings.
