import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Select, ErrorZone } from 'react-components';
import { noop } from 'proton-shared/lib/helpers/function';

import EditConditionValue from './editor/EditConditionValue';
import AddConditionValue from './editor/AddConditionValue';

function FilterConditionValues({
    condition,
    options,
    onDelete = noop,
    onChangeCondition = noop,
    onAdd = noop,
    onEdit = noop,
    error = {}
}) {
    const hasError = (key) => (error.errors || []).includes(key);
    return (
        <>
            <Select
                options={options}
                name="filterConditions"
                className="mb1"
                onChange={onChangeCondition}
                value={condition.Comparator.value}
            />

            <div className="flex flex-column w100">
                {condition.Values.map((value, i) => {
                    return (
                        <EditConditionValue value={value} onEdit={onEdit} onClickDelete={onDelete} key={'index' + i} />
                    );
                })}

                <AddConditionValue onAdd={onAdd} />
                {hasError('value') ? (
                    <ErrorZone id="ActionsError">{c('Error').t`You must set a value`}</ErrorZone>
                ) : null}
            </div>
        </>
    );
}

FilterConditionValues.propTypes = {
    condition: PropTypes.object.isRequired,
    error: PropTypes.object,
    options: PropTypes.array.isRequired,
    onDelete: PropTypes.func,
    onChangeCondition: PropTypes.func,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func
};

export default FilterConditionValues;
