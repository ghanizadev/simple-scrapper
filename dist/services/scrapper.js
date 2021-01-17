"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = __importDefault(require("puppeteer"));
var url = "https://demo-shop.natek.eu";
/**
 * For a product in the page, returns its attributes
 * @param {puppeteer.Page} page Page instance
 * @return {Promise} Product variations
 */
var getAttributes = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function () {
                    var table = document.querySelector("table.variations");
                    var rows = table.querySelectorAll("tr");
                    return Array.from(rows).map(function (row) {
                        var _a, _b, _c;
                        var label = (_b = (_a = row
                            .querySelector("label")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase();
                        var value = (_c = row.querySelector("select")) === null || _c === void 0 ? void 0 : _c.value;
                        return {
                            label: label,
                            value: value,
                        };
                    });
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Get all variation identifiers from a product
 * @param {puppeteer.Page} page Page instance
 * @return {Promise} List of IDs
 */
var getSelectIds = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function () {
                    var table = document.querySelector("table.variations");
                    var rows = table.querySelectorAll("tr");
                    return Array.from(rows).map(function (row) {
                        return row.querySelector("label").getAttribute("for");
                    });
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Get all options from a select fiels by its ID
 * @param {string} id Field ID
 * @param {puppeteer.Page} page Page instance
 * @return {Promise} List of options
 */
var getOptions = function (id, page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function (id) {
                    var options = document.querySelectorAll("select#" + id + " option");
                    return Array.from(options)
                        .filter(function (opt) { return !!opt.value; })
                        .map(function (opt) { return opt.value; });
                }, id)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Clear variation inputs
 * @param {puppeteer.Page} page Page instance
 */
var clear = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function () {
                    var button = document.querySelector("a.reset_variations");
                    button && button.click();
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Get all properties from a product by its name. Case it has variations, return all variations too.
 * @param {puppeteer.Browser} browser Puppeteer browser isntance;
 * @param {string} name Product name
 * @return {Promise} Array of products
 */
function getProductInfo(browser, name) {
    return __awaiter(this, void 0, void 0, function () {
        var page, formatedName, vary, properties, selects, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _a.sent();
                    formatedName = name.replace(new RegExp(" ", "gi"), "-").toLowerCase();
                    return [4 /*yield*/, page.goto(url + "/product/" + formatedName, {
                            waitUntil: "networkidle2",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            return !!document.querySelector("table.variations");
                        })];
                case 3:
                    vary = _a.sent();
                    if (!!vary) return [3 /*break*/, 6];
                    return [4 /*yield*/, getProductProperties(page)];
                case 4:
                    properties = _a.sent();
                    return [4 /*yield*/, page.close()];
                case 5:
                    _a.sent();
                    return [2 /*return*/, [__assign({ name: name }, properties)]];
                case 6: return [4 /*yield*/, getSelectIds(page)];
                case 7:
                    selects = _a.sent();
                    return [4 /*yield*/, getAllVariations(selects, page)];
                case 8:
                    result = _a.sent();
                    return [4 /*yield*/, page.close()];
                case 9:
                    _a.sent();
                    return [2 /*return*/, result.map(function (m) { return (__assign({ name: name }, m)); })];
            }
        });
    });
}
/**
 * Get all variations of the product in the page
 * @param {string[]} selects Select IDS
 * @param {puppeteer.Page} page Page instance
 * @return {Array} Array of products
 */
function getAllVariations(selects, page) {
    return __awaiter(this, void 0, void 0, function () {
        var products, s, elements, possibilities, _loop_1, i, getCombination, i, product;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    products = [];
                    return [4 /*yield*/, Promise.all(selects.map(function (sel) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = {
                                            label: sel
                                        };
                                        return [4 /*yield*/, getOptions(sel, page)];
                                    case 1: return [2 /*return*/, (_a.options = _b.sent(),
                                            _a)];
                                }
                            });
                        }); }))];
                case 1:
                    s = _a.sent();
                    elements = s.reduce(function (prev, curr) { return __spreadArrays(prev, curr.options); }, new Array());
                    possibilities = [];
                    _loop_1 = function (i) {
                        var _loop_2 = function (j) {
                            var select = s.find(function (sel) { return sel.options.includes(elements[i]); });
                            if (select.options.includes(elements[j]))
                                return "continue";
                            var result = [elements[i], elements[j]];
                            if (!possibilities.find(function (p) { return p.includes(result[0]) && p.includes(result[1]); }))
                                possibilities.push(result);
                        };
                        for (var j = 0; j < elements.length; j++) {
                            _loop_2(j);
                        }
                    };
                    for (i = 0; i < elements.length; i++) {
                        _loop_1(i);
                    }
                    getCombination = function (combination) { return __awaiter(_this, void 0, void 0, function () {
                        var valueA, valueB, setA, setB, hasValues;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    valueA = combination[0];
                                    valueB = combination[1];
                                    setA = s.find(function (item) { return item.options.includes(valueA); });
                                    setB = s.find(function (item) { return item.options.includes(valueB); });
                                    return [4 /*yield*/, page.evaluate(function (valueA, valueB) {
                                            return (!!document.querySelector("option[value=\"" + valueA + "\"") &&
                                                !!document.querySelector("option[value=\"" + valueB + "\""));
                                        }, valueA, valueB)];
                                case 1:
                                    hasValues = _a.sent();
                                    if (!hasValues)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, page.select("#" + setA.label, valueA)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, page.select("#" + setB.label, valueB)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/, getProductProperties(page)];
                            }
                        });
                    }); };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < possibilities.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getCombination(possibilities[i])];
                case 3:
                    product = _a.sent();
                    products.push(product);
                    return [4 /*yield*/, clear(page)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, products];
            }
        });
    });
}
/**
 * Get product properties
 * @param {puppeteer.Page} page Page instance
 * @return {Promise} Product with properties
 */
