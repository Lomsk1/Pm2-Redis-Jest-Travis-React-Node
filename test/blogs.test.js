const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.goto("http://localhost:3000/blogs");

    await page.click("a.btn-floating");
  });

  test("Can see blog create form", async () => {
    const label = await page.getContentsOf("form label");

    expect(label).toEqual("Blog Title");
  });

  describe("and using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title");
      await page.type(".content input", "My Content");
      await page.click("form button");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");
      expect(text).toEqual("Please...");
    });

    test("Submitting then saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card"); // for API. api content class

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf(".card-content");

      expect(title).toEqual("My Title");
      expect(content).toEqual("My Content");
    });
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .re...");

      expect(titleError).toEqual("You must ...");
      expect(contentError).toEqual("You must ...");
    });
  });
});

describe("User is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "...",
      data: {
        title: "..",
        content: "",
      },
    },
  ];

  // test("User cannot create blog posts", async () => {
  //   const result = await page.post("/api/blogs", {
  //     title: "My Title",
  //     content: "My Content",
  //   });
  //   expect(result).toEqual({ error: "You must log in!" });
  // });

  // test("User cannot get a blog list", async () => {
  //   const result = await page.get("/api/blogs");

  //   expect(result).toEqual({ error: "You must log in!" });
  // });

  test("Blog related actions are prohibited", async () => {
    const results = await page.execRequest(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });
});
