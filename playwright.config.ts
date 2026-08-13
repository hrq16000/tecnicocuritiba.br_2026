import { createLovableConfig } from "lovable-agent-playwright-config/config";

export default createLovableConfig({
	// JUnit XML alimenta o Codecov Test Analytics no CI (flag `e2e`).
	reporter: process.env.CI
		? [["list"], ["junit", { outputFile: "junit.xml" }]]
		: [["list"]],
	// Tests should be placed in the 'e2e' folder (default)
	// Add your custom playwright configuration overrides here
	// Example:
	// timeout: 60000,
	// use: {
	//   baseURL: 'http://localhost:3000',
	// },
});
