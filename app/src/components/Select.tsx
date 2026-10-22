import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { sounds } from '../sound';

export interface SelectOption<T extends string> {
  id: T;
  label: string;
  description?: string;
}

interface SelectProps<T extends string> {
  id?: string;
  value: T | '';
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name when no visible `<label htmlFor>` points at the button. */
  ariaLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TYPEAHEAD_RESET_MS = 600;

/**
 * Fully skinnable replacement for the native `<select>` (whose popup cannot be styled):
 * a WAI-ARIA "select-only combobox" — a button that owns a listbox popup — with
 * arrow/Home/End/typeahead navigation, Escape to cancel and outside-click dismissal.
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
 */
export function Select<T extends string>({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = 'Choose…',
  disabled = false,
  className = '',
}: SelectProps<T>) {
  const autoId = useId();
  const buttonId = id ?? `select-${autoId}`;
  const listId = `${buttonId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState<'below' | 'above'>('below');
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });

  const selectedIndex = options.findIndex((option) => option.id === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const openList = () => {
    if (disabled || options.length === 0) return;
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
    sounds.open();
  };

  const closeList = (silent = false) => {
    setOpen(false);
    if (!silent) sounds.close();
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    setOpen(false);
    if (option.id !== value) onChange(option.id);
    sounds.select();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeList();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
    // closeList is stable in behaviour; re-binding on every render is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Flip the popup upwards when it would overflow the viewport (or the settings drawer).
  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setPlacement(below < 240 && rect.top > below ? 'above' : 'below');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[active] as HTMLElement | undefined;
    item?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const move = (index: number) => {
    const next = Math.min(options.length - 1, Math.max(0, index));
    if (next !== active) sounds.hover();
    setActive(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const { key } = event;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(key)) {
        event.preventDefault();
        openList();
        if (key === 'Home') setActive(0);
        if (key === 'End') setActive(options.length - 1);
      }
      return;
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        move(active + 1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) commit(active);
        else move(active - 1);
        return;
      case 'Home':
        event.preventDefault();
        move(0);
        return;
      case 'End':
        event.preventDefault();
        move(options.length - 1);
        return;
      case 'PageDown':
        event.preventDefault();
        move(active + 8);
        return;
      case 'PageUp':
        event.preventDefault();
        move(active - 8);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(active);
        return;
      case 'Tab':
        commit(active);
        return;
      case 'Escape':
        // Keep the Escape inside the popup: the settings drawer also closes on Escape.
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        closeList();
        return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const now = Date.now();
      const state = typeahead.current;
      state.text = now - state.at > TYPEAHEAD_RESET_MS ? key.toLowerCase() : state.text + key.toLowerCase();
      state.at = now;
      const start = state.text.length === 1 ? active + 1 : active;
      for (let offset = 0; offset < options.length; offset += 1) {
        const index = (start + offset) % options.length;
        if (options[index].label.toLowerCase().startsWith(state.text)) {
          move(index);
          break;
        }
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={`select ${className}`.trim()}
      data-open={open ? 'true' : 'false'}
      data-placement={placement}
    >
      <button
        id={buttonId}
        type="button"
        className="select-button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onPointerEnter={() => sounds.hover()}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          if (open && !rootRef.current?.contains(event.relatedTarget as Node)) closeList(true);
        }}
      >
        <span className="select-value">{selected?.label ?? placeholder}</span>
        <span className="select-chevron" aria-hidden="true" />
      </button>
      <ul
        id={listId}
        ref={listRef}
        className="select-list"
        role="listbox"
        aria-labelledby={buttonId}
        hidden={!open}
        tabIndex={-1}
      >
        {options.map((option, index) => (
          <li
            key={option.id}
            id={`${listId}-${index}`}
            role="option"
            className="select-option"
            aria-selected={option.id === value}
            data-active={index === active ? 'true' : 'false'}
            title={option.description}
            onPointerMove={() => index !== active && move(index)}
            // Keep focus on the button so the listbox does not blur-close before the click lands.
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => commit(index)}
          >
            <span>{option.label}</span>
            {option.description && <small>{option.description}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}
