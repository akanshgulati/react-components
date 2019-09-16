import React, { useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { addMinutes, startOfDay, format, parse } from 'date-fns';
import { dateLocale } from 'proton-shared/lib/i18n';

import Input from './Input';
import Dropdown from '../dropdown/Dropdown';
import TimeInputSelect from './TimeInputSelect';
import { usePopperAnchor } from '../popper';
import { generateUID } from '../../helpers/component';

const toFormatted = (value, locale) => {
    return format(value, 'p', { locale });
};

const fromFormatted = (value, locale) => {
    return parse(value, 'p', new Date(), { locale });
};

const TimeInput = ({ onChange, value, interval = 15, ...rest }) => {
    const [uid] = useState(generateUID('dropdown'));
    const { anchorRef, isOpen, open, close } = usePopperAnchor();
    const [temporaryInput, setTemporaryInput] = useState(() => toFormatted(value, dateLocale));

    useEffect(() => {
        setTemporaryInput(toFormatted(value, dateLocale));
    }, [value]);

    const handleSelectDate = (newDate) => {
        onChange(newDate);
    };

    const parseAndSetDate = () => {
        try {
            const newDate = fromFormatted(temporaryInput, dateLocale);
            const newDateTime = +newDate;
            if (!isNaN(newDateTime)) {
                handleSelectDate(newDate);
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}

        setTemporaryInput(toFormatted(value, dateLocale));
    };

    const handleBlur = () => {
        parseAndSetDate(temporaryInput);
        close();
    };

    const handleKeyDown = ({ key }) => {
        if (key === 'Enter') {
            parseAndSetDate(temporaryInput);
        }

        if (key === 'ArrowDown') {
            handleSelectDate(addMinutes(value, interval));
        }

        if (key === 'ArrowUp') {
            handleSelectDate(addMinutes(value, -1 * interval));
        }
    };

    const listRef = useRef();
    const options = useMemo(() => {
        const multiplier = (24 * 60) / interval;
        const base = startOfDay(value);
        return Array.from({ length: multiplier }, (a, i) => {
            const value = addMinutes(base, i * interval);
            return {
                value,
                label: format(value, 'p', { locale: dateLocale })
            };
        });
    }, []);

    const matchingValue = (() => {
        const first = options.find(({ label }) => label.includes(temporaryInput));
        if (first) {
            return first.value;
        }
        const temporaryInput2 = temporaryInput.slice(2);
        const second = options.find(({ label }) => label.includes(temporaryInput2));
        return second ? second.value : undefined;
    })();

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const selectedEl = listRef.current.querySelector('[data-is-selected=true]');
        if (selectedEl) {
            listRef.current.scrollTop =
                selectedEl.offsetTop - (listRef.current.clientHeight - selectedEl.clientHeight) / 2;
        }
    }, [matchingValue, isOpen]);

    return (
        <>
            <Input
                type="text"
                ref={anchorRef}
                onFocus={() => open()}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onClick={() => open()}
                value={temporaryInput}
                onChange={({ target: { value } }) => setTemporaryInput(value)}
                {...rest}
            />
            <Dropdown size="narrow" id={uid} isOpen={isOpen} anchorRef={anchorRef} onClose={close} autoClose={false}>
                <div className="dropDown-content" onMouseDown={(e) => e.preventDefault()} ref={listRef}>
                    <TimeInputSelect
                        value={matchingValue}
                        options={options}
                        onSelect={(newDate) => {
                            handleSelectDate(newDate);
                            close();
                        }}
                    />
                </div>
            </Dropdown>
        </>
    );
};

TimeInput.propTypes = {
    value: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    interval: PropTypes.number
};

export default TimeInput;
