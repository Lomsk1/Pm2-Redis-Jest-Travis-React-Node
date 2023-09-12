const Page = require("./helpers/page");

// test("Adds two number", () => {
//   const sum = 1 + 2;
//   expect(sum).toEqual(3);
// });

let page;

beforeEach(async () => {
  page = await new Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  /* Automatic close browser */
  await page.close();
});

/* Create new browser */
test("The header has the correct text", async () => {
//   const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  const text = await page.getContentsOf('a.brand-logo')

  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

/* For Google Auth */
test.only("If we are log in, show Logout button", async () => {
  await page.login();

  const text = await page.$eval("a[href='/auth/logout']", (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
