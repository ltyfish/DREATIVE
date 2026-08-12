import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Ajv2020 } from "ajv/dist/2020.js";

const showcaseSchema = (): ReturnType<Ajv2020["compile"]> =>
  new Ajv2020({ strict: true }).compile(JSON.parse(fs.readFileSync(path.resolve("skill", "dreative", "schemas", "showcase-mechanism.schema.json"), "utf8")));

const contract = {
  version: 3,
  experienceType: "interface",
  signature: {
    name: "Configuration instrument",
    selector: "#peak",
    productSubjectSelector: ".configured-unit",
    productSubject: "the configured unit",
    whyOnlyThisProduct: "It is driven by this product's own configuration range.",
  },
  referenceMode: "supplied",
  referenceAdoptions: [
    {
      source: "Industrial control reference",
      sourceRef: "https://example.com/reference",
      rights: "reference use only",
      principle: "Direct cause and effect",
      decision: "use",
      targetSelector: "#peak",
    },
  ],
  assetCommitments: [
    { role: "Hero subject", decision: "use", targetSelector: "#hero", medium: "image", sourceKind: "local-file", sourceRef: "media/hero.webp", rights: "supplied by user", mobileFallback: "static close crop" },
  ],
  continuity: {
    mode: "shared-state",
    stateKey: "choice",
    sourceSelector: "#choice",
    sourceTrigger: "click",
    stateCount: 3,
    affectedRegions: [
      { selector: "#control", stage: "before", effect: "Sets the choice." },
      { selector: "#peak", stage: "peak", effect: "Changes the product." },
      { selector: "#decision", stage: "after", effect: "Changes the recommendation." },
    ],
  },
  comparison: {
    selector: "#products",
    itemSelector: "[data-product]",
    identityAttribute: "data-product",
    identityChannels: [{ channel: "product media", selector: "img", uniqueProperty: "src" }],
  },
  mechanisms: [
    {
      name: "Product instrument",
      stage: "peak",
      selector: "#peak",
      primarySelector: "img",
      primarySubject: "The product",
      trigger: "click",
      mediaMode: "image",
      mobileTransformation: "Compact direct control",
      visibleChange: "The product image changes",
      animationOwner: "native-js",
      ownedProperties: ["src"],
      stateCount: 3,
    },
  ],
};

test("Draft 2020-12 validates a complete Showcase contract", () => {
  const validate = showcaseSchema();
  assert.equal(validate(contract), true, JSON.stringify(validate.errors, null, 2));
});

test("the comparison region is optional and an authored sequence needs no shared state", () => {
  const validate = showcaseSchema();
  const authored: Record<string, unknown> = structuredClone(contract);
  delete authored.comparison;
  authored.continuity = {
    mode: "authored-sequence",
    motif: "The travelling roasting drum",
    affectedRegions: contract.continuity.affectedRegions,
  };
  assert.equal(validate(authored), true, JSON.stringify(validate.errors, null, 2));
});

test("the contract has no field for builder-authored process evidence", () => {
  const schema = JSON.parse(fs.readFileSync(path.resolve("skill", "dreative", "schemas", "showcase-mechanism.schema.json"), "utf8"));
  for (const removed of ["classification", "prototypeEvidence", "prototypeFidelity", "productionFeasibility", "comparisonLayouts", "comparisonPolicy", "agencyChain", "showcaseDelta", "mediaOpportunities"])
    assert.equal(removed in schema.properties, false, `${removed} should not be reintroduced`);
  const validate = showcaseSchema();
  assert.equal(validate({ ...contract, prototypeEvidence: { selectedBy: "user" } }), false);
});

test("Draft 2020-12 strictly compiles the Experience Map schema", () => {
  const schema = JSON.parse(fs.readFileSync(path.resolve("skill", "dreative", "schemas", "experience-map.schema.json"), "utf8"));
  assert.doesNotThrow(() => new Ajv2020({ strict: true }).compile(schema));
});
