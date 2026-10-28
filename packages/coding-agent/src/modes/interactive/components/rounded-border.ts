import type { Component, TuiMouseEvent, TuiMouseEventResult } from "@earendil-works/pi-tui";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

/** Transparent rounded frame for a component that renders terminal lines. */
export class RoundedBorder implements Component {
	private child: Component;
	private color: (text: string) => string;
	private title?: string;
	private childHeight = 0;

	constructor(child: Component, color: (text: string) => string, title?: string) {
		this.child = child;
		this.color = color;
		this.title = title;
	}

	invalidate(): void {
		this.child.invalidate();
	}

	handleInput(data: string): void {
		this.child.handleInput?.(data);
	}

	render(width: number): string[] {
		if (width < 2) return this.child.render(width);

		const innerWidth = width - 2;
		const childLines = this.child.render(innerWidth);
		this.childHeight = childLines.length;
		const horizontalWidth = width - 2;
		const titleText = this.title ? truncateToWidth(this.title, Math.max(0, horizontalWidth - 2), "") : "";
		const title = titleText ? ` ${titleText} ` : "";
		const topFill = Math.max(0, horizontalWidth - visibleWidth(title));
		const lines = [this.color(`╭${title}${"─".repeat(topFill)}╮`)];

		for (const line of childLines) {
			if (line.includes("\x1b_G") || line.includes("\x1b]1337;File=")) {
				lines.push(line);
				continue;
			}
			const content = truncateToWidth(line, innerWidth);
			const padding = Math.max(0, innerWidth - visibleWidth(content));
			lines.push(`${this.color("│")}${content}${" ".repeat(padding)}${this.color("│")}`);
		}

		lines.push(this.color(`╰${"─".repeat(horizontalWidth)}╯`));
		return lines;
	}

	handleMouse(event: TuiMouseEvent): TuiMouseEventResult | undefined {
		if (event.x <= 0 || event.x >= event.width - 1 || event.y <= 0 || event.y > this.childHeight) {
			return undefined;
		}

		return this.child.handleMouse?.({
			...event,
			x: event.x - 1,
			y: event.y - 1,
			width: Math.max(1, event.width - 2),
			height: this.childHeight,
		});
	}
}
