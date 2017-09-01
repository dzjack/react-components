import React from 'react';
import { props, t } from '../utils';
import Select from 'react-select';
import find from 'lodash/find';
import omit from 'lodash/omit';
import sortBy from 'lodash/sortBy';
import findIndex from 'lodash/findIndex';
import last from 'lodash/last';
import dropRight from 'lodash/dropRight';
import FlexView from 'react-flexview';
import cx from '../utils/classnames';
import { warn } from '../utils/log';

const isEmptyArray = x => t.Array.is(x) && x.length === 0;

const defaultOptionGroupRenderer = title => title;

export const defaultMenuRenderer = ({
  focusedOption,
  instancePrefix,
  onFocus,
  onSelect,
  groupByKey,
  optionClassName,
  optionComponent,
  optionRenderer,
  optionGroupRenderer,
  options,
  valueArray,
  valueKey
}) => {
  const OptionComponent = optionComponent;
  const groupedOptions = options.reduce((acc, o, i) => {

    // options are already sorted by group, so we know when a new group starts
    // just by checking the previous option
    const shouldCreateNewGroup = i === 0 || o[groupByKey] !== options[i - 1][groupByKey];

    if (shouldCreateNewGroup) {
      const newGroup = {
        optionGroupTitle: o[groupByKey],
        optionGroup: [o]
      };
      return [...acc, newGroup];
    } else {
      const lastGroup = last(acc);
      return [...dropRight(acc), {
        optionGroupTitle: lastGroup.optionGroupTitle,
        optionGroup: [...lastGroup.optionGroup, o]
      }];
    }
  }, []);

  return groupedOptions.map(({ optionGroup, optionGroupTitle }) => (
    <FlexView column key={optionGroupTitle || ''}>
      {optionGroupRenderer(optionGroupTitle)}
      {optionGroup.map((option, i) => {
        const isSelected = valueArray && valueArray.indexOf(option) > -1;
        const isFocused = option === focusedOption;
        const optionRef = isFocused ? 'focused' : null;
        const optionClass = cx(optionClassName, {
          'Select-option': true,
          'is-selected': isSelected,
          'is-focused': isFocused,
          'is-disabled': option.disabled
        });
        return (
          <OptionComponent
            className={optionClass}
            instancePrefix={instancePrefix}
            isDisabled={option.disabled}
            isFocused={isFocused}
            isSelected={isSelected}
            key={`option-${i}-${option[valueKey]}`}
            onFocus={onFocus}
            onSelect={onSelect}
            option={option}
            optionIndex={i}
            ref={optionRef}
          >
            {optionRenderer(option, i)}
          </OptionComponent>
        );
      })}
    </FlexView>
  ));
};

export const Props = {
  value: t.maybe(t.union([t.Object, t.list(t.Object)])),
  onChange: t.maybe(t.Function),
  onValueClick: t.maybe(t.Function),
  options: t.list(t.Object),
  size: t.maybe(t.enums.of(['medium', 'small'])),
  disabled: t.maybe(t.Boolean),
  searchable: t.maybe(t.Boolean),
  clearable: t.maybe(t.Boolean),
  backspaceRemoves: t.maybe(t.Boolean),
  multi: t.maybe(t.Boolean),
  flat: t.maybe(t.Boolean),
  autoBlur: t.maybe(t.Boolean),
  menuPosition: t.maybe(t.enums.of(['top', 'bottom'])),
  menuRenderer: t.maybe(t.Function),
  groupByKey: t.maybe(t.String),
  optionGroupRenderer: t.maybe(t.Function),
  placeholder: t.maybe(t.union([t.String, t.ReactElement])),
  noResultsText: t.maybe(t.String),
  allowCreate: t.maybe(t.Boolean),
  addLabelText: t.maybe(t.String),
  valueRenderer: t.maybe(t.Function),
  optionRenderer: t.maybe(t.Function),
  delimiter: t.maybe(t.String),
  onInputChange: t.maybe(t.Function),
  onFocus: t.maybe(t.Function),
  onBlur: t.maybe(t.Function),
  onBlurResetsInput: t.maybe(t.Boolean),
  onCloseResetsInput: t.maybe(t.Boolean),
  isLoading: t.maybe(t.Boolean),
  id: t.maybe(t.String),
  className: t.maybe(t.String),
  style: t.maybe(t.Object)
};