function getProductProperties(page) {
    return __awaiter(this, void 0, void 0, function () {
        var properties, _a, imageElements, _b, _c, _d, _e, _f, _g, vary, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    properties = {};
                    _a = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var element = document.querySelector(".sku");
                            if (!element)
                                return "N/A";
                            return element.textContent;
                        })];
                case 1:
                    _a.sku = _k.sent();
                    return [4 /*yield*/, page.$$(".woocommerce-product-gallery__image")];
                case 2:
                    imageElements = _k.sent();
                    if (!(imageElements.length > 1)) return [3 /*break*/, 4];
                    _b = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var element = document.querySelector(".woocommerce-product-gallery__image.flex-active-slide");
                            if (!element)
                                return "N/A";
                            return element.getAttribute("data-thumb");
                        })];
                case 3:
                    _b.image = _k.sent();
                    return [3 /*break*/, 6];
                case 4:
                    _c = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var element = document.querySelector(".woocommerce-product-gallery__image");
                            if (!element)
                                return "N/A";
                            return element.getAttribute("data-thumb");
                        })];
                case 5:
                    _c.image = _k.sent();
                    _k.label = 6;
                case 6:
                    _d = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var element = document.querySelector(".product_meta .posted_in>a");
                            if (!element)
                                return "N/A";
                            return element.textContent;
                        })];
                case 7:
                    _d.category = _k.sent();
                    _e = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var _a;
                            var element = document.querySelector("#tab-description>p");
                            if (!element)
                                return "N/A";
                            return (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                        })];
                case 8:
                    _e.description = _k.sent();
                    _f = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var _a;
                            var element = document.querySelector(".woocommerce-variation-description>p");
                            if (!element)
                                return "N/A";
                            return (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                        })];
                case 9:
                    _f.variantDescription = _k.sent();
                    _g = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var _a, _b;
                            var element = document.querySelector(".summary span.price");
                            if (!element)
                                element = document.querySelector(".summary p.price");
                            if (!element)
                                return "N/A";
                            var ins = element.querySelector("ins");
                            return !!ins ? (_a = ins.textContent) === null || _a === void 0 ? void 0 : _a.trim() : (_b = element.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                        })];
                case 10:
                    _g.price = _k.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            return !!document.querySelector("table.variations");
                        })];
                case 11:
                    vary = _k.sent();
                    if (!vary) return [3 /*break*/, 13];
                    _h = properties;
                    return [4 /*yield*/, getAttributes(page)];
                case 12:
                    _h.attributes = _k.sent();
                    return [3 /*break*/, 14];
                case 13:
                    properties.attributes = "N/A";
                    _k.label = 14;
                case 14:
                    _j = properties;
                    return [4 /*yield*/, page.evaluate(function () {
                            var element = document.querySelector("section.related.products");
                            if (!element)
                                return "N/A";
                            var products = element.querySelectorAll("h2.woocommerce-loop-product__title");
                            return Array.from(products).map(function (p) {
                                return p.textContent.trim();
                            });
                        })];
                case 15:
                    _j.related = _k.sent();
                    return [2 /*return*/, properties];
            }
        });
    });
}
/**
 * Get list of products names
 * @param {puppeteer.Browser} browser Browser instance
 * @return {string[]} Array of product names
 */
