# Design System

## Direction

“Make the wait visible before the food.” The product behaves like a focused consumer utility, not a restaurant directory or analytics dashboard. Queue time is always the fastest signal to read; value and rating explain whether that time is justified.

## Visual Language

- Warm paper ground (`#f7f3eb`) and near-white food surfaces (`#fffdf8`).
- Ink (`#171714`) for hierarchy, chilli red (`#d8442f`) for actions and time pressure, and leaf green (`#23745a`) for positive value judgments.
- Bai Jamjuree carries interface, headings, and queue numerals for one consistent Thai typographic voice.
- Dividers structure lists. Cards are reserved for images, tickets, and interruptions that genuinely need a boundary.
- Corners use 12–16px radii; pills are limited to compact filters and live-queue status.
- Spacing follows a 4px base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px. Related facts stay tight; sections and task changes receive the larger intervals.

## Hierarchy

1. Restaurant name
2. Estimated wait
3. Worth-it score
4. Rating
5. Price

Waiting states always combine words and numbers. Color supports meaning but never carries it alone.

## Interaction

- Route-like screen changes use a brief upward settle.
- Restaurant rows are fully clickable; compare selection has an independent control.
- Queue progress is user-simulatable and also advances on a timer.
- At three groups remaining, a blocking bottom sheet provides a clear return-to-restaurant action.
- Google Maps directions are available from restaurant detail, the active queue, and the three-groups-left notification. They open in a separate tab and use the restaurant name plus Siam Square as the destination query.
- Persistent bottom navigation keeps discovery, comparison, and queue state within one tap.

## Responsive Behavior

The interface has two context-specific compositions. Below 900px it remains a touch-first, single-column experience with persistent bottom navigation. At 900px and above it becomes a full-width website with a 1200px content canvas, top navigation, multi-column discovery lists, a side-by-side restaurant detail view, and expanded comparison and queue layouts. Information architecture and the wait-first hierarchy remain consistent across both contexts.
