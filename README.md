# Product Master Checker

Checks a category manager's returned workbook against the **Product Master Template**
before anything goes near D365.

Everything happens in the page. No upload, no server, no internet — the Excel
library is a file in this repo, and a workbook never leaves the machine it is
opened on.

## Running it

```
node serve.mjs
```

then open <http://localhost:5400/>. Choose the returned workbook; the template is
picked up automatically from beside the page.

A plain `file://` open will not work — the browser blocks a local page from
reading the template next to it. That is the only reason the tiny server exists.

## What it reports

**Template conformance** — sheet by sheet, what the returned workbook changed:
columns dropped, columns added, a column name used twice, columns reordered, a
header that is not on row 1.

Two things are deliberately left out of this comparison:

- **Price & Discount Agreements** — not checked at all.
- **Item Attributes columns** — the category team writes its own attribute
  headers per category, and the template only ever showed one example. Comparing
  them produced 35 meaningless "missing" lines.

The **New** column is ignored everywhere, and **Category** is accepted wherever
the template says **Category/Last Level**.

**Category Hierarchy** — how many categories are to be ecom enabled. Counted as
rows with something in them: one real file had 672 rows in the sheet and 2 of
them were real.

**Attribute Types** — how many attribute types there are to set up. A duplicate
is the same *name + filterable + key feature + technical spec*; which category it
sits under plays no part, so the same attribute repeated for ten sub-categories
counts once. It also flags:

- types marked as **both** key feature and technical spec, or **neither**
- the same type **set up differently** in different categories, with the variants
  grouped together

**Attribute Values** — the total requiring translation.

**Item Attributes** — read as a run of blocks, one per product type, each with
its own header row and its own attribute columns. Reading it as one table takes
the first block's header and applies it to everything, which is wrong for every
block after the first.

- *Step 1* — every item code against its product type and category.
- *Step 2* — each block with its attribute headers as tags. Click a tag and use
  the left and right arrow keys to step through them. A faded tag is a column
  that exists in the block but is empty for every item in it.

**Items** — which of the columns you mark mandatory are blank, how often, and in
which rows. The item codes can be copied to the clipboard, one per line, to paste
straight into an Excel filter. Your choice of mandatory columns is remembered in
the browser.

## Changing the template

Replace `Product Master Template.xlsx` in this folder. The page loads it on its
own; the settings strip at the top is only there for the day it changes, and a
file chosen there lasts until the page is reloaded.

## A trap worth knowing

The template carries **two** columns that are the same name once punctuation is
stripped:

```
Extended warranty Applicable Y/N      (col 68)
Extended warranty applicable (Y/N)    (col 80)
```

A workbook with one of them makes the other genuinely missing, while the reader
is looking straight at a column with that name. The checker now says so
explicitly rather than leaving you to work it out. Worth deciding whether the
template should really carry both.

## Files

```
validator.html            the whole tool
lib/xlsx.full.min.js      SheetJS, vendored so it works with no internet
serve.mjs                 a ~20 line static server, only so the page can read the template
Product Master Template.xlsx
```
