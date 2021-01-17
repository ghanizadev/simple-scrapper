import puppeteer from "puppeteer";

const url = "https://demo-shop.natek.eu";

/**
 * For a product in the page, returns its attributes
 * @param  page Page instance
 * @return  Product variations
 */
const getAttributes = async (page: puppeteer.Page) =>
  await page.evaluate(() => {
    const table = document.querySelector("table.variations")!;

    const rows = table.querySelectorAll("tr");

    return Array.from(rows).map((row) => {
      const label = row
        .querySelector("label")
        ?.textContent?.toLocaleLowerCase();
      const value = row.querySelector("select")?.value;

      return {
        label,
        value,
      };
    });
  });

/**
 * Get all variation identifiers from a product
 * @param  page Page instance
 * @return  List of IDs
 */
const getSelectIds = async (page: puppeteer.Page) =>
  await page.evaluate(() => {
    const table = document.querySelector("table.variations")!;
    const rows = table.querySelectorAll("tr");

    return Array.from(rows).map((row) => {
      return row.querySelector("label")!.getAttribute("for")!;
    });
  });

/**
 * Get all options from a select fiels by its ID
 * @param  id Field ID
 * @param  page Page instance
 * @return  List of options
 */
const getOptions = async (id: string, page: puppeteer.Page) =>
  await page.evaluate((id) => {
    const options = document.querySelectorAll<HTMLOptionElement>(
      "select#" + id + " option"
    );
    return Array.from(options)
      .filter((opt) => !!opt.value)
      .map((opt) => opt.value);
  }, id);

/**
 * Clear variation inputs
 * @param  page Page instance
 */
const clear = async (page: puppeteer.Page) =>
  await page.evaluate(() => {
    const button = document.querySelector<HTMLLinkElement>(
      "a.reset_variations"
    );
    button && button.click();
  });

/**
 * Get all properties from a product by its name. Case it has variations, return all variations too.
 * @param  browser Puppeteer browser isntance;
 * @param  name Product name
 * @return  Array of products
 */
async function getProductInfo(browser: puppeteer.Browser, name: string) {
  const page = await browser.newPage();
  const formatedName = name.replace(new RegExp(" ", "gi"), "-").toLowerCase();

  await page.goto(`${url}/product/${formatedName}`, {
    waitUntil: "networkidle2",
  });

  const vary = await page.evaluate(() => {
    return !!document.querySelector("table.variations");
  });

  if (!vary) {
    const properties = await getProductProperties(page);
    await page.close();
    return [{ name, ...properties }];
  } else {
    const selects = await getSelectIds(page);

    const result = await getAllVariations(selects, page);
    await page.close();
    return result.map((m) => ({ name, ...m }));
  }
}

/**
 * Get all variations of the product in the page
 * @param  selects Select IDS
 * @param  page Page instance
 * @return  Array of products
 */
async function getAllVariations(selects: string[], page: puppeteer.Page) {
  const products: any[] = [];

  const s = await Promise.all(
    selects.map(async (sel) => {
      return {
        label: sel,
        options: await getOptions(sel, page),
      };
    })
  );
  const elements = s.reduce(
    (prev, curr) => [...prev, ...curr.options],
    new Array<string>()
  );

  let possibilities: string[][] = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < elements.length; j++) {
      const select = s.find((sel) => sel.options.includes(elements[i]))!;
      if (select.options.includes(elements[j])) continue;

      const result = [elements[i], elements[j]];

      if (
        !possibilities.find(
          (p) => p.includes(result[0]) && p.includes(result[1])
        )
      )
        possibilities.push(result);
    }
  }

  const getCombination = async (combination: string[]) => {
    const valueA = combination[0];
    const valueB = combination[1];

    const setA = s.find((item) => item.options.includes(valueA))!;
    const setB = s.find((item) => item.options.includes(valueB))!;

    const hasValues = await page.evaluate(
      (valueA, valueB) => {
        return (
          !!document.querySelector(`option[value="${valueA}"`) &&
          !!document.querySelector(`option[value="${valueB}"`)
        );
      },
      valueA,
      valueB
    );

    if (!hasValues) return;

    await page.select("#" + setA.label, valueA);
    await page.select("#" + setB.label, valueB);

    return getProductProperties(page);
  };

  for (let i = 0; i < possibilities.length; i++) {
    const product = await getCombination(possibilities[i]);
    products.push(product);
    await clear(page);
  }

  return products;
}

