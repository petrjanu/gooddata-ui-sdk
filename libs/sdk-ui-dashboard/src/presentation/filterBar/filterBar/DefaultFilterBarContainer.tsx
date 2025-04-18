// (C) 2021-2025 GoodData Corporation
import React, { useCallback, useRef } from "react";
import DefaultMeasure from "react-measure";
import cx from "classnames";
import { defaultImport } from "default-import";
import { Message, UiButton } from "@gooddata/sdk-ui-kit";

import { IntlWrapper } from "../../localization/index.js";
import {
    selectLocale,
    useDashboardSelector,
    useDashboardDispatch,
    selectEnableFilterViews,
    selectEnableFlexibleLayout,
    applyFilterContextWorkingSelection,
    selectIsWorkingFilterContextChanged,
    selectDashboardFiltersApplyMode,
    selectEnableDashboardFiltersApplyModes,
} from "../../../model/index.js";

import { ShowAllFiltersButton } from "./ShowAllFiltersButton.js";
import { useRowsCalculator, CalculatedRows } from "./hooks/useRowsCalculator.js";
import { useFilterBarState } from "./hooks/useFilterBarState.js";
import { useFilterExpansionByDragAndDrop } from "./hooks/useFilterExpansionByDragAndDrop.js";
import { FilterViews } from "./filterViews/FilterViews.js";
import { BulletsBar as FlexibleBulletsBar } from "../../flexibleLayout/dragAndDrop/Resize/BulletsBar/BulletsBar.js";
import { BulletsBar as FluidBulletsBar } from "../../layout/dragAndDrop/Resize/BulletsBar/BulletsBar.js";
import { FormattedMessage, useIntl } from "react-intl";
import { useExecutionTimestampMessage } from "./useExecutionTimestampMessage.js";

// There are known compatibility issues between CommonJS (CJS) and ECMAScript modules (ESM).
// In ESM, default exports of CJS modules are wrapped in default properties instead of being exposed directly.
// https://github.com/microsoft/TypeScript/issues/52086#issuecomment-1385978414
const Measure = defaultImport(DefaultMeasure);

const DefaultFilterBarContainerCore: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { rows, height, isFilterBarExpanded, scrollable, setFilterBarExpanded, setCalculatedRows } =
        useFilterBarState();

    const dropRef = useFilterExpansionByDragAndDrop(
        rows.length > 1,
        isFilterBarExpanded,
        setFilterBarExpanded,
    );

    const isFilterViewsFeatureFlagEnabled = useDashboardSelector(selectEnableFilterViews);
    const isFlexibleLayoutEnabled = useDashboardSelector(selectEnableFlexibleLayout);
    const isWorkingFilterContextChanged = useDashboardSelector(selectIsWorkingFilterContextChanged);
    const filtersApplyMode = useDashboardSelector(selectDashboardFiltersApplyMode);
    const enableDashboardFiltersApplyModes = useDashboardSelector(selectEnableDashboardFiltersApplyModes);
    const { showExecutionTimestampMessage, formattedDate, onShowCurrentTimestampDashboard } =
        useExecutionTimestampMessage();
    const dispatch = useDashboardDispatch();

    const applyAllDashboardFilters = useCallback(() => {
        dispatch(applyFilterContextWorkingSelection());
    }, [dispatch]);

    const intl = useIntl();

    return (
        <>
            <div className="dash-filters-wrapper s-gd-dashboard-filter-bar" ref={dropRef}>
                <div
                    style={{ height }}
                    className={cx("dash-filters-visible", {
                        scrollable: scrollable,
                        "s-dash-filters-visible-all": isFilterBarExpanded,
                        "apply-all-at-once":
                            filtersApplyMode.mode === "ALL_AT_ONCE" && enableDashboardFiltersApplyModes,
                    })}
                >
                    <AllFiltersContainer setCalculatedRows={setCalculatedRows}>
                        {children}
                    </AllFiltersContainer>
                    <FiltersRows rows={rows} />
                    <div
                        className="filter-bar-configuration"
                        style={{ alignItems: enableDashboardFiltersApplyModes ? "baseline" : undefined }}
                    >
                        {filtersApplyMode.mode === "ALL_AT_ONCE" &&
                        enableDashboardFiltersApplyModes &&
                        isWorkingFilterContextChanged ? (
                            <UiButton
                                label={intl.formatMessage({ id: "apply" })}
                                variant="primary"
                                onClick={applyAllDashboardFilters}
                            />
                        ) : null}
                        {isFilterViewsFeatureFlagEnabled ? <FilterViews /> : null}
                    </div>
                </div>
                <ShowAllFiltersButton
                    isFilterBarExpanded={isFilterBarExpanded}
                    isVisible={rows.length > 1}
                    onToggle={(isExpanded) => setFilterBarExpanded(isExpanded)}
                />
                {isFlexibleLayoutEnabled ? <FlexibleBulletsBar /> : <FluidBulletsBar />}
            </div>
            {isWorkingFilterContextChanged &&
            filtersApplyMode.mode === "ALL_AT_ONCE" &&
            enableDashboardFiltersApplyModes ? (
                <div className="filters-message" style={{ marginTop: rows.length > 1 ? "35px" : "10px" }}>
                    <Message type="progress">
                        <FormattedMessage
                            id="filterBar.unappliedFiltersNotification"
                            values={{
                                link: (chunks) => (
                                    <strong>
                                        <a onClick={applyAllDashboardFilters}>{chunks}</a>
                                    </strong>
                                ),
                            }}
                        />
                    </Message>
                </div>
            ) : null}
            {showExecutionTimestampMessage ? (
                <div className="filters-message" style={{ marginTop: rows.length > 1 ? "35px" : "10px" }}>
                    <Message type="progress">
                        <FormattedMessage
                            id="filterBar.executionTimestampNotificationMessage"
                            values={{
                                bold: (chunks) => <strong>{chunks}</strong>,
                                date: formattedDate,
                            }}
                        />
                        <span className="filters-message-spacer" />
                        <FormattedMessage
                            id="filterBar.executionTimestampNotificationAction"
                            values={{
                                link: (chunks) => <a onClick={onShowCurrentTimestampDashboard}>{chunks}</a>,
                            }}
                        />
                    </Message>
                </div>
            ) : null}
        </>
    );
};

const AllFiltersContainer: React.FC<{
    setCalculatedRows: (data: CalculatedRows) => void;
    children?: React.ReactNode;
}> = ({ setCalculatedRows, children }) => {
    const ref = useRef<Element | null>(null);
    const rowCalculator = useRowsCalculator(ref);

    return (
        <Measure
            bounds
            innerRef={(rf) => (ref.current = rf)}
            onResize={(dimensions) => setCalculatedRows(rowCalculator(dimensions))}
        >
            {({ measureRef }) => (
                <div className="dash-filters-all" ref={measureRef}>
                    {children}
                </div>
            )}
        </Measure>
    );
};

const FiltersRows: React.FC<{ rows: number[] }> = ({ rows }) => {
    return (
        <>
            {rows.length > 1 && (
                <div className="dash-filters-rows">
                    {rows.map((height, index) => (
                        <div className="dash-filters-row" style={{ height }} key={index} />
                    ))}
                </div>
            )}
        </>
    );
};

/**
 * @internal
 */
export const DefaultFilterBarContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const locale = useDashboardSelector(selectLocale);

    return (
        <IntlWrapper locale={locale}>
            <DefaultFilterBarContainerCore>{children}</DefaultFilterBarContainerCore>
        </IntlWrapper>
    );
};