function getAllProductNames(browser) {
    return __awaiter(this, void 0, void 0, function () {
        var titles, iterate;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    titles = [];
                    console.info("Gathering product names");
                    iterate = function (number) {
                        if (number === void 0) { number = 1; }
                        return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                            var page, products, pageTitles;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, browser.newPage()];
                                                    case 1:
                                                        page = _a.sent();
                                                        return [4 /*yield*/, page.goto(url + "/page/" + number, { waitUntil: "networkidle2" })];
                                                    case 2:
                                                        _a.sent();
                                                        return [4 /*yield*/, page.title()];
                                                    case 3:
                                                        if ((_a.sent()).startsWith("Page not found")) {
                                                            return [2 /*return*/, res([])];
                                                        }
                                                        return [4 /*yield*/, page.$$(".product")];
                                                    case 4:
                                                        products = _a.sent();
                                                        return [4 /*yield*/, Promise.all(products.map(function (product) { return __awaiter(_this, void 0, void 0, function () {
                                                                var element, title;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4 /*yield*/, product.$("h2")];
                                                                        case 1:
                                                                            element = _a.sent();
                                                                            if (!element)
                                                                                throw new Error("title not found");
                                                                            return [4 /*yield*/, element
                                                                                    .getProperty("textContent")
                                                                                    .then(function (text) { return text.jsonValue(); })];
                                                                        case 2:
                                                                            title = _a.sent();
                                                                            return [2 /*return*/, title];
                                                                    }
                                                                });
                                                            }); }))];
                                                    case 5:
                                                        pageTitles = _a.sent();
                                                        return [2 /*return*/, res(pageTitles)];
                                                }
                                            });
                                        }); })];
                                    case 1:
                                        response = _a.sent();
                                        if (response.length === 0)
                                            return [2 /*return*/];
                                        else {
                                            titles = __spreadArrays(titles, response);
                                            return [2 /*return*/, iterate(number + 1)];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    return [4 /*yield*/, iterate()];
                case 1:
                    _a.sent();
                    console.info("Done");
                    return [2 /*return*/, titles];
            }
        });
    });
}
exports.default = {
    execute: function () {
        return __awaiter(this, void 0, void 0, function () {
            var browser, productNames, result, i, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, puppeteer_1.default.launch({
                            args: ["--no-sandbox", "--disable-setuid-sandbox"],
                        })];
                    case 1:
                        browser = _a.sent();
                        return [4 /*yield*/, getAllProductNames(browser)];
                    case 2:
                        productNames = _a.sent();
                        console.info("Searching by product name");
                        result = [];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < productNames.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, getProductInfo(browser, productNames[i])];
                    case 4:
                        info = _a.sent();
                        result = __spreadArrays(result, info);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        console.info("Done");
                        console.info("Updating related SKUs");
                        result = result.map(function (item, _, arr) {
                            var relatedNames = item.related;
                            if (relatedNames === "N/A")
                                return item;
                            item.related = relatedNames.map(function (related) {
                                var eq = arr.find(function (i) { return i.name === related; });
                                return eq.sku;
                            });
                            return item;
                        });
                        console.info("Done");
                        return [2 /*return*/, result];
                }
            });
        });
    },
};
