import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type DateRange = {
  from?: string; // YYYY-MM-DD
  until?: string; // YYYY-MM-DD
};

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeFilterComponent implements OnChanges, OnDestroy {
  // Input list of dates in YYYY-MM-DD
  @Input() dates: string[] | null = null;

  // Initial selection (optional)
  @Input() initialFrom?: string;
  @Input() initialUntil?: string;

  // Optional explicit domain override (YYYY-MM-DD). When provided, these
  // take precedence over computed min/max from `dates`.
  @Input() domainMin?: string;
  @Input() domainMax?: string;

  // Labels
  @Input() fromLabel = 'From date';
  @Input() untilLabel = 'Until date';

  // Debounce duration for emitting range changes (ms)
  @Input() emitDebounceMs = 1000;

  // Emit when selection changes
  @Output() rangeChange = new EventEmitter<DateRange>();

  // Internal signals for slider numeric domain (days since epoch)
  readonly minDay = signal<number | null>(null);
  readonly maxDay = signal<number | null>(null);

  // Slider values
  readonly fromDay = signal<number | null>(null);
  readonly untilDay = signal<number | null>(null);

  // Derived formatted strings
  readonly minDateStr = computed(() => (this.minDay() != null ? this.dayToDateStr(this.minDay()!) : ''));
  readonly maxDateStr = computed(() => (this.maxDay() != null ? this.dayToDateStr(this.maxDay()!) : ''));
  readonly fromDateStr = computed(() => (this.fromDay() != null ? this.dayToDateStr(this.fromDay()!) : ''));
  readonly untilDateStr = computed(() => (this.untilDay() != null ? this.dayToDateStr(this.untilDay()!) : ''));

  // Internal debounce state
  private emitTimer: any = null;
  private lastPending: DateRange | null = null;
  private lastEmitted: DateRange | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dates'] || changes['domainMin'] || changes['domainMax']) {
      this.recalculateDomain();
    }
    if (changes['initialFrom'] || changes['initialUntil']) {
      this.applyInitialSelection();
      this.emitRange();
    }
  }

  ngOnDestroy(): void {
    if (this.emitTimer) {
      clearTimeout(this.emitTimer);
      this.emitTimer = null;
    }
  }

  // Convert YYYY-MM-DD to UTC day index (days since Unix epoch)
  private dateStrToDay(dateStr: string): number | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    // Validate month/day
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const utcMs = Date.UTC(y, mo - 1, d, 0, 0, 0, 0);
    return Math.floor(utcMs / 86400000);
  }

  private dayToDateStr(day: number): string {
    const ms = day * 86400000;
    const dt = new Date(ms);
    const y = dt.getUTCFullYear();
    const m = (dt.getUTCMonth() + 1).toString().padStart(2, '0');
    const d = dt.getUTCDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private recalculateDomain(): void {
    // 1) Determine domain, preferring explicit overrides if provided
    let min: number | null = null;
    let max: number | null = null;

    const overrideMin = this.domainMin ? this.dateStrToDay(this.domainMin) : null;
    const overrideMax = this.domainMax ? this.dateStrToDay(this.domainMax) : null;

    if (overrideMin != null && overrideMax != null) {
      min = Math.min(overrideMin, overrideMax);
      max = Math.max(overrideMin, overrideMax);
    } else {
      const uniqueDays: number[] = [];
      if (Array.isArray(this.dates)) {
        const seen = new Set<number>();
        for (const s of this.dates) {
          const day = this.dateStrToDay(String(s));
          if (day != null && !seen.has(day)) {
            seen.add(day);
            uniqueDays.push(day);
          }
        }
      }

      if (uniqueDays.length > 0) {
        uniqueDays.sort((a, b) => a - b);
        min = uniqueDays[0];
        max = uniqueDays[uniqueDays.length - 1];
      }
    }

    if (min == null || max == null) {
      this.minDay.set(null);
      this.maxDay.set(null);
      this.fromDay.set(null);
      this.untilDay.set(null);
      return;
    }

    this.minDay.set(min);
    this.maxDay.set(max);

    // Preserve current selection within new domain if possible
    const curFrom = this.fromDay();
    const curUntil = this.untilDay();

    const initFrom = curFrom != null ? this.clamp(curFrom, min, max) : min;
    const initUntil = curUntil != null ? this.clamp(curUntil, initFrom, max) : max;

    this.fromDay.set(initFrom);
    this.untilDay.set(initUntil);

    // Apply provided initial values if present
    this.applyInitialSelection();

    this.emitRange();
  }

  private applyInitialSelection(): void {
    const min = this.minDay();
    const max = this.maxDay();
    if (min == null || max == null) return;

    if (this.initialFrom) {
      const d = this.dateStrToDay(this.initialFrom);
      if (d != null) this.fromDay.set(this.clamp(d, min, max));
    }
    if (this.initialUntil) {
      const d = this.dateStrToDay(this.initialUntil);
      if (d != null) this.untilDay.set(this.clamp(d, this.fromDay() ?? min, max));
    }

    // Ensure ordering
    if (this.fromDay()! > this.untilDay()!) {
      this.untilDay.set(this.fromDay());
    }
  }

  onFromSliderChange(value: string): void {
    const min = this.minDay();
    const max = this.maxDay();
    if (min == null || max == null) return;
    const v = this.clamp(Number(value), min, this.untilDay() ?? max);
    this.fromDay.set(v);

    // Keep until >= from
    if (this.untilDay() == null || this.untilDay()! < v) {
      this.untilDay.set(v);
    }

    this.emitRange();
  }

  onUntilSliderChange(value: string): void {
    const min = this.minDay();
    const max = this.maxDay();
    if (min == null || max == null) return;
    const v = this.clamp(Number(value), this.fromDay() ?? min, max);
    this.untilDay.set(v);

    // Keep from <= until
    if (this.fromDay() == null || this.fromDay()! > v) {
      this.fromDay.set(v);
    }

    this.emitRange();
  }

  clear(): void {
    // Reset to full range
    if (this.minDay() != null && this.maxDay() != null) {
      this.fromDay.set(this.minDay());
      this.untilDay.set(this.maxDay());
      this.emitRange();
    }
  }

  private emitRange(): void {
    // Build current range snapshot
    const payload: DateRange =
      this.fromDay() == null || this.untilDay() == null
        ? {}
        : {
            from: this.dayToDateStr(this.fromDay()!),
            until: this.dayToDateStr(this.untilDay()!),
          };

    this.lastPending = payload;

    // Debounce emit
    if (this.emitTimer) {
      clearTimeout(this.emitTimer);
    }
    const delay = Math.max(0, this.emitDebounceMs | 0);
    this.emitTimer = setTimeout(() => {
      const toEmit = this.lastPending ?? {};
      if (!this.isSameRange(toEmit, this.lastEmitted ?? {})) {
        this.rangeChange.emit(toEmit);
        this.lastEmitted = { ...toEmit };
      }
      this.emitTimer = null;
    }, delay || 1000);
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
  }

  private isSameRange(a: DateRange, b: DateRange): boolean {
    const af = a.from ?? '';
    const au = a.until ?? '';
    const bf = b.from ?? '';
    const bu = b.until ?? '';
    return af === bf && au === bu;
  }
}
