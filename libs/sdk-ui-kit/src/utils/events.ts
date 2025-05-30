// (C) 2025 GoodData Corporation
import { KeyboardEvent } from "react";

/**
 * Checks if the given keyboard event is an action key = Enter or Space.
 *
 * @param event - The keyboard event to check.
 * @returns `true` if the event is an action key, `false` otherwise.
 *
 * @internal
 */
export const isActionKey = (event: KeyboardEvent): boolean => {
    return event.key === "Enter" || event.key === " ";
};

/**
 * Checks if the given keyboard event is triggered by a Space key.
 *
 * @param event - The keyboard event to check.
 * @returns `true` if the event has been triggered by a Space key, `false` otherwise.
 *
 * @internal
 */
export const isSpaceKey = (event: KeyboardEvent): boolean => {
    return event.key === " ";
};
