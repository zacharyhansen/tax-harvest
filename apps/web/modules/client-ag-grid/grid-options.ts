import type { GridOptions, ThemeDefaultParams } from 'ag-grid-community';
import { themeBalham, themeQuartz } from 'ag-grid-community';
import { dataTypeDefinitions, defaultColumnTypes } from '.';

const styleParams: Partial<ThemeDefaultParams> = {
	backgroundColor: 'var(--background)',
	accentColor: 'var(--foreground)',
	borderColor: 'var(--border)',
	headerBackgroundColor: 'var(--muted)',
	headerTextColor: 'var(--muted-foreground)',
	rowHoverColor: 'var(--muted)/50',
	textColor: 'var(--foreground)',
	borderRadius: 'var(--radius-md)',
	wrapperBorderRadius: 'var(--radius)',
	inputBorderRadius: 'var(--radius-md)',
	buttonBorderRadius: 'var(--radius-md)',
	checkboxBorderRadius: 'var(--radius-md)',
};

const styleForm: Partial<ThemeDefaultParams> = {
	...styleParams,
	borderRadius: undefined,
	wrapperBorderRadius: undefined,
};

const customThemeQuartz = themeQuartz
	.withParams(styleParams, 'light')
	.withParams(styleParams, 'dark')
	.withParams(styleParams, 'system');

const customThemeBalham = themeBalham
	.withParams(styleParams, 'light')
	.withParams(styleParams, 'dark')
	.withParams(styleParams, 'system');

const customThemeForm = themeBalham
	.withParams(styleForm, 'light')
	.withParams(styleForm, 'dark')
	.withParams(styleForm, 'system');

export const baseGridOptions: GridOptions = {
	columnTypes: defaultColumnTypes,
	dataTypeDefinitions,
};

export const defaultGridOptions: GridOptions = {
	...baseGridOptions,
	theme: customThemeQuartz,
};

export const themeBalhamGridOptions: GridOptions = {
	...baseGridOptions,
	theme: customThemeBalham,
};

export const formGridOptions: GridOptions = {
	...baseGridOptions,
	theme: customThemeForm,
};
