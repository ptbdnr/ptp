import * as fs from "fs";
import * as path from "path";
import { load } from "js-yaml";
import { test, expect, APIRequestContext } from '@playwright/test';

import { generateTests } from './openapi_parser';

let apiContext: APIRequestContext;
const baseURL = process.env.PTP_BACK_API_BASE_URL;
const baseApiKey = process.env.PTP_BACK_API_KEY;
const filepath_to_openapi = process.env.OPENAPI_FILEPATH || path.join(__dirname, '..', 'data', 'openapi', 'openapi_v1.0.0.yaml');


test('environment variables', async () => {
  console.log(`baseURL: ${baseURL}`);
  console.log(`baseApiKey: ${baseApiKey}`);
  expect(baseURL).toBeDefined();
  expect(baseApiKey).toBeDefined
});

test.describe('PTP', () => {
  // Request context is reused by all tests in the file.
  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
        // All requests we send go to this API endpoint.
        baseURL: `${baseURL}`,
        extraHTTPHeaders: {
        // We set this header per GitHub guidelines.
        'Accept': 'application/vnd.github.v3+json',
        // Add authorization token to all requests.
        // Assuming personal access token available in the environment.
        'apiKey': `${baseApiKey}`,
        },
    });
    });

    test.afterAll(async ({ }) => {
        // Dispose all responses.
        await apiContext.dispose();
    });


    test.describe('auto-generater', () => {
        // Load OpenAPI spec from file
        const openApiSpecPath = filepath_to_openapi;
        const openApiSpec =  load(fs.readFileSync(openApiSpecPath, "utf8"))

        // Example function to generate tests for each endpoint
        generateTests(openApiSpec, baseURL, baseApiKey);
    }
    );
});
