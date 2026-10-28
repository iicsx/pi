import { Text, visibleWidth } from "@earendil-works/pi-tui";
import { describe, expect, it } from "vitest";
import { RoundedBorder } from "../src/modes/interactive/components/rounded-border.ts";

describe("RoundedBorder", () => {
	it("frames content without applying a background", () => {
		const border = new RoundedBorder(new Text("hello", 0, 0), (text) => text);
		const lines = border.render(10);

		expect(lines).toEqual(["╭────────╮", "│hello   │", "╰────────╯"]);
		expect(lines.every((line) => visibleWidth(line) === 10)).toBe(true);
	});

	it("places a title inside the top border", () => {
		const border = new RoundedBorder(new Text("hello", 0, 0), (text) => text, " Tool");
		const lines = border.render(16);

		expect(lines[0]).toBe("╭  Tool ──────╮");
		expect(lines.every((line) => visibleWidth(line) === 16)).toBe(true);
	});
});