/** A dropdown field based on [react-select](https://github.com/JedWatson/react-select)
 * @param value - selected value
 * @param onChange - called when value is changed
 * @param options - available options
 * @param size - medium | small
 * @param disabled - true if disabled
 * @param searchable - true if it should be possible to search the desired value by writing into the dropdown
 * @param clearable - true if it should be possible to reset the selected value
 * @param backspaceRemoves - whether pressing backspace removes the last item when there is no input value
 * @param multi - true if it should be possible to select multiple values
 * @param flat - whether it should have a flat style
 * @param autoBlur - whether it should blur automatically when the user selects a value
 * @param optionRenderer - the function that can be used to override the default renderer of options
 * @param valueRenderer - the function that can be used to override the default renderer of the selected value
 * @param menuRenderer - the function that can be used to override the default drop-down list of options
 * @param groupByKey - the field name to group by
 * @param optionGroupRenderer - the function that gets used to render the content of an option group
 * @param menuPosition - whether the menu should be rendered on top or bottom when it's open
 * @param placeholder - placeholder shown when no value is selected
 * @param noResultsText - if searchable, message shown in the menu when no results are found
 * @param allowCreate - whether it should be possible to create new options
 * @param addLabelText - if allowCreate is true, message shown to hint the user to press Enter to create a new option
 * @param delimiter - if multi is true, string used to separate selected values
 * @param onFocus - called when dropdown is focused
 * @param onBlur - called when dropdown is blurred
 * @param onInputChange - called when the value of the `input` is changed
 * @param onValueClick - called when user clicks on the selected value
 * @param onBlurResetsInput - whether it should clear the input box on blur
 * @param onCloseResetsInput - wheter it should clear the input box on close
 * @param isLoading - whether it is loading options asynchronously
 */
@props(Props, { strict: true })
export default class Dropdown extends React.Component {

  static defaultProps = {
    delimiter: ',',
    size: 'medium',
    disabled: false,
    searchable: false,
    clearable: false,
    multi: false,
    flat: false,
    autoBlur: true,
    groupByKey: 'optionGroup',
    optionGroupRenderer: defaultOptionGroupRenderer,
    menuRenderer: defaultMenuRenderer,
    menuPosition: 'bottom'
  }

  componentDidMount() {
    this.logWarnings();
  }

  logWarnings = () => {
    if (this.props.children) {
      warn('You\'re passing children. Not expected behaviour');
    }
  };

  sortOptionsByGroup = (options) => {
    const { groupByKey } = this.props;
    return sortBy(options, option => option[groupByKey] ? findIndex(options, o => option[groupByKey] === o[groupByKey]) : -1);
  }

  getCustomClassNames() {
    const { size, flat, clearable, menuPosition } = this.props;
    return cx({
      'is-medium': size === 'medium',
      'is-small': size === 'small',
      'is-flat': flat,
      'is-clearable': clearable,
      'menu-position-top': menuPosition === 'top'
    });
  }

  _onChange = _value => {
    const value = isEmptyArray(_value) ? null : _value;
    return this.props.onChange(value);
  }

  onInputKeyDown = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      if (isEmptyArray(this.props.options)) {
        e.preventDefault();
      }
    }
  }

  focus = () => { this.select.focus(); }

  optionGroupRenderer = ( title ) => {
    return title ? (
      <FlexView className='Select-option-group'>
        {this.props.optionGroupRenderer(title)}
      </FlexView>
    ) : null;
  }

  menuRenderer = args => {
    const { optionGroupRenderer, props: { menuRenderer, groupByKey } } = this;
    return menuRenderer({
      ...args,
      groupByKey,
      optionGroupRenderer
    });
  }

  render() {
    const {
      _onChange,
      onInputKeyDown,
      props: { className, options, backspaceRemoves, clearable, ...props }
    } = this;

    const selectProps = {
      ...props,
      options: this.sortOptionsByGroup(options),
      clearable,
      backspaceRemoves: t.Nil.is(backspaceRemoves) ? clearable : backspaceRemoves,
      resetValue: null,
      className: cx('dropdown', className, this.getCustomClassNames()),
      onInputKeyDown,
      onChange: _onChange,
      menuRenderer: this.menuRenderer
    };

    return <Select {...selectProps} ref={select => { this.select = select; }} />;
  }
}
