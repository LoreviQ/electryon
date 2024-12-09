import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const numberOfDice = parseInt(formData.get("numberOfDice") as string);

    const diceValues = Array(numberOfDice)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1);

    return json({ diceValues });
};
