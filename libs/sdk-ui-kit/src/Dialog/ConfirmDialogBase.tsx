// (C) 2020-2025 GoodData Corporation
import React from "react";
import cx from "classnames";
import { Button } from "../Button/index.js";
import { LoadingSpinner } from "../LoadingSpinner/index.js";
import { DialogBase } from "./DialogBase.js";
import { IConfirmDialogBaseProps, IDialogBaseProps } from "./typings.js";
import { Bubble, BubbleHoverTrigger } from "../Bubble/index.js";
import { Typography } from "../Typography/index.js";
import { useId } from "../utils/useId.js";

/**
 * @internal
 */
export const ConfirmDialogBase = React.memo<IConfirmDialogBaseProps>(function ConfirmDialogBase({
    displayCloseButton = true,
    isSubmitDisabled = false,
    isCancelDisabled,
    isPositive,
    headline,
    cancelButtonText,
    submitButtonText,
    submitButtonTooltipText,
    submitButtonTooltipAlignPoints,
    submitButtonTooltipArrowOffsets,
    warning,
    showProgressIndicator,
    headerLeftButtonRenderer,
    footerLeftRenderer,
    dialogHeaderClassName,
    titleRightIconRenderer,

    ...dialogBaseProps
}) {
    const dialogClasses = cx("gd-confirm", dialogBaseProps.className);

    const submitButtonClasses = cx({
        "s-dialog-submit-button": true,
        "gd-button-action": isPositive,
        "gd-button-negative": !isPositive,
    });

    const headerClassNames = cx("gd-dialog-header", dialogHeaderClassName);

    const titleElementIdWhenNotSet = useId();
    const accessibilityConfig = React.useMemo<IDialogBaseProps["accessibilityConfig"]>(() => {
        return {
            ...(dialogBaseProps.accessibilityConfig ?? {}),
            titleElementId: dialogBaseProps.accessibilityConfig?.titleElementId ?? titleElementIdWhenNotSet,
        };
    }, [dialogBaseProps.accessibilityConfig, titleElementIdWhenNotSet]);

    return (
        <DialogBase
            {...dialogBaseProps}
            className={dialogClasses}
            displayCloseButton={displayCloseButton}
            accessibilityConfig={accessibilityConfig}
        >
            <div className="gd-dialog-header-wrapper">
                {headerLeftButtonRenderer?.()}
                <div className={headerClassNames}>
                    {headline ? (
                        <Typography
                            tagName="h3"
                            className="gd-dialog-header-title"
                            id={accessibilityConfig.titleElementId}
                        >
                            {headline}
                        </Typography>
                    ) : null}
                    {titleRightIconRenderer?.()}
                </div>
            </div>
            {!!warning && <div className="gd-dialog-warning">{warning}</div>}

            <div className="gd-dialog-content">{dialogBaseProps.children}</div>

            <div className="gd-dialog-footer">
                {footerLeftRenderer?.()}
                {showProgressIndicator ? <LoadingSpinner className="gd-dialog-spinner small" /> : null}

                <Button
                    onClick={dialogBaseProps.onCancel}
                    className="gd-button-secondary s-dialog-cancel-button"
                    value={cancelButtonText}
                    disabled={isCancelDisabled}
                />

                {submitButtonText ? (
                    <BubbleHoverTrigger className="gd-button" showDelay={0} hideDelay={0}>
                        <Button
                            onClick={dialogBaseProps.onSubmit}
                            className={submitButtonClasses}
                            value={submitButtonText}
                            disabled={isSubmitDisabled}
                        />
                        {submitButtonTooltipText ? (
                            <Bubble
                                className="bubble-primary"
                                alignPoints={submitButtonTooltipAlignPoints || [{ align: "bc tc" }]}
                                arrowOffsets={submitButtonTooltipArrowOffsets || { "bc tc": [0, 15] }}
                            >
                                {submitButtonTooltipText}
                            </Bubble>
                        ) : null}
                    </BubbleHoverTrigger>
                ) : null}
            </div>
        </DialogBase>
    );
});
