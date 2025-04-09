import { test, expect } from '@playwright/test';

// Example function to generate tests for each endpoint
export function generateTests(openApiSpec, baseURL, baseApiKey, defaultUserId, mockupIngredients, mockupEquipments, mockupPreferences) {
    for (const path in openApiSpec.paths) {
        for (const method in openApiSpec.paths[path]) {
            const endpoint = openApiSpec.paths[path][method];
            const testName = `${method.toUpperCase()} ${path}`;

            test(testName, async ({ request }) => {
                const compiled_path = path.replace(/{([^}]+)}/g, (_, param) => {
                    if (param === 'userId') {
                        return defaultUserId;
                    }
                    return param;
                });
                const url = `${baseURL}${compiled_path}`;
                const headers = endpoint.security ? {} : { 'Content-Type': 'application/json' };
                let request_body: string | null = null;
                if (endpoint.requestBody) {
                    if (compiled_path.includes('ingredients')) {
                        request_body = JSON.stringify(mockupIngredients);
                    } else if (compiled_path.includes('equipments')) {
                        request_body = JSON.stringify(mockupEquipments);
                    } else if (compiled_path.includes('preferences')) {
                        request_body = JSON.stringify(mockupPreferences);
                    }
                }
                console.log(`Request URL: ${url}`);
                console.log(`Request Headers: ${JSON.stringify(headers)}`);
                console.log(`Request Body: ${JSON.stringify(request_body)}`);
                
                const response = await request[method.toLowerCase()](url, { headers, data: request_body });
                console.log(`Response Status: ${response.status()}`);

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