/**
 * Get product properties
 * @param  page Page instance
 * @return  Product with properties
 */
async function getProductProperties(page: puppeteer.Page): Promise<any> {
  const properties: any = {};

  properties.sku = await page.evaluate(() => {
    const element = document.querySelector(".sku");
    if (!element) return "N/A";

    return element.textContent;
  });

  const imageElements = await page.$$(".woocommerce-product-gallery__image");

  if (imageElements.length > 1) {
    properties.image = await page.evaluate(() => {
      const element = document.querySelector(
        ".woocommerce-product-gallery__image.flex-active-slide"
      );

      if (!element) return "N/A";

      return element.getAttribute("data-thumb");
    });
  } else {
    properties.image = await page.evaluate(() => {
      const element = document.querySelector(
        ".woocommerce-product-gallery__image"
      );

      if (!element) return "N/A";

      return element.getAttribute("data-thumb");
    });
  }

  properties.category = await page.evaluate(() => {
    const element = document.querySelector(".product_meta .posted_in>a");
    if (!element) return "N/A";

    return element.textContent;
  });

  properties.description = await page.evaluate(() => {
    const element = document.querySelector("#tab-description>p");
    if (!element) return "N/A";

    return element.textContent?.trim();
  });

  properties.variantDescription = await page.evaluate(() => {
    const element = document.querySelector(
      ".woocommerce-variation-description>p"
    );
    if (!element) return "N/A";

    return element.textContent?.trim();
  });

  properties.price = await page.evaluate(() => {
    let element = document.querySelector(".summary span.price");

    if (!element) element = document.querySelector(".summary p.price");

    if (!element) return "N/A";

    const ins = element.querySelector("ins");

    return !!ins ? ins.textContent?.trim() : element.textContent?.trim();
  });

  const vary = await page.evaluate(() => {
    return !!document.querySelector("table.variations");
  });

  if (vary) {
    properties.attributes = await getAttributes(page);
  } else {
    properties.attributes = "N/A";
  }

  properties.related = await page.evaluate(() => {
    let element = document.querySelector("section.related.products");

    if (!element) return "N/A";

    const products = element.querySelectorAll(
      "h2.woocommerce-loop-product__title"
    );

    return Array.from(products).map((p) => {
      return p.textContent.trim();
    });
  });

  return properties;
}

/**
 * Get list of products names
 * @param  browser Browser instance
 * @return  Array of product names
 */
async function getAllProductNames(browser: puppeteer.Browser) {
  let titles: string[] = [];
  console.info("Gathering product names");
  const iterate = async (number = 1): Promise<any> => {
    const response = await new Promise<string[]>(async (res) => {
      const page = await browser.newPage();
      await page.goto(`${url}/page/${number}`, { waitUntil: "networkidle2" });

      if ((await page.title()).startsWith("Page not found")) {
        return res([]);
      }

      const products = await page.$$(".product");

      const pageTitles: string[] = await Promise.all<string>(
        products.map(async (product) => {
          const element = await product.$("h2");
          if (!element) throw new Error("title not found");

          const title = await element
            .getProperty("textContent")
            .then((text) => text.jsonValue());

          return title as string;
        })
      );

      return res(pageTitles);
    });

    if (response.length === 0) return;
    else {
      titles = [...titles, ...response];
      return iterate(number + 1);
    }
  };

  await iterate();
  console.info("Done");
  return titles;
}

export default {
  async execute() {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const productNames = await getAllProductNames(browser);

    console.info("Searching by product name");
    let result: any[] = [];
    for (let i = 0; i < productNames.length; i++) {
      const info = await getProductInfo(browser, productNames[i]);
      result = [...result, ...info];
    }
    console.info("Done");

    console.info("Updating related SKUs");
    result = result.map((item, _, arr) => {
      const relatedNames = item.related;
      if (relatedNames === "N/A") return item;

      item.related = relatedNames.map((related) => {
        const eq = arr.find((i) => i.name === related)!;
        return eq.sku;
      });

      return item;
    });
    console.info("Done");

    return result;
  },
};
