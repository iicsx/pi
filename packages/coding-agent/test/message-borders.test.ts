import { beforeAll, describe, expect, it } from "vitest";
import { UserMessageComponent } from "../src/modes/interactive/components/user-message.ts";
import { initTheme } from "../src/modes/interactive/theme/theme.ts";

describe("message borders", () => {
	beforeAll(() => {
		initTheme("dark");
	});

	it("renders user messages in a transparent rounded frame", () => {
		const lines = new UserMessageComponent("Hello, Pi.").render(40);
		const output = lines.join("\n");

		expect(output).toContain("╭");
		expect(output).toContain("╰");
		expect(output).toContain("Hello, Pi.");
		expect(output).not.toMatch(/\x1b\[(?:4[0-7]|10[0-7]|48;)/);
	});
});
