import { test, expect } from '@playwright/test';

// Example function to generate tests for each endpoint
export function generateTests(openApiSpec, baseURL, baseApiKey) {
    for (const path in openApiSpec.paths) {
    for (const method in openApiSpec.paths[path]) {
        const endpoint = openApiSpec.paths[path][method];
        const testName = `${method.toUpperCase()} ${path}`;

        test(testName, async ({ request }) => {
        const url = `${baseURL}${path}`;
        const headers = endpoint.security ? {} : { 'Content-Type': 'application/json' };
        const body = endpoint.requestBody ? {} : null;

        const response = await request[method.toLowerCase()](url, { headers, data: body });

        expect(response.ok()).toBeTruthy();
        });
    }
    }
}

// // == USAGE EXAMPLE ==
// // Load OpenAPI spec from file
// import * as fs from "fs";
// import * as path from "path";
// const openApiSpecPath = path.join(__dirname, 'openapi.json');
// const openApiSpec = JSON.parse(fs.readFileSync(openApiSpecPath, 'utf8'));
// // Invoke the function to generate tests
// generateTests(openApiSpec);