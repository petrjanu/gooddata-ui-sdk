// (C) 2024-2025 GoodData Corporation

import React from "react";
import { IntlShape, MessageDescriptor, useIntl } from "react-intl";
import { invariant } from "ts-invariant";
import { Dropdown, DropdownList, DropdownButton } from "../Dropdown/index.js";
import { SingleSelectListItem } from "../List/index.js";
import {
    DEFAULT_DROPDOWN_ALIGN_POINTS,
    DEFAULT_DROPDOWN_WIDTH,
    DEFAULT_DROPDOWN_ZINDEX,
    RECURRENCE_TYPES,
} from "./constants.js";
import { getWeekNumber, getIntlDayName, isLastOccurrenceOfWeekdayInMonth } from "./utils.js";
import { messages } from "./locales.js";
import { RecurrenceType } from "./types.js";

interface IDropdownItem {
    id: RecurrenceType;
    title: string;
}

const getLocalizationKey = (id: RecurrenceType): MessageDescriptor => {
    switch (id) {
        case RECURRENCE_TYPES.HOURLY:
            return messages.recurrence_hourly;
        case RECURRENCE_TYPES.DAILY:
            return messages.recurrence_daily;
        case RECURRENCE_TYPES.WEEKLY:
            return messages.recurrence_weekly;
        case RECURRENCE_TYPES.MONTHLY:
            return messages.recurrence_monthly;
        case RECURRENCE_TYPES.CRON:
            return messages.recurrence_cron;
        case RECURRENCE_TYPES.INHERIT:
            return messages.recurrence_inherit;
        default:
            throw new Error("Invariant: Unexpected localization key.");
    }
};

const getRepeatItems = (
    intl: IntlShape,
    startDate: Date | null,
    allowHourlyRecurrence?: boolean,
    showInheritValue?: boolean,
): IDropdownItem[] => {
    const isLastOccurrenceOfWeekDay = isLastOccurrenceOfWeekdayInMonth(startDate);
    const recurrenceTypes = [
        ...(showInheritValue ? [RECURRENCE_TYPES.INHERIT] : []),
        ...(allowHourlyRecurrence ? [RECURRENCE_TYPES.HOURLY] : []),
        RECURRENCE_TYPES.DAILY,
        RECURRENCE_TYPES.WEEKLY,
        RECURRENCE_TYPES.MONTHLY,
        RECURRENCE_TYPES.CRON,
    ];

    return recurrenceTypes.map((id): IDropdownItem => {
        const localizationKey = getLocalizationKey(id);

        if (id === RECURRENCE_TYPES.MONTHLY && !startDate) {
            return {
                id,
                title: intl.formatMessage(messages.recurrence_monthly_first),
            };
        }
        if (id === RECURRENCE_TYPES.WEEKLY && !startDate) {
            return {
                id,
                title: intl.formatMessage(messages.recurrence_weekly_first),
            };
        }

        if (id === RECURRENCE_TYPES.MONTHLY && isLastOccurrenceOfWeekDay) {
            return {
                id,
                title: intl.formatMessage(messages.recurrence_monthly_last, {
                    day: getIntlDayName(intl, startDate),
                }),
            };
        }

        return {
            id,
            title: intl.formatMessage(localizationKey, {
                day: getIntlDayName(intl, startDate),
                week: getWeekNumber(startDate),
            }),
        };
    });
};

export interface IRepeatTypeSelectProps {
    id: string;
    repeatType: RecurrenceType;
    showInheritValue?: boolean;
    startDate?: Date | null;
    onChange: (repeatType: string) => void;
    allowHourlyRecurrence?: boolean;
    onRepeatDropdownOpen?: () => void;
}

export const RepeatTypeSelect: React.FC<IRepeatTypeSelectProps> = (props) => {
    const {
        id,
        onChange,
        repeatType,
        startDate = null,
        allowHourlyRecurrence,
        showInheritValue,
        onRepeatDropdownOpen,
    } = props;
    const intl = useIntl();
    const repeatItems = getRepeatItems(intl, startDate, allowHourlyRecurrence, showInheritValue);
    const repeatTypeItem = repeatItems.find((item) => item.id === repeatType);

    invariant(repeatTypeItem, "Inconsistent state in RepeatTypeSelect");

    return (
        <Dropdown
            alignPoints={DEFAULT_DROPDOWN_ALIGN_POINTS}
            className="gd-recurrence-form-type s-recurrence-form-type"
            renderButton={({ toggleDropdown, isOpen, dropdownId }) => (
                <DropdownButton
                    id={id}
                    value={repeatTypeItem.title}
                    onClick={() => {
                        !isOpen && onRepeatDropdownOpen?.();
                        toggleDropdown();
                    }}
                    dropdownId={dropdownId}
                    isOpen={isOpen}
                />
            )}
            renderBody={({ closeDropdown, isMobile }) => (
                <DropdownList
                    width={DEFAULT_DROPDOWN_WIDTH}
                    items={repeatItems}
                    isMobile={isMobile}
                    renderItem={({ item }) => (
                        <SingleSelectListItem
                            title={item.title}
                            onClick={() => {
                                onChange(item.id);
                                closeDropdown();
                            }}
                            isSelected={repeatTypeItem.id === item.id}
                        />
                    )}
                />
            )}
            overlayPositionType="sameAsTarget"
            overlayZIndex={DEFAULT_DROPDOWN_ZINDEX}
        />
    );
};